'use client'

import { useDraggable } from '@dnd-kit/core'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKanbanStore } from '@/store/kanban-store'
import { formatINR, shortDate, getProgressPercentage, calculateOutstanding } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { CustomerOrder } from '@/types'

interface OrderCardProps {
  order: CustomerOrder
  isDragging?: boolean
}

export function OrderCard({ order, isDragging = false }: OrderCardProps) {
  const { setActiveModal } = useKanbanStore()
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `order-${order.id}`,
    data: {
      type: 'order',
      id: order.id,
    },
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const progressPercentage = getProgressPercentage(order.stage)
  const outstanding = calculateOutstanding(order.final_price, order.advance, order.stage)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "work-card group cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md",
        "active:cursor-grabbing",
        isDragging && "dragging opacity-80"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="truncate text-[16px] font-semibold text-gray-900" title={order.customer?.name || 'Unknown Customer'}>
          {order.customer?.name || 'Unknown Customer'}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-500 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation()
            setActiveModal({ type: 'order', id: order.id, stage: order.stage })
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-2 text-sm">
        {order.final_price != null ? (
          <>
            <div className="font-medium">{formatINR(order.final_price)} (Final)</div>
            <div className="text-gray-600">
              {formatINR(order.advance)} advance • {formatINR(outstanding)} outstanding
            </div>
          </>
        ) : (
          <div className="text-gray-600">Quote: {formatINR(order.quote_amount)}</div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2 h-2 w-full rounded bg-gray-100">
        <div
          className="progress-fill h-2 rounded"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        {order.materials?.length ? (
          <span>Materials: {order.materials.length}</span>
        ) : (
          <span>No materials</span>
        )}
        {order.primary_vendor?.name && (
          <span>• Vendor: {order.primary_vendor.name}</span>
        )}
        <span className="ml-auto">Started: {shortDate(order.started_at)}</span>
      </div>
    </div>
  )
}
