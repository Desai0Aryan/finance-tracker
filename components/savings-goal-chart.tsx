"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { calculateSavings, formatCurrency, useFinanceStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth"

export function SavingsGoalChart() {
  const { getUserTransactions } = useFinanceStore()
  const { toast } = useToast()
  const { currentUser } = useAuthStore()

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [goalName, setGoalName] = useState("Savings Goal")
  const [goalAmount, setGoalAmount] = useState("10000")

  // Get savings from transactions
  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []
  const currentSavings = calculateSavings(userTransactions)

  // For demo purposes, we'll use localStorage to store the goal
  const [savedGoal, setSavedGoal] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savings-goal")
      return saved ? JSON.parse(saved) : { name: "Savings Goal", amount: 10000 }
    }
    return { name: "Savings Goal", amount: 10000 }
  })

  // Calculate progress percentage
  const progress = Math.min(100, Math.max(0, (currentSavings / savedGoal.amount) * 100))

  // Generate chart data - for demo purposes, we'll create a simple progression
  const generateChartData = () => {
    const data = []
    const months = 6
    const monthlyIncrement = currentSavings / months

    for (let i = 0; i < months; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (months - 1) + i)
      const monthName = date.toLocaleString("default", { month: "short" })

      data.push({
        name: monthName,
        amount: Math.round((i + 1) * monthlyIncrement),
      })
    }

    return data
  }

  const data = generateChartData()

  const handleSaveGoal = () => {
    if (!goalName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal name",
        variant: "destructive",
      })
      return
    }

    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid goal amount",
        variant: "destructive",
      })
      return
    }

    const newGoal = {
      name: goalName,
      amount: Number(goalAmount),
    }

    setSavedGoal(newGoal)
    localStorage.setItem("savings-goal", JSON.stringify(newGoal))

    toast({
      title: "Success",
      description: "Savings goal updated successfully",
    })

    setIsAddGoalOpen(false)
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{savedGoal.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(currentSavings)} of {formatCurrency(savedGoal.amount)}
                </div>
              </div>
              <div className="text-sm font-medium">{Math.round(progress)}%</div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, "Saved"]} />
          <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#93c5fd" />
        </AreaChart>
      </ResponsiveContainer>
      <Button className="w-full" onClick={() => setIsAddGoalOpen(true)}>
        Update Savings Goal
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>

      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Savings Goal</DialogTitle>
            <DialogDescription>Define your savings target to track your progress.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-name">Goal Name</Label>
              <Input
                id="goal-name"
                placeholder="e.g., Vacation Fund, Emergency Fund"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goal-amount">Target Amount</Label>
              <Input
                id="goal-amount"
                placeholder="10000"
                type="number"
                min="1"
                step="100"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGoalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal}>Save Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
