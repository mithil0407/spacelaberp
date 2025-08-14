'use client'

import { useKanbanStore } from '@/store/kanban-store'
import { formatINR } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: number
  subtitle?: string
}

function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{formatINR(value)}</div>
      {subtitle && <div className="mt-1 text-xs text-gray-500">{subtitle}</div>}
    </div>
  )
}

export function FinancialMetrics() {
  const { metrics } = useKanbanStore()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard 
        title="Revenue (received)" 
        value={metrics.totalRevenue} 
        subtitle="Advance + Final payments" 
      />
      <MetricCard 
        title="Expenses (paid)" 
        value={metrics.expensePaid} 
      />
      <MetricCard 
        title="Outstanding Payments" 
        value={metrics.outstandingPayments} 
      />
      <MetricCard 
        title="Bills To Pay" 
        value={metrics.billsToPay} 
      />
    </div>
  )
}
