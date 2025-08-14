import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "₹0"
  const val = Math.round(Number(amount) * 100) / 100
  return val.toLocaleString("en-IN", { 
    style: "currency", 
    currency: "INR", 
    maximumFractionDigits: 2 
  })
}

export function shortDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  return new Date(dateString).toLocaleDateString("en-GB", { 
    day: "2-digit", 
    month: "short" 
  })
}

export function generateOrderNumber(): string {
  return `ORD-${Date.now()}`
}

export function generateExpenseNumber(): string {
  return `PO-${Date.now()}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function calculateOutstanding(finalPrice?: number, advance?: number, stage?: string): number {
  if (!finalPrice) return 0
  const paid = stage === 'Paid' ? finalPrice : (advance || 0)
  return Math.max(0, finalPrice - paid)
}

export function getProgressPercentage(stage: string): number {
  const progressMap: Record<string, number> = {
    'Quotations': 10,
    'Orders': 25,
    'WIP': 50,
    'Completed': 75,
    'Delivered': 90,
    'Paid': 100,
  }
  return progressMap[stage] || 0
}
