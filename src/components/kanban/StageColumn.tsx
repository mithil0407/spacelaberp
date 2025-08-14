'use client'

import { useDroppable } from '@dnd-kit/core'
import { OrderCard } from './OrderCard'
import { ExpenseCard } from './ExpenseCard'
import { cn } from '@/lib/utils'
import type { CustomerOrder, Expense } from '@/types'

interface StageColumnProps {
  title: string
  type: 'order' | 'expense'
  stage: string
  cards: CustomerOrder[] | Expense[]
}

export function StageColumn({ title, type, stage, cards }: StageColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `${type}-${stage}`,
    data: {
      type,
      stage,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex min-h-[200px] w-[280px] min-w-[280px] flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-3 transition-colors",
        isOver && "border-blue-400 bg-blue-50"
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700">{title}</div>
        <div className="text-xs text-gray-500">{cards.length}</div>
      </div>
      
      <div className="flex flex-col gap-3">
        {cards.map((card) => (
          <div key={card.id}>
            {type === 'order' ? (
              <OrderCard order={card as CustomerOrder} />
            ) : (
              <ExpenseCard expense={card as Expense} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
