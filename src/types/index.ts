// Database types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerOrder {
  id: string;
  customer_id: string;
  order_number: string;
  stage: OrderStage;
  quote_amount: number;
  final_price?: number;
  advance: number;
  outstanding: number;
  primary_vendor_id?: string;
  started_at: string;
  due_at?: string;
  completed_at?: string;
  delivered_at?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Customer;
  primary_vendor?: Vendor;
  materials?: Material[];
}

export interface Material {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  unit: string;
  vendor_id?: string;
  estimated_cost: number;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
  // Relations
  vendor?: Vendor;
}

export interface Expense {
  id: string;
  vendor_id: string;
  expense_number: string;
  stage: ExpenseStage;
  bill_amount: number;
  paid_amount: number;
  for_order_id?: string;
  ordered_at: string;
  due_at?: string;
  paid_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  vendor?: Vendor;
  for_order?: CustomerOrder;
  expense_items?: ExpenseItem[];
}

export interface ExpenseItem {
  id: string;
  expense_id: string;
  item_name: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  reference_id: string;
  amount: number;
  payment_method?: string;
  transaction_date: string;
  notes?: string;
  created_at: string;
}

// Enums
export const ORDER_STAGES = [
  'Quotations',
  'Orders',
  'WIP',
  'Completed',
  'Delivered',
  'Paid',
] as const;

export const EXPENSE_STAGES = [
  'PO Sent',
  'Goods Received',
  'Bill Received',
  'Approved',
  'Paid',
  'Archived',
] as const;

export type OrderStage = typeof ORDER_STAGES[number];
export type ExpenseStage = typeof EXPENSE_STAGES[number];

// UI State types
export interface ModalState {
  type: 'order' | 'expense' | null;
  id?: string;
  stage?: OrderStage | ExpenseStage;
}

export interface DragState {
  isDragging: boolean;
  draggedItem?: {
    type: 'order' | 'expense';
    id: string;
  };
}

export interface FinancialMetrics {
  totalRevenue: number;
  expensePaid: number;
  outstandingPayments: number;
  billsToPay: number;
}

// Progress mapping
export const PROGRESS_BY_STAGE: Record<OrderStage, number> = {
  Quotations: 10,
  Orders: 25,
  WIP: 50,
  Completed: 75,
  Delivered: 90,
  Paid: 100,
};

// Form types
export interface OrderFormData {
  customer_id: string;
  quote_amount: number;
  final_price?: number;
  advance: number;
  primary_vendor_id?: string;
  due_at?: string;
  notes?: string;
}

export interface ExpenseFormData {
  vendor_id: string;
  bill_amount: number;
  for_order_id?: string;
  due_at?: string;
  notes?: string;
  items: string[];
}

export interface MaterialFormData {
  item_name: string;
  quantity: number;
  unit: string;
  vendor_id?: string;
  estimated_cost: number;
}
