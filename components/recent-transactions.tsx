"use client"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { formatCurrency, useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"
import { format } from "date-fns"

export function RecentTransactions() {
  const { getUserTransactions } = useFinanceStore()
  const { currentUser } = useAuthStore()

  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const recentTransactions = userTransactions.slice(0, 5)

  if (recentTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">No transactions yet</p>
        <p className="text-xs text-muted-foreground mt-1">Add a transaction to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center gap-4">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              transaction.type === "income" ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {transaction.type === "income" ? (
              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
            ) : (
              <ArrowDownLeft className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), "MMM d, yyyy")}</p>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-medium leading-none ${
                transaction.type === "income" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-muted-foreground">{transaction.category}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
