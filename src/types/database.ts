export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          id: string
          name: string
          contact: string | null
          email: string | null
          phone: string | null
          address: string | null
          payment_terms: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          payment_terms?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          payment_terms?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_orders: {
        Row: {
          id: string
          customer_id: string | null
          order_number: string
          stage: string
          quote_amount: number
          final_price: number | null
          advance: number
          outstanding: number
          primary_vendor_id: string | null
          started_at: string
          due_at: string | null
          completed_at: string | null
          delivered_at: string | null
          paid_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          order_number: string
          stage: string
          quote_amount?: number
          final_price?: number | null
          advance?: number
          outstanding?: number
          primary_vendor_id?: string | null
          started_at?: string
          due_at?: string | null
          completed_at?: string | null
          delivered_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          order_number?: string
          stage?: string
          quote_amount?: number
          final_price?: number | null
          advance?: number
          outstanding?: number
          primary_vendor_id?: string | null
          started_at?: string
          due_at?: string | null
          completed_at?: string | null
          delivered_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_primary_vendor_id_fkey"
            columns: ["primary_vendor_id"]
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
      materials: {
        Row: {
          id: string
          order_id: string | null
          item_name: string
          quantity: number
          unit: string
          vendor_id: string | null
          estimated_cost: number
          actual_cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          item_name: string
          quantity: number
          unit?: string
          vendor_id?: string | null
          estimated_cost?: number
          actual_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          item_name?: string
          quantity?: number
          unit?: string
          vendor_id?: string | null
          estimated_cost?: number
          actual_cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_vendor_id_fkey"
            columns: ["vendor_id"]
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          id: string
          vendor_id: string | null
          expense_number: string
          stage: string
          bill_amount: number
          paid_amount: number
          for_order_id: string | null
          ordered_at: string
          due_at: string | null
          paid_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id?: string | null
          expense_number: string
          stage: string
          bill_amount?: number
          paid_amount?: number
          for_order_id?: string | null
          ordered_at?: string
          due_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string | null
          expense_number?: string
          stage?: string
          bill_amount?: number
          paid_amount?: number
          for_order_id?: string | null
          ordered_at?: string
          due_at?: string | null
          paid_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_vendor_id_fkey"
            columns: ["vendor_id"]
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_for_order_id_fkey"
            columns: ["for_order_id"]
            referencedRelation: "customer_orders"
            referencedColumns: ["id"]
          }
        ]
      }
      expense_items: {
        Row: {
          id: string
          expense_id: string | null
          item_name: string
          quantity: number | null
          unit_price: number | null
          total_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          expense_id?: string | null
          item_name: string
          quantity?: number | null
          unit_price?: number | null
          total_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          expense_id?: string | null
          item_name?: string
          quantity?: number | null
          unit_price?: number | null
          total_price?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_items_expense_id_fkey"
            columns: ["expense_id"]
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          type: string
          reference_id: string
          amount: number
          payment_method: string | null
          transaction_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          reference_id: string
          amount: number
          payment_method?: string | null
          transaction_date?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          reference_id?: string
          amount?: number
          payment_method?: string | null
          transaction_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
