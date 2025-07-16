"use client"

import { useState } from "react"
import { Edit, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFinanceStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuthStore } from "@/lib/auth"

export default function CategoriesPage() {
  const { getUserCategories, getUserTransactions, addCategory, deleteCategory, editCategory } = useFinanceStore()
  const { currentUser } = useAuthStore()
  const { toast } = useToast()

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">("expense")

  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editType, setEditType] = useState<"income" | "expense">("expense")

  const userCategories = currentUser ? getUserCategories(currentUser.id) : []
  const userTransactions = currentUser ? getUserTransactions(currentUser.id) : []

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    // Check if category already exists
    const exists = userCategories.some(
      (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase() && cat.type === newCategoryType,
    )

    if (exists) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      })
      return
    }

    addCategory({
      name: newCategoryName,
      type: newCategoryType,
      userId: currentUser.id,
    })

    toast({
      title: "Success",
      description: "Category added successfully",
    })

    setNewCategoryName("")
    setNewCategoryType("expense")
    setIsAddCategoryOpen(false)
  }

  const handleEditClick = (id: string) => {
    const category = userCategories.find((c) => c.id === id)
    if (category) {
      setEditId(id)
      setEditName(category.name)
      setEditType(category.type)
      setIsEditCategoryOpen(true)
    }
  }

  const handleEditCategory = () => {
    if (!editId) return

    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      })
      return
    }

    // Check if category already exists (excluding the current one)
    const exists = userCategories.some(
      (cat) => cat.id !== editId && cat.name.toLowerCase() === editName.toLowerCase() && cat.type === editType,
    )

    if (exists) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      })
      return
    }

    editCategory(editId, {
      name: editName,
      type: editType,
    })

    toast({
      title: "Success",
      description: "Category updated successfully",
    })

    setIsEditCategoryOpen(false)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = () => {
    if (!deleteId) return

    // Check if category is in use
    const inUse = userTransactions.some((t) => {
      const category = userCategories.find((c) => c.id === deleteId)
      return category && t.category === category.name
    })

    if (inUse) {
      toast({
        title: "Error",
        description: "Cannot delete a category that is in use by transactions",
        variant: "destructive",
      })
      setDeleteId(null)
      return
    }

    deleteCategory(deleteId)

    toast({
      title: "Success",
      description: "Category deleted successfully",
    })

    setDeleteId(null)
  }

  // Count transactions per category
  const getCategoryTransactionCount = (categoryName: string) => {
    return userTransactions.filter((t) => t.category === categoryName).length
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>Manage your transaction categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No categories found. Add a category to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    userCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="capitalize">{category.type}</TableCell>
                        <TableCell>{getCategoryTransactionCount(category.name)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(category.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new category for organizing your transactions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Groceries, Rent, Salary"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Category Type</Label>
              <Select
                value={newCategoryType}
                onValueChange={(value: "income" | "expense") => setNewCategoryType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update this category's details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Groceries, Rent, Salary"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Category Type</Label>
              <Select value={editType} onValueChange={(value: "income" | "expense") => setEditType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
