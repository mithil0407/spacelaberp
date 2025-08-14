import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database service functions
export const dbService = {
  // Customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async createCustomer(customer: Omit<Database['public']['Tables']['customers']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Vendors
  async getVendors() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async createVendor(vendor: Omit<Database['public']['Tables']['vendors']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Customer Orders
  async getCustomerOrders() {
    const { data, error } = await supabase
      .from('customer_orders')
      .select(`
        *,
        customer:customers(*),
        primary_vendor:vendors(*),
        materials(*, vendor:vendors(*))
      `)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createCustomerOrder(order: Omit<Database['public']['Tables']['customer_orders']['Insert'], 'id' | 'created_at' | 'updated_at' | 'order_number'>) {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`
    
    const { data, error } = await supabase
      .from('customer_orders')
      .insert({ ...order, order_number: orderNumber })
      .select(`
        *,
        customer:customers(*),
        primary_vendor:vendors(*),
        materials(*, vendor:vendors(*))
      `)
      .single()
    if (error) throw error
    return data
  },

  async updateCustomerOrder(id: string, updates: Database['public']['Tables']['customer_orders']['Update']) {
    const { data, error } = await supabase
      .from('customer_orders')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        primary_vendor:vendors(*),
        materials(*, vendor:vendors(*))
      `)
      .single()
    if (error) throw error
    return data
  },

  // Materials
  async createMaterial(material: Omit<Database['public']['Tables']['materials']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('materials')
      .insert(material)
      .select('*, vendor:vendors(*)')
      .single()
    if (error) throw error
    return data
  },

  async updateMaterials(orderId: string, materials: Array<Omit<Database['public']['Tables']['materials']['Insert'], 'id' | 'created_at' | 'updated_at' | 'order_id'>>) {
    // Delete existing materials for this order
    await supabase.from('materials').delete().eq('order_id', orderId)
    
    // Insert new materials
    if (materials.length > 0) {
      const { data, error } = await supabase
        .from('materials')
        .insert(materials.map(m => ({ ...m, order_id: orderId })))
        .select('*, vendor:vendors(*)')
      if (error) throw error
      return data
    }
    return []
  },

  // Expenses
  async getExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        vendor:vendors(*),
        for_order:customer_orders(order_number, customer:customers(name)),
        expense_items(*)
      `)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createExpense(expense: Omit<Database['public']['Tables']['expenses']['Insert'], 'id' | 'created_at' | 'updated_at' | 'expense_number'>) {
    // Generate expense number
    const expenseNumber = `PO-${Date.now()}`
    
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...expense, expense_number: expenseNumber })
      .select(`
        *,
        vendor:vendors(*),
        for_order:customer_orders(order_number, customer:customers(name)),
        expense_items(*)
      `)
      .single()
    if (error) throw error
    return data
  },

  async updateExpense(id: string, updates: Database['public']['Tables']['expenses']['Update']) {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        vendor:vendors(*),
        for_order:customer_orders(order_number, customer:customers(name)),
        expense_items(*)
      `)
      .single()
    if (error) throw error
    return data
  },

  // Transactions
  async createTransaction(transaction: Omit<Database['public']['Tables']['transactions']['Insert'], 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Financial metrics
  async getFinancialMetrics() {
    // Get all orders and expenses in parallel
    const [ordersResult, expensesResult] = await Promise.all([
      supabase.from('customer_orders').select('stage, advance, final_price'),
      supabase.from('expenses').select('stage, bill_amount')
    ])

    if (ordersResult.error) throw ordersResult.error
    if (expensesResult.error) throw expensesResult.error

    const orders = ordersResult.data || []
    const expenses = expensesResult.data || []

    // Calculate metrics
    const revenueReceived = orders
      .filter(o => ['Orders', 'WIP', 'Completed', 'Delivered', 'Paid'].includes(o.stage))
      .reduce((sum, o) => sum + (o.advance || 0), 0)

    const finalPaid = orders
      .filter(o => o.stage === 'Paid')
      .reduce((sum, o) => sum + (o.final_price || 0), 0)

    const totalRevenue = revenueReceived + finalPaid

    const expensePaid = expenses
      .filter(e => e.stage === 'Paid')
      .reduce((sum, e) => sum + (e.bill_amount || 0), 0)

    const outstandingPayments = orders.reduce((sum, o) => {
      const finalPrice = o.final_price || 0
      const advance = o.advance || 0
      const paid = o.stage === 'Paid' ? finalPrice : advance
      return sum + Math.max(0, finalPrice - paid)
    }, 0)

    const billsToPay = expenses
      .filter(e => ['Goods Received', 'Bill Received', 'Approved'].includes(e.stage))
      .reduce((sum, e) => sum + (e.bill_amount || 0), 0)

    return {
      totalRevenue,
      expensePaid,
      outstandingPayments,
      billsToPay
    }
  }
}
