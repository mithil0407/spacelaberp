'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanban-store'
import type { CustomerOrder } from '@/types'

interface OrderFormProps {
  order: CustomerOrder
}

export function OrderForm({ order }: OrderFormProps) {
  const { updateOrder, setActiveModal, customers, vendors } = useKanbanStore()
  
  const [form, setForm] = useState({
    customer_name: order.customer?.name || '',
    quote_amount: order.quote_amount || 0,
    final_price: order.final_price || '',
    advance: order.advance || 0,
    primary_vendor_name: order.primary_vendor?.name || '',
    due_at: order.due_at ? new Date(order.due_at).toISOString().split('T')[0] : '',
    notes: order.notes || '',
  })

  const handleSave = async () => {
    try {
      const finalPrice = form.final_price === '' ? null : Number(form.final_price)
      const advance = Number(form.advance || 0)
      
      const updates: Partial<CustomerOrder> = {
        quote_amount: Number(form.quote_amount),
        final_price: finalPrice,
        advance,
        due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
        notes: form.notes,
      }

      await updateOrder(order.id, updates)
      setActiveModal({ type: null })
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            value={form.customer_name}
            onChange={(e) => setForm(prev => ({ ...prev, customer_name: e.target.value }))}
            placeholder="Customer name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vendor">Primary Vendor</Label>
          <Input
            id="vendor"
            value={form.primary_vendor_name}
            onChange={(e) => setForm(prev => ({ ...prev, primary_vendor_name: e.target.value }))}
            placeholder="Vendor name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quote">Quote Amount</Label>
          <Input
            id="quote"
            type="number"
            value={form.quote_amount}
            onChange={(e) => setForm(prev => ({ ...prev, quote_amount: Number(e.target.value) }))}
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="final">Final Price</Label>
          <Input
            id="final"
            type="number"
            value={form.final_price}
            onChange={(e) => setForm(prev => ({ ...prev, final_price: e.target.value }))}
            placeholder="Final agreed price"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="advance">Advance Received</Label>
          <Input
            id="advance"
            type="number"
            value={form.advance}
            onChange={(e) => setForm(prev => ({ ...prev, advance: Number(e.target.value) }))}
            placeholder="0"
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
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={form.notes}
          onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Order notes and requirements"
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
