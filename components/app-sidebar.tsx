import Link from "next/link"
import { BarChart3, CreditCard, Home, PiggyBank, Settings, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <PiggyBank className="h-6 w-6" />
          <span>Finance Tracker</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link href="/" passHref legacyBehavior>
            <Button variant="ghost" className="relative flex justify-start gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions" passHref legacyBehavior>
            <Button variant="ghost" className="relative flex justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </Button>
          </Link>
          <Link href="/categories" passHref legacyBehavior>
            <Button variant="ghost" className="relative flex justify-start gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </Button>
          </Link>
          <Link href="/reports" passHref legacyBehavior>
            <Button variant="ghost" className="relative flex justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/settings" passHref legacyBehavior>
            <Button variant="ghost" className="relative flex justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 text-sm font-medium">Pro Tip</h4>
          <p className="text-xs text-muted-foreground">
            Set up recurring transactions to automatically track your regular expenses.
          </p>
        </div>
      </div>
    </div>
  )
}
