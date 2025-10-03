"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import type { Transaction } from "@/lib/data-store"

interface TransactionHistoryProps {
  transactions: Transaction[]
  accountNumber: string
}

export function TransactionHistory({ transactions, accountNumber }: TransactionHistoryProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>All your transactions in one place</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions found</p>
        ) : (
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => {
              const isDebit = transaction.fromAccount === accountNumber
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isDebit ? "bg-destructive/10" : "bg-accent/10"}`}>
                      {isDebit ? (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isDebit ? `To: ${transaction.toAccount}` : `From: ${transaction.fromAccount}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isDebit ? "text-destructive" : "text-accent"}`}>
                      {isDebit ? "-" : "+"}${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.timestamp).toLocaleString()}</p>
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
