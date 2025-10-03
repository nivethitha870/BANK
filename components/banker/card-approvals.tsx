"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "@/lib/data-store"
import { updateCard } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { Check, X, CreditCard } from "lucide-react"

interface CardApprovalsProps {
  cards: CardType[]
  onUpdate: () => void
}

export function CardApprovals({ cards, onUpdate }: CardApprovalsProps) {
  const { toast } = useToast()

  const pendingCards = cards.filter((c) => c.status === "pending")
  const approvedCards = cards.filter((c) => c.status === "active")
  const blockedCards = cards.filter((c) => c.status === "blocked")

  const handleApprove = (card: CardType) => {
    updateCard(card.id, { status: "active" })
    toast({
      title: "Card Approved",
      description: `${card.cardType} card for ${card.customerName} has been approved`,
    })
    onUpdate()
  }

  const handleReject = (card: CardType) => {
    updateCard(card.id, { status: "blocked" })
    toast({
      title: "Card Rejected",
      description: `${card.cardType} card application has been rejected`,
      variant: "destructive",
    })
    onUpdate()
  }

  const renderCardItem = (card: CardType, showActions = false) => (
    <div key={card.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold capitalize">{card.cardType} Card</h4>
            <p className="text-sm text-muted-foreground">{card.customerName}</p>
          </div>
        </div>
        <Badge
          variant={card.status === "active" ? "default" : card.status === "pending" ? "secondary" : "destructive"}
          className="capitalize"
        >
          {card.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Card Number</p>
          <p className="font-mono font-semibold">{card.cardNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Account Number</p>
          <p className="font-mono font-semibold">{card.accountNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expiry Date</p>
          <p className="font-semibold">{card.expiryDate}</p>
        </div>
      </div>

      {card.limit && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Credit Limit</span>
            <span className="font-semibold text-accent">${card.limit.toLocaleString()}</span>
          </div>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => handleApprove(card)} className="flex-1">
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(card)} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Card Applications</CardTitle>
          <CardDescription>Review and approve card applications</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingCards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending card applications</p>
          ) : (
            <div className="space-y-4">{pendingCards.map((card) => renderCardItem(card, true))}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Cards</CardTitle>
          <CardDescription>Successfully approved and active cards</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedCards.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active cards</p>
          ) : (
            <div className="space-y-4">{approvedCards.map((card) => renderCardItem(card))}</div>
          )}
        </CardContent>
      </Card>

      {blockedCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Blocked Cards</CardTitle>
            <CardDescription>Cards that are blocked or rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">{blockedCards.map((card) => renderCardItem(card))}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
