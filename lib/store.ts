import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TransactionType = "income" | "expense"

export interface Transaction {
  id: string
  userId: string // Add userId to associate transactions with users
  description: string
  amount: number
  type: TransactionType
  category: string
  date: string
  notes?: string
}

export interface Category {
  id: string
  userId: string // Add userId to associate categories with users
  name: string
  type: TransactionType
}

interface FinanceState {
  transactions: Transaction[]
  categories: Category[]
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  deleteTransaction: (id: string) => void
  editTransaction: (id: string, transaction: Partial<Omit<Transaction, "id">>) => void
  addCategory: (category: Omit<Category, "id">) => void
  deleteCategory: (id: string) => void
  editCategory: (id: string, category: Partial<Omit<Category, "id">>) => void
  getUserTransactions: (userId: string) => Transaction[]
  getUserCategories: (userId: string) => Category[]
  initializeUserCategories: (userId: string) => void
}

// Default categories for new users
const getDefaultCategories = (userId: string): Category[] => [
  { id: crypto.randomUUID(), userId, name: "Food", type: "expense" },
  { id: crypto.randomUUID(), userId, name: "Transportation", type: "expense" },
  { id: crypto.randomUUID(), userId, name: "Housing", type: "expense" },
  { id: crypto.randomUUID(), userId, name: "Utilities", type: "expense" },
  { id: crypto.randomUUID(), userId, name: "Entertainment", type: "expense" },
  { id: crypto.randomUUID(), userId, name: "Income", type: "income" },
  { id: crypto.randomUUID(), userId, name: "Salary", type: "income" },
  { id: crypto.randomUUID(), userId, name: "Freelance", type: "income" },
]

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: crypto.randomUUID(),
            },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      editTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updatedTransaction } : t)),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: crypto.randomUUID() }],
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),

      editCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedCategory } : c)),
        })),

      getUserTransactions: (userId) => {
        const { transactions } = get()
        return transactions.filter((t) => t.userId === userId)
      },

      getUserCategories: (userId) => {
        const { categories } = get()
        return categories.filter((c) => c.userId === userId)
      },

      initializeUserCategories: (userId) => {
        const { categories } = get()
        const userCategories = categories.filter((c) => c.userId === userId)

        // Only add default categories if user has none
        if (userCategories.length === 0) {
          const defaultCategories = getDefaultCategories(userId)
          set((state) => ({
            categories: [...state.categories, ...defaultCategories],
          }))
        }
      },
    }),
    {
      name: "finance-tracker-storage",
    },
  ),
)

// Helper functions to calculate financial data for a specific user
export const calculateTotalBalance = (transactions: Transaction[]) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "income") {
      return total + transaction.amount
    } else {
      return total - transaction.amount
    }
  }, 0)
}

export const calculateTotalIncome = (transactions: Transaction[]) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "income") {
      return total + transaction.amount
    }
    return total
  }, 0)
}

export const calculateTotalExpenses = (transactions: Transaction[]) => {
  return transactions.reduce((total, transaction) => {
    if (transaction.type === "expense") {
      return total + transaction.amount
    }
    return total
  }, 0)
}

export const calculateSavings = (transactions: Transaction[]) => {
  const income = calculateTotalIncome(transactions)
  const expenses = calculateTotalExpenses(transactions)
  return income - expenses
}

export const getTransactionsByCategory = (transactions: Transaction[]) => {
  const result: Record<string, number> = {}

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      if (result[transaction.category]) {
        result[transaction.category] += transaction.amount
      } else {
        result[transaction.category] = transaction.amount
      }
    }
  })

  return Object.entries(result).map(([name, value]) => ({ name, value }))
}

export const getMonthlyData = (transactions: Transaction[], months = 6) => {
  const today = new Date()
  const data: { name: string; income: number; expenses: number }[] = []

  // Create an array of the last 'months' months
  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = date.toLocaleString("default", { month: "short" })
    data.unshift({ name: monthName, income: 0, expenses: 0 })
  }

  // Fill in the data
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date)
    const monthDiff =
      (today.getFullYear() - transactionDate.getFullYear()) * 12 + (today.getMonth() - transactionDate.getMonth())

    if (monthDiff >= 0 && monthDiff < months) {
      const index = months - 1 - monthDiff
      if (transaction.type === "income") {
        data[index].income += transaction.amount
      } else {
        data[index].expenses += transaction.amount
      }
    }
  })

  return data
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}
