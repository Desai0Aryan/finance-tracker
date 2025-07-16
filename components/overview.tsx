"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getMonthlyData, useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

export function Overview() {
  const { getUserTransactions } = useFinanceStore()
  const { currentUser } = useAuthStore()

  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const data = getMonthlyData(userTransactions)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, ""]} />
        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
