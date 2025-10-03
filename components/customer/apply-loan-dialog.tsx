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
import { addLoan } from "@/lib/data-store"

interface ApplyLoanDialogProps {
  children: React.ReactNode
  accountNumber: string
  customerName: string
  onSuccess: () => void
}

export function ApplyLoanDialog({ children, accountNumber, customerName, onSuccess }: ApplyLoanDialogProps) {
  const [open, setOpen] = useState(false)
  const [loanType, setLoanType] = useState<"personal" | "home" | "car" | "education">("personal")
  const [amount, setAmount] = useState("")
  const [tenure, setTenure] = useState("12")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const interestRates = {
    personal: 10.5,
    home: 8.5,
    car: 9.0,
    education: 7.5,
  }

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 12 / 100
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return Math.round(emi)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const loanAmount = Number.parseFloat(amount)
    if (isNaN(loanAmount) || loanAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid loan amount",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (loanAmount < 1000) {
      toast({
        title: "Validation Error",
        description: "Minimum loan amount is $1,000",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const interestRate = interestRates[loanType]
    const tenureMonths = Number.parseInt(tenure)
    const emi = calculateEMI(loanAmount, interestRate, tenureMonths)

    addLoan({
      loanType,
      amount: loanAmount,
      interestRate,
      tenure: tenureMonths,
      emi,
      accountNumber,
      customerName,
      status: "pending",
      appliedDate: new Date().toISOString(),
    })

    toast({
      title: "Loan Application Submitted",
      description: `Your ${loanType} loan application is under review`,
    })

    setOpen(false)
    setAmount("")
    setIsLoading(false)
    onSuccess()
  }

  const loanAmount = Number.parseFloat(amount) || 0
  const estimatedEMI = loanAmount > 0 ? calculateEMI(loanAmount, interestRates[loanType], Number.parseInt(tenure)) : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Loan</DialogTitle>
          <DialogDescription>Get instant loan approval with competitive interest rates</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Select value={loanType} onValueChange={(value: any) => setLoanType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan (10.5% p.a.)</SelectItem>
                <SelectItem value="home">Home Loan (8.5% p.a.)</SelectItem>
                <SelectItem value="car">Car Loan (9.0% p.a.)</SelectItem>
                <SelectItem value="education">Education Loan (7.5% p.a.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="1000"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenure">Tenure (Months)</Label>
            <Select value={tenure} onValueChange={setTenure}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 months (1 year)</SelectItem>
                <SelectItem value="24">24 months (2 years)</SelectItem>
                <SelectItem value="36">36 months (3 years)</SelectItem>
                <SelectItem value="60">60 months (5 years)</SelectItem>
                <SelectItem value="120">120 months (10 years)</SelectItem>
                <SelectItem value="240">240 months (20 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {estimatedEMI > 0 && (
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated Monthly EMI</p>
              <p className="text-2xl font-bold text-accent">${estimatedEMI.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Total payable: ${(estimatedEMI * Number.parseInt(tenure)).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : "Apply"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
