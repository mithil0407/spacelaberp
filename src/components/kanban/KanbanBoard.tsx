'use client'

import { useMemo } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from '@dnd-kit/core'
import { StageColumn } from './StageColumn'
import { OrderCard } from './OrderCard'
import { ExpenseCard } from './ExpenseCard'
import { useKanbanStore } from '@/store/kanban-store'
import { ORDER_STAGES, EXPENSE_STAGES } from '@/types'
import type { CustomerOrder, Expense } from '@/types'

export function KanbanBoard() {
  const { 
    orders, 
    expenses, 
    workflowTab, 
    dragState, 
    setDragState, 
    moveCard 
  } = useKanbanStore()

  // Group orders by stage
  const groupedOrders = useMemo(() => {
    const groups: Record<string, CustomerOrder[]> = {}
    ORDER_STAGES.forEach(stage => {
      groups[stage] = orders.filter(order => order.stage === stage)
    })
    return groups
  }, [orders])

  // Group expenses by stage
  const groupedExpenses = useMemo(() => {
    const groups: Record<string, Expense[]> = {}
    EXPENSE_STAGES.forEach(stage => {
      groups[stage] = expenses.filter(expense => expense.stage === stage)
    })
    return groups
  }, [expenses])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const draggedItem = active.data.current as { type: 'order' | 'expense', id: string }
    
    setDragState({
      isDragging: true,
      draggedItem
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setDragState({ isDragging: false })

    if (!over || !active.data.current) return

    const draggedItem = active.data.current as { type: 'order' | 'expense', id: string }
    const dropTarget = over.data.current as { type: 'order' | 'expense', stage: string }

    // Only allow dropping on the same workflow type
    if (draggedItem.type !== dropTarget.type) return

    // Move the card to the new stage
    moveCard(draggedItem.type, draggedItem.id, dropTarget.stage as any)
  }

  const activeDraggedItem = useMemo(() => {
    if (!dragState.isDragging || !dragState.draggedItem) return null

    const { type, id } = dragState.draggedItem
    
    if (type === 'order') {
      return orders.find(order => order.id === id)
    } else {
      return expenses.find(expense => expense.id === id)
    }
  }, [dragState, orders, expenses])

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-container flex flex-col gap-4">
        {/* Customer Orders */}
        {(workflowTab === 'both' || workflowTab === 'orders') && (
          <section className="customer-orders rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:h-[60vh]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">Customer Orders</h2>
            </div>
            <div className="kanban-scroll flex w-full gap-3 overflow-x-auto pb-2">
              {ORDER_STAGES.map(stage => (
                <StageColumn
                  key={stage}
                  title={stage}
                  type="order"
                  stage={stage}
                  cards={groupedOrders[stage] || []}
                />
              ))}
            </div>
          </section>
        )}

        {/* Expenses */}
        {(workflowTab === 'both' || workflowTab === 'expenses') && (
          <section className="expense-orders rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:h-[40vh]">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">Expenses</h2>
            </div>
            <div className="kanban-scroll flex w-full gap-3 overflow-x-auto pb-2">
              {EXPENSE_STAGES.map(stage => (
                <StageColumn
                  key={stage}
                  title={stage}
                  type="expense"
                  stage={stage}
                  cards={groupedExpenses[stage] || []}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDraggedItem && dragState.draggedItem?.type === 'order' && (
          <OrderCard order={activeDraggedItem as CustomerOrder} isDragging />
        )}
        {activeDraggedItem && dragState.draggedItem?.type === 'expense' && (
          <ExpenseCard expense={activeDraggedItem as Expense} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}
