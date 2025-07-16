"use client"

import Link from "next/link"
import { ArrowUpRight, DollarSign, PiggyBank, Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { useState, useEffect } from "react"
import {
  calculateTotalBalance,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateSavings,
  formatCurrency,
  useFinanceStore,
} from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

export default function Home() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const { getUserTransactions, initializeUserCategories } = useFinanceStore()
  const { currentUser } = useAuthStore()

  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []

  // Initialize user categories when component mounts
  useEffect(() => {
    if (currentUser) {
      initializeUserCategories(currentUser.id)
    }
  }, [currentUser, initializeUserCategories])

  const totalBalance = calculateTotalBalance(userTransactions)
  const totalIncome = calculateTotalIncome(userTransactions)
  const totalExpenses = calculateTotalExpenses(userTransactions)
  const savings = calculateSavings(userTransactions)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {currentUser?.name}!</h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
              <p className="text-xs text-muted-foreground">Your current balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">Total income</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">Total expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(savings)}</div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Your financial activity for the past 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddTransactionOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/transactions">View All Transactions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} />
    </div>
  )
}
