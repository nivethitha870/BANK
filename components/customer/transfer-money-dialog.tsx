"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addTransaction, getAccounts, updateAccount } from "@/lib/data-store"

interface TransferMoneyDialogProps {
  children: React.ReactNode
  accountNumber: string
  currentBalance: number
  onSuccess: () => void
}

export function TransferMoneyDialog({ children, accountNumber, currentBalance, onSuccess }: TransferMoneyDialogProps) {
  const [open, setOpen] = useState(false)
  const [toAccount, setToAccount] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"IMPS" | "NEFT" | "RTGS" | "UPI">("IMPS")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Transfer")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!toAccount.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter recipient account number",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const transferAmount = Number.parseFloat(amount)
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (transferAmount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough balance for this transfer",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check daily limit (example: $10,000)
    if (transferAmount > 10000) {
      toast({
        title: "Limit Exceeded",
        description: "Daily transfer limit is $10,000",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Check if recipient account exists
    const accounts = getAccounts()
    const recipientAccount = accounts.find((a) => a.accountNumber === toAccount)
    if (!recipientAccount) {
      toast({
        title: "Invalid Account",
        description: "Recipient account does not exist",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update balances
    const senderAccount = accounts.find((a) => a.accountNumber === accountNumber)
    if (senderAccount) {
      updateAccount(senderAccount.id, { balance: senderAccount.balance - transferAmount })
    }
    updateAccount(recipientAccount.id, { balance: recipientAccount.balance + transferAmount })

    // Add transaction
    addTransaction({
      fromAccount: accountNumber,
      toAccount,
      amount: transferAmount,
      type,
      category,
      status: "completed",
      timestamp: new Date().toISOString(),
      description: description || `Transfer to ${toAccount}`,
    })

    toast({
      title: "Transfer Successful",
      description: `$${transferAmount.toLocaleString()} transferred successfully`,
    })

    setOpen(false)
    setToAccount("")
    setAmount("")
    setDescription("")
    setIsLoading(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>Send money to another account securely</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="toAccount">Recipient Account Number</Label>
            <Input
              id="toAccount"
              placeholder="Enter account number"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Available balance: ${currentBalance?.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Transfer Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IMPS">IMPS (Instant)</SelectItem>
                <SelectItem value="NEFT">NEFT (2-3 hours)</SelectItem>
                <SelectItem value="RTGS">RTGS (30 mins)</SelectItem>
                <SelectItem value="UPI">UPI (Instant)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add a note"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : "Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
