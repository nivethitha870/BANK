"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Lock, Unlock } from "lucide-react"
import type { Card as CardType } from "@/lib/data-store"
import { updateCard } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"

interface MyCardsProps {
  cards: CardType[]
  onUpdate: () => void
}

export function MyCards({ cards, onUpdate }: MyCardsProps) {
  const { toast } = useToast()

  const handleBlockCard = (card: CardType) => {
    updateCard(card.id, { status: card.status === "blocked" ? "active" : "blocked" })
    toast({
      title: card.status === "blocked" ? "Card Unblocked" : "Card Blocked",
      description: `Your ${card.cardType} card has been ${card.status === "blocked" ? "unblocked" : "blocked"}`,
    })
    onUpdate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Cards</CardTitle>
        <CardDescription>Manage your debit, credit, and virtual cards</CardDescription>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No cards found. Apply for a card to get started.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative p-6 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-8 w-8" />
                    <Badge
                      variant={
                        card.status === "active" ? "secondary" : card.status === "pending" ? "outline" : "destructive"
                      }
                      className="capitalize"
                    >
                      {card.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm opacity-80">Card Number</p>
                    <p className="text-lg font-mono font-semibold tracking-wider">{card.cardNumber}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-80">Card Holder</p>
                      <p className="font-semibold">{card.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Expires</p>
                      <p className="font-semibold">{card.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">CVV</p>
                      <p className="font-semibold">{card.cvv}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="capitalize bg-white/20 text-primary-foreground border-white/30">
                      {card.cardType}
                    </Badge>
                    {card.limit && <p className="text-sm">Limit: ${card.limit.toLocaleString()}</p>}
                  </div>

                  {card.status === "active" && (
                    <Button size="sm" variant="secondary" onClick={() => handleBlockCard(card)} className="w-full">
                      <Lock className="mr-2 h-4 w-4" />
                      Block Card
                    </Button>
                  )}
                  {card.status === "blocked" && (
                    <Button size="sm" variant="secondary" onClick={() => handleBlockCard(card)} className="w-full">
                      <Unlock className="mr-2 h-4 w-4" />
                      Unblock Card
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
