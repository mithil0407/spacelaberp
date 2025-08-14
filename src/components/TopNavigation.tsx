'use client'

import { Button } from '@/components/ui/button'
import { useKanbanStore } from '@/store/kanban-store'
import { cn } from '@/lib/utils'

export function TopNavigation() {
  const { workflowTab, setWorkflowTab } = useKanbanStore()

  const tabs = [
    { key: 'both', label: 'Both' },
    { key: 'orders', label: 'Orders' },
    { key: 'expenses', label: 'Expenses' },
  ] as const

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={workflowTab === tab.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => setWorkflowTab(tab.key)}
          className={cn(
            "transition-all",
            workflowTab === tab.key && "shadow-sm"
          )}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
