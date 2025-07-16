"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { getTransactionsByCategory, useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

// Color palette for categories
const COLORS = ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#a855f7", "#64748b", "#f97316", "#06b6d4"]

export function ExpensesByCategoryChart() {
  const { getUserTransactions } = useFinanceStore()
  const { currentUser } = useAuthStore()

  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const data = getTransactionsByCategory(userTransactions)

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No expense data to display</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
