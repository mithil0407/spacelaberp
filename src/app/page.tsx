'use client'

import { useEffect } from 'react'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { FinancialMetrics } from '@/components/FinancialMetrics'
import { TopNavigation } from '@/components/TopNavigation'
import { StageModal } from '@/components/modals/StageModal'
import { useKanbanStore } from '@/store/kanban-store'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { 
    loadData, 
    loading, 
    error, 
    createOrder, 
    createExpense,
    setError 
  } = useKanbanStore()

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleQuickAddOrder = async () => {
    // For demo purposes, create with placeholder data
    // In real app, this would open a modal to get customer info
    await createOrder({
      customer_id: '', // This should be selected from existing customers
      quote_amount: 0,
      notes: 'New order - needs customer details',
    })
  }

  const handleQuickAddExpense = async () => {
    // For demo purposes, create with placeholder data
    await createExpense({
      vendor_id: '', // This should be selected from existing vendors
      bill_amount: 0,
      notes: 'New expense - needs vendor details',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gray-100 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Furniture Company Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleQuickAddOrder} variant="outline" size="sm">
            + Order
          </Button>
          <Button onClick={handleQuickAddExpense} variant="outline" size="sm">
            + Expense
          </Button>
          <Button 
            onClick={() => {
              if (confirm('Reset all data? This will reload from the database.')) {
                loadData()
              }
            }}
            variant="outline" 
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={() => setError(null)} variant="ghost" size="sm">
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Financial Metrics */}
      <FinancialMetrics />

      {/* Top Navigation */}
      <TopNavigation />

      {/* Kanban Board */}
      <KanbanBoard />

      {/* Modals */}
      <StageModal />
    </div>
  )
}
