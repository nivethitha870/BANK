"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Loan } from "@/lib/data-store"

interface MyLoansProps {
  loans: Loan[]
}

export function MyLoans({ loans }: MyLoansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Loans</CardTitle>
        <CardDescription>Track your loan applications and repayments</CardDescription>
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No loans found. Apply for a loan to get started.</p>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold capitalize">{loan.loanType} Loan</h4>
                    <p className="text-sm text-muted-foreground">
                      Applied on {new Date(loan.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      loan.status === "approved" || loan.status === "active"
                        ? "default"
                        : loan.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                    className="capitalize"
                  >
                    {loan.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-lg font-bold">${loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly EMI</p>
                    <p className="text-lg font-bold text-accent">${loan.emi.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interest Rate</p>
                    <p className="text-lg font-bold">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tenure</p>
                    <p className="text-lg font-bold">{loan.tenure} months</p>
                  </div>
                </div>

                {loan.status === "active" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <p className="text-xs text-muted-foreground">3 of 12 EMIs paid</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
