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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addCard } from "@/lib/data-store"
import { CreditCard } from "lucide-react"

interface ApplyCardDialogProps {
  children: React.ReactNode
  accountNumber: string
  customerName: string
  onSuccess: () => void
}

export function ApplyCardDialog({ children, accountNumber, customerName, onSuccess }: ApplyCardDialogProps) {
  const [open, setOpen] = useState(false)
  const [cardType, setCardType] = useState<"debit" | "credit" | "virtual">("debit")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate card details
    const cardNumber = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 3)
    const cvv = Math.floor(100 + Math.random() * 900).toString()

    addCard({
      cardNumber,
      cardType,
      accountNumber,
      customerName,
      expiryDate: `${(expiryDate.getMonth() + 1).toString().padStart(2, "0")}/${expiryDate.getFullYear().toString().slice(-2)}`,
      cvv,
      limit: cardType === "credit" ? 50000 : undefined,
      status: "pending",
    })

    toast({
      title: "Application Submitted",
      description: `Your ${cardType} card application is pending approval`,
    })

    setOpen(false)
    setIsLoading(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Apply for Card
          </DialogTitle>
          <DialogDescription>Choose the type of card you want to apply for</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardType">Card Type</Label>
            <Select value={cardType} onValueChange={(value: any) => setCardType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit Card</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="virtual">Virtual Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Card Features:</h4>
            {cardType === "debit" && (
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Direct access to your account balance</li>
                <li>• No annual fees</li>
                <li>• Worldwide acceptance</li>
                <li>• Contactless payments</li>
              </ul>
            )}
            {cardType === "credit" && (
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Credit limit up to $50,000</li>
                <li>• Reward points on every purchase</li>
                <li>• Interest-free period of 45 days</li>
                <li>• Travel insurance included</li>
              </ul>
            )}
            {cardType === "virtual" && (
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Instant card generation</li>
                <li>• Perfect for online shopping</li>
                <li>• Enhanced security</li>
                <li>• Set custom spending limits</li>
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : "Apply Now"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
