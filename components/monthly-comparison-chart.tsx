"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getMonthlyData, useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

export function MonthlyComparisonChart() {
  const { getUserTransactions } = useFinanceStore()
  const { currentUser } = useAuthStore()
  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const data = getMonthlyData(userTransactions)

  if (data.every((month) => month.income === 0 && month.expenses === 0)) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No transaction data to display</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, ""]} />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#22c55e" />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
