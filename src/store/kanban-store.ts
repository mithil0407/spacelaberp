import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { 
  CustomerOrder, 
  Expense, 
  Customer, 
  Vendor, 
  ModalState, 
  DragState, 
  FinancialMetrics,
  OrderStage,
  ExpenseStage
} from '@/types'
import { dbService } from '@/lib/supabase'

interface KanbanState {
  // Data
  orders: CustomerOrder[]
  expenses: Expense[]
  customers: Customer[]
  vendors: Vendor[]
  metrics: FinancialMetrics

  // UI State
  activeModal: ModalState
  dragState: DragState
  workflowTab: 'both' | 'orders' | 'expenses'
  loading: boolean
  error: string | null

  // Actions
  loadData: () => Promise<void>
  moveCard: (type: 'order' | 'expense', id: string, newStage: OrderStage | ExpenseStage) => Promise<void>
  updateOrder: (id: string, updates: Partial<CustomerOrder>) => Promise<void>
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>
  createOrder: (orderData: Partial<CustomerOrder>) => Promise<void>
  createExpense: (expenseData: Partial<Expense>) => Promise<void>
  createCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  createVendor: (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  
  // UI Actions
  setActiveModal: (modal: ModalState) => void
  setDragState: (state: DragState) => void
  setWorkflowTab: (tab: 'both' | 'orders' | 'expenses') => void
  setError: (error: string | null) => void
}

export const useKanbanStore = create<KanbanState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    orders: [],
    expenses: [],
    customers: [],
    vendors: [],
    metrics: {
      totalRevenue: 0,
      expensePaid: 0,
      outstandingPayments: 0,
      billsToPay: 0,
    },
    activeModal: { type: null },
    dragState: { isDragging: false },
    workflowTab: 'both',
    loading: false,
    error: null,

    // Actions
    loadData: async () => {
      set({ loading: true, error: null })
      try {
        const [orders, expenses, customers, vendors, metrics] = await Promise.all([
          dbService.getCustomerOrders(),
          dbService.getExpenses(),
          dbService.getCustomers(),
          dbService.getVendors(),
          dbService.getFinancialMetrics(),
        ])

        set({
          orders: orders as CustomerOrder[],
          expenses: expenses as Expense[],
          customers,
          vendors,
          metrics,
          loading: false,
        })
      } catch (error) {
        console.error('Failed to load data:', error)
        set({ 
          error: error instanceof Error ? error.message : 'Failed to load data',
          loading: false 
        })
      }
    },

    moveCard: async (type, id, newStage) => {
      try {
        if (type === 'order') {
          const updatedOrder = await dbService.updateCustomerOrder(id, { stage: newStage as OrderStage })
          set(state => ({
            orders: state.orders.map(o => o.id === id ? (updatedOrder as CustomerOrder) : o)
          }))
          
          // Update metrics after stage change
          const metrics = await dbService.getFinancialMetrics()
          set({ metrics })
          
          // Open stage-specific modal
          set({ activeModal: { type: 'order', id, stage: newStage as OrderStage } })
        } else {
          const updatedExpense = await dbService.updateExpense(id, { stage: newStage as ExpenseStage })
          set(state => ({
            expenses: state.expenses.map(e => e.id === id ? (updatedExpense as Expense) : e)
          }))
          
          // Update metrics after stage change
          const metrics = await dbService.getFinancialMetrics()
          set({ metrics })
          
          // Open stage-specific modal
          set({ activeModal: { type: 'expense', id, stage: newStage as ExpenseStage } })
        }
      } catch (error) {
        console.error('Failed to move card:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to move card' })
      }
    },

    updateOrder: async (id, updates) => {
      try {
        const updatedOrder = await dbService.updateCustomerOrder(id, updates)
        set(state => ({
          orders: state.orders.map(o => o.id === id ? (updatedOrder as CustomerOrder) : o)
        }))
        
        // Update metrics if financial data changed
        if (updates.advance !== undefined || updates.final_price !== undefined || updates.stage !== undefined) {
          const metrics = await dbService.getFinancialMetrics()
          set({ metrics })
        }
      } catch (error) {
        console.error('Failed to update order:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to update order' })
      }
    },

    updateExpense: async (id, updates) => {
      try {
        const updatedExpense = await dbService.updateExpense(id, updates)
        set(state => ({
          expenses: state.expenses.map(e => e.id === id ? (updatedExpense as Expense) : e)
        }))
        
        // Update metrics if financial data changed
        if (updates.bill_amount !== undefined || updates.stage !== undefined) {
          const metrics = await dbService.getFinancialMetrics()
          set({ metrics })
        }
      } catch (error) {
        console.error('Failed to update expense:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to update expense' })
      }
    },

    createOrder: async (orderData: Partial<CustomerOrder>): Promise<void> => {
      try {
        const newOrder = await dbService.createCustomerOrder({
          customer_id: orderData.customer_id || '',
          stage: 'Quotations',
          quote_amount: orderData.quote_amount || 0,
          advance: orderData.advance || 0,
          notes: orderData.notes || '',
        })
        
        set(state => ({
          orders: [(newOrder as CustomerOrder), ...state.orders]
        }))
        
        const metrics = await dbService.getFinancialMetrics()
        set({ metrics })
      } catch (error) {
        console.error('Failed to create order:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to create order' })
        throw error
      }
    },

    createExpense: async (expenseData: Partial<Expense>): Promise<void> => {
      try {
        const newExpense = await dbService.createExpense({
          vendor_id: expenseData.vendor_id || '',
          stage: 'PO Sent',
          bill_amount: expenseData.bill_amount || 0,
          for_order_id: expenseData.for_order_id,
          notes: expenseData.notes || '',
        })
        
        set(state => ({
          expenses: [(newExpense as Expense), ...state.expenses]
        }))
        
        const metrics = await dbService.getFinancialMetrics()
        set({ metrics })
      } catch (error) {
        console.error('Failed to create expense:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to create expense' })
        throw error
      }
    },

    createCustomer: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
      try {
        const newCustomer = await dbService.createCustomer(customer)
        set(state => ({
          customers: [...state.customers, newCustomer].sort((a, b) => a.name.localeCompare(b.name))
        }))
        return newCustomer
      } catch (error) {
        console.error('Failed to create customer:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to create customer' })
        throw error
      }
    },

    createVendor: async (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Promise<Vendor> => {
      try {
        const newVendor = await dbService.createVendor(vendor)
        set(state => ({
          vendors: [...state.vendors, newVendor].sort((a, b) => a.name.localeCompare(b.name))
        }))
        return newVendor
      } catch (error) {
        console.error('Failed to create vendor:', error)
        set({ error: error instanceof Error ? error.message : 'Failed to create vendor' })
        throw error
      }
    },

    // UI Actions
    setActiveModal: (modal) => set({ activeModal: modal }),
    setDragState: (state) => set({ dragState: state }),
    setWorkflowTab: (tab) => set({ workflowTab: tab }),
    setError: (error) => set({ error }),
  }))
)
