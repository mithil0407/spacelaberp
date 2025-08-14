'use client'

import { useMemo } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { OrderForm } from './OrderForm'
import { ExpenseForm } from './ExpenseForm'
import { useKanbanStore } from '@/store/kanban-store'

export function StageModal() {
  const { activeModal, setActiveModal, orders, expenses } = useKanbanStore()

  const activeRecord = useMemo(() => {
    if (!activeModal.type || !activeModal.id) return null
    
    if (activeModal.type === 'order') {
      return orders.find(order => order.id === activeModal.id)
    } else {
      return expenses.find(expense => expense.id === activeModal.id)
    }
  }, [activeModal, orders, expenses])

  if (!activeModal.type || !activeRecord) return null

  const title = `${activeModal.type === 'order' ? 'Order' : 'Expense'} · ${activeModal.stage || activeRecord.stage}`

  return (
    <Dialog 
      open={!!activeModal.type} 
      onOpenChange={(open) => !open && setActiveModal({ type: null })}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {activeModal.type === 'order' ? (
            <OrderForm order={activeRecord as any} />
          ) : (
            <ExpenseForm expense={activeRecord as any} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
