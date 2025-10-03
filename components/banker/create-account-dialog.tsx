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
import { addAccount } from "@/lib/data-store"

interface CreateAccountDialogProps {
  children: React.ReactNode
  onSuccess: () => void
}

export function CreateAccountDialog({ children, onSuccess }: CreateAccountDialogProps) {
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [email, setEmail] = useState("")
  const [accountType, setAccountType] = useState<"savings" | "current">("savings")
  const [initialBalance, setInitialBalance] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    if (!customerName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter customer name",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const balance = Number.parseFloat(initialBalance)
    if (isNaN(balance) || balance < 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid initial balance",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Minimum balance check
    const minBalance = accountType === "savings" ? 500 : 1000
    if (balance < minBalance) {
      toast({
        title: "Validation Error",
        description: `Minimum balance for ${accountType} account is $${minBalance}`,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate account number
    const accountNumber = `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`

    addAccount({
      accountNumber,
      accountType,
      balance,
      customerName,
      email,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Account Created",
      description: `Account ${accountNumber} created successfully. KYC verification pending.`,
    })

    setOpen(false)
    setCustomerName("")
    setEmail("")
    setInitialBalance("")
    setIsLoading(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>Open a new bank account for a customer</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              placeholder="Enter full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={accountType} onValueChange={(value: any) => setAccountType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings Account (Min: $500)</SelectItem>
                <SelectItem value="current">Current Account (Min: $1,000)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance ($)</Label>
            <Input
              id="initialBalance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Minimum: ${accountType === "savings" ? "500" : "1,000"}</p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
