"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { Investment } from "@/lib/data-store"

interface MyInvestmentsProps {
  investments: Investment[]
}

export function MyInvestments({ investments }: MyInvestmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Investments</CardTitle>
        <CardDescription>Track your investment portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        {investments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No investments found. Start investing to grow your wealth.
          </p>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => {
              const maturityAmount = Math.round(
                investment.amount * (1 + (investment.interestRate / 100) * (investment.tenure / 12)),
              )
              const returns = maturityAmount - investment.amount

              return (
                <div key={investment.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{investment.investmentType}</h4>
                        <p className="text-sm text-muted-foreground">{investment.interestRate}% p.a.</p>
                      </div>
                    </div>
                    <Badge variant={investment.status === "active" ? "default" : "secondary"} className="capitalize">
                      {investment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Invested</p>
                      <p className="text-lg font-bold">${investment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Returns</p>
                      <p className="text-lg font-bold text-accent">+${returns.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Maturity</p>
                      <p className="text-lg font-bold">${maturityAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Maturity Date</span>
                      <span className="font-semibold">{new Date(investment.maturityDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Tenure</span>
                      <span className="font-semibold">{investment.tenure} months</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
