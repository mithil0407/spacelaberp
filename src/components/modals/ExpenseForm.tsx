'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanban-store'
import type { Expense } from '@/types'

interface ExpenseFormProps {
  expense: Expense
}

export function ExpenseForm({ expense }: ExpenseFormProps) {
  const { updateExpense, setActiveModal } = useKanbanStore()
  
  const [form, setForm] = useState({
    vendor_name: expense.vendor?.name || '',
    bill_amount: expense.bill_amount || 0,
    for_order_number: expense.for_order?.order_number || '',
    due_at: expense.due_at ? new Date(expense.due_at).toISOString().split('T')[0] : '',
    notes: expense.notes || '',
    items: expense.expense_items?.map(item => item.item_name).join(', ') || '',
  })

  const handleSave = async () => {
    try {
      const updates: Partial<Expense> = {
        bill_amount: Number(form.bill_amount),
        due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
        notes: form.notes,
      }

      await updateExpense(expense.id, updates)
      setActiveModal({ type: null })
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor</Label>
          <Input
            id="vendor"
            value={form.vendor_name}
            onChange={(e) => setForm(prev => ({ ...prev, vendor_name: e.target.value }))}
            placeholder="Vendor name"
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bill">Bill Amount</Label>
          <Input
            id="bill"
            type="number"
            value={form.bill_amount}
            onChange={(e) => setForm(prev => ({ ...prev, bill_amount: Number(e.target.value) }))}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="order">For Order</Label>
          <Input
            id="order"
            value={form.for_order_number}
            onChange={(e) => setForm(prev => ({ ...prev, for_order_number: e.target.value }))}
            placeholder="Order number"
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="due">Due Date</Label>
          <Input
            id="due"
            type="date"
            value={form.due_at}
            onChange={(e) => setForm(prev => ({ ...prev, due_at: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="items">Items</Label>
        <Input
          id="items"
          value={form.items}
          onChange={(e) => setForm(prev => ({ ...prev, items: e.target.value }))}
          placeholder="Comma-separated list of items"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={form.notes}
          onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Expense notes"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline" 
          onClick={() => setActiveModal({ type: null })}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
