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
import { addInvestment } from "@/lib/data-store"

interface InvestmentDialogProps {
  children: React.ReactNode
  accountNumber: string
  customerName: string
  currentBalance: number
  onSuccess: () => void
}

export function InvestmentDialog({
  children,
  accountNumber,
  customerName,
  currentBalance,
  onSuccess,
}: InvestmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [investmentType, setInvestmentType] = useState<"FD" | "RD" | "Mutual Fund">("FD")
  const [amount, setAmount] = useState("")
  const [tenure, setTenure] = useState("12")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const interestRates = {
    FD: 6.5,
    RD: 6.0,
    "Mutual Fund": 12.0,
  }

  const minAmounts = {
    FD: 1000,
    RD: 500,
    "Mutual Fund": 500,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const investAmount = Number.parseFloat(amount)
    if (isNaN(investAmount) || investAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (investAmount < minAmounts[investmentType]) {
      toast({
        title: "Validation Error",
        description: `Minimum investment for ${investmentType} is $${minAmounts[investmentType]}`,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (investAmount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough balance",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const maturityDate = new Date()
    maturityDate.setMonth(maturityDate.getMonth() + Number.parseInt(tenure))

    addInvestment({
      investmentType,
      amount: investAmount,
      interestRate: interestRates[investmentType],
      tenure: Number.parseInt(tenure),
      accountNumber,
      customerName,
      maturityDate: maturityDate.toISOString(),
      status: "active",
    })

    toast({
      title: "Investment Created",
      description: `Your ${investmentType} investment has been created successfully`,
    })

    setOpen(false)
    setAmount("")
    setIsLoading(false)
    onSuccess()
  }

  const investAmount = Number.parseFloat(amount) || 0
  const maturityAmount =
    investAmount > 0
      ? Math.round(investAmount * (1 + (interestRates[investmentType] / 100) * (Number.parseInt(tenure) / 12)))
      : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start Investment</DialogTitle>
          <DialogDescription>Grow your wealth with our investment options</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="investmentType">Investment Type</Label>
            <Select value={investmentType} onValueChange={(value: any) => setInvestmentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FD">Fixed Deposit (6.5% p.a.)</SelectItem>
                <SelectItem value="RD">Recurring Deposit (6.0% p.a.)</SelectItem>
                <SelectItem value="Mutual Fund">Mutual Fund (12.0% p.a.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Investment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="100"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: ${minAmounts[investmentType]} | Available: ${currentBalance?.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (Months)</Label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months (1 year)</SelectItem>
                <SelectItem value="24">24 months (2 years)</SelectItem>
                <SelectItem value="36">36 months (3 years)</SelectItem>
                <SelectItem value="60">60 months (5 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {maturityAmount > 0 && (
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Maturity Amount</p>
              <p className="text-2xl font-bold text-accent">${maturityAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Returns: ${(maturityAmount - investAmount).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : "Invest Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
