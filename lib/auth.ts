import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  createdAt: string
}

interface AuthState {
  currentUser: User | null
  users: User[]
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
  updateProfile: (name: string, email: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      signIn: async (email: string, password: string) => {
        const { users } = get()
        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

        if (user) {
          set({ currentUser: user })
          return true
        }
        return false
      },

      signUp: async (name: string, email: string, password: string) => {
        const { users } = get()

        // Check if user already exists
        const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (existingUser) {
          return false
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
        }

        set({
          users: [...users, newUser],
          currentUser: newUser,
        })

        return true
      },

      signOut: () => {
        set({ currentUser: null })
      },

      updateProfile: (name: string, email: string) => {
        const { currentUser, users } = get()
        if (!currentUser) return

        const updatedUser = { ...currentUser, name, email }
        const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u))

        set({
          currentUser: updatedUser,
          users: updatedUsers,
        })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
