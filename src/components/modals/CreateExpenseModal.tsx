'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKanbanStore } from '@/store/kanban-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CreateExpenseModalProps {
  open: boolean
  onClose: () => void
}

export function CreateExpenseModal({ open, onClose }: CreateExpenseModalProps) {
  const { createExpense, vendors, createVendor } = useKanbanStore()
  
  const [form, setForm] = useState({
    vendor_name: '',
    bill_amount: '',
    notes: '',
  })

  const [isCreatingVendor, setIsCreatingVendor] = useState(false)

  const handleCreateExpense = async () => {
    try {
      if (!form.vendor_name.trim()) {
        alert('Please enter a vendor name')
        return
      }

      if (!form.bill_amount || Number(form.bill_amount) <= 0) {
        alert('Please enter a valid bill amount')
        return
      }

      // Check if vendor exists, if not create them
      let vendorId = vendors.find(v => v.name.toLowerCase() === form.vendor_name.toLowerCase())?.id
      
      if (!vendorId) {
        setIsCreatingVendor(true)
        try {
          const newVendor = await createVendor({
            name: form.vendor_name.trim(),
            contact: '',
            email: '',
            phone: '',
            address: '',
            payment_terms: 30,
          })
          vendorId = newVendor.id
        } catch (error) {
          console.error('Failed to create vendor:', error)
          alert('Failed to create vendor. Please try again.')
          setIsCreatingVendor(false)
          return
        }
        setIsCreatingVendor(false)
      }

      // Create the expense
      await createExpense({
        vendor_id: vendorId,
        bill_amount: Number(form.bill_amount),
        notes: form.notes.trim() || undefined,
      })

      // Reset form and close modal
      setForm({ vendor_name: '', bill_amount: '', notes: '' })
      onClose()
    } catch (error) {
      console.error('Failed to create expense:', error)
      alert('Failed to create expense. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor Name *</Label>
            <Input
              id="vendor"
              value={form.vendor_name}
              onChange={(e) => setForm(prev => ({ ...prev, vendor_name: e.target.value }))}
              placeholder="Enter vendor name"
              disabled={isCreatingVendor}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bill">Bill Amount (₹) *</Label>
            <Input
              id="bill"
              type="number"
              value={form.bill_amount}
              onChange={(e) => setForm(prev => ({ ...prev, bill_amount: e.target.value }))}
              placeholder="0"
              disabled={isCreatingVendor}
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
              disabled={isCreatingVendor}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isCreatingVendor}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateExpense}
              disabled={isCreatingVendor || !form.vendor_name.trim() || !form.bill_amount}
            >
              {isCreatingVendor ? 'Creating...' : 'Create Expense'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
