'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanban-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CreateOrderModalProps {
  open: boolean
  onClose: () => void
}

export function CreateOrderModal({ open, onClose }: CreateOrderModalProps) {
  const { createOrder, customers, createCustomer } = useKanbanStore()
  
  const [form, setForm] = useState({
    customer_name: '',
    quote_amount: '',
    notes: '',
  })

  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false)

  const handleCreateOrder = async () => {
    try {
      if (!form.customer_name.trim()) {
        alert('Please enter a customer name')
        return
      }

      if (!form.quote_amount || Number(form.quote_amount) <= 0) {
        alert('Please enter a valid quote amount')
        return
      }

      // Check if customer exists, if not create them
      let customerId = customers.find(c => c.name.toLowerCase() === form.customer_name.toLowerCase())?.id
      
      if (!customerId) {
        setIsCreatingCustomer(true)
        try {
          const newCustomer = await createCustomer({
            name: form.customer_name.trim(),
            email: '',
            phone: '',
            address: '',
          })
          customerId = newCustomer.id
        } catch (error) {
          console.error('Failed to create customer:', error)
          alert('Failed to create customer. Please try again.')
          setIsCreatingCustomer(false)
          return
        }
        setIsCreatingCustomer(false)
      }

      // Create the order
      await createOrder({
        customer_id: customerId,
        quote_amount: Number(form.quote_amount),
        notes: form.notes.trim() || undefined,
      })

      // Reset form and close modal
      setForm({ customer_name: '', quote_amount: '', notes: '' })
      onClose()
    } catch (error) {
      console.error('Failed to create order:', error)
      alert('Failed to create order. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name *</Label>
            <Input
              id="customer"
              value={form.customer_name}
              onChange={(e) => setForm(prev => ({ ...prev, customer_name: e.target.value }))}
              placeholder="Enter customer name"
              disabled={isCreatingCustomer}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quote">Quote Amount (₹) *</Label>
            <Input
              id="quote"
              type="number"
              value={form.quote_amount}
              onChange={(e) => setForm(prev => ({ ...prev, quote_amount: e.target.value }))}
              placeholder="0"
              disabled={isCreatingCustomer}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Order notes and requirements"
              disabled={isCreatingCustomer}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isCreatingCustomer}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrder}
              disabled={isCreatingCustomer || !form.customer_name.trim() || !form.quote_amount}
            >
              {isCreatingCustomer ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
