'use client'

import { useDraggable } from '@dnd-kit/core'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKanbanStore } from '@/store/kanban-store'
import { formatINR, shortDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Expense } from '@/types'

interface ExpenseCardProps {
  expense: Expense
  isDragging?: boolean
}

export function ExpenseCard({ expense, isDragging = false }: ExpenseCardProps) {
  const { setActiveModal } = useKanbanStore()
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `expense-${expense.id}`,
    data: {
      type: 'expense',
      id: expense.id,
    },
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "group cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
        "active:cursor-grabbing",
        isDragging && "opacity-80"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="truncate text-[16px] font-semibold text-gray-900" title={expense.vendor?.name || 'Unknown Vendor'}>
          {expense.vendor?.name || 'Unknown Vendor'}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            setActiveModal({ type: 'expense', id: expense.id, stage: expense.stage })
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 text-sm">
        <div className="font-medium">{formatINR(expense.bill_amount)} (Bill)</div>
        <div className="text-gray-600">
          For: {expense.for_order?.order_number || 'General'}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-600">
        Items: {expense.expense_items?.length || 0}
      </div>
      
      <div className="mt-2 text-xs text-gray-600">
        Ordered: {shortDate(expense.ordered_at)} • Due: {shortDate(expense.due_at)}
      </div>
    </div>
  )
}
