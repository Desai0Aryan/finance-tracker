"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesByCategoryChart } from "@/components/expenses-by-category-chart"
import { MonthlyComparisonChart } from "@/components/monthly-comparison-chart"
import { SavingsGoalChart } from "@/components/savings-goal-chart"
import { useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

export default function ReportsPage() {
  const { getUserTransactions } = useFinanceStore()
  const { currentUser } = useAuthStore()

  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const hasTransactions = userTransactions.length > 0

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div>
          <h1 className="text-2xl font-bold">Financial Reports</h1>
          <p className="text-muted-foreground">Visualize and analyze your financial data.</p>
        </div>

        {!hasTransactions ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground">
                No transaction data available. Add transactions to see your financial reports.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income vs Expenses</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Expenses by Category</CardTitle>
                    <CardDescription>Your spending distribution across categories.</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ExpensesByCategoryChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="income" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Income vs Expenses</CardTitle>
                  <CardDescription>Compare your income and expenses over the past 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <MonthlyComparisonChart />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="savings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Goal Progress</CardTitle>
                  <CardDescription>Track your progress towards your savings goals.</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <SavingsGoalChart />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
