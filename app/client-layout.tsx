"use client"

import type React from "react"
import { usePathname } from "next/navigation"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/auth"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {isAuthPage ? (
        children
      ) : (
        <AuthGuard>
          <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
              <AppHeader />
              {children}
            </div>
          </div>
        </AuthGuard>
      )}
      <Toaster />
    </ThemeProvider>
  )
}
