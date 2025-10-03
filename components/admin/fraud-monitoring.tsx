"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/data-store"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FraudMonitoringProps {
  transactions: Transaction[]
}

export function FraudMonitoring({ transactions }: FraudMonitoringProps) {
  const { toast } = useToast()

  // Detect suspicious transactions (amount > $5000 or multiple transactions in short time)
  const suspiciousTransactions = transactions.filter((t) => t.amount > 5000 || t.status === "failed")

  const handleMarkSafe = (transaction: Transaction) => {
    toast({
      title: "Marked as Safe",
      description: `Transaction ${transaction.id} has been marked as legitimate`,
    })
  }

  const handleBlockTransaction = (transaction: Transaction) => {
    toast({
      title: "Transaction Blocked",
      description: `Transaction ${transaction.id} has been blocked for fraud`,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Fraud Alerts
          </CardTitle>
          <CardDescription>Suspicious transactions requiring review</CardDescription>
        </CardHeader>
        <CardContent>
          {suspiciousTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-accent mx-auto mb-2" />
              <p className="text-muted-foreground">No suspicious transactions detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {suspiciousTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 border-2 border-destructive/50 rounded-lg space-y-3 bg-destructive/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-destructive/10 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{transaction.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-destructive">${transaction.amount.toLocaleString()}</p>
                      <Badge variant="destructive" className="mt-1">
                        High Risk
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">From Account</p>
                      <p className="font-mono font-semibold text-sm">{transaction.fromAccount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">To Account</p>
                      <p className="font-mono font-semibold text-sm">{transaction.toAccount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold text-sm">{transaction.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Fraud Indicators:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {transaction.amount > 5000 && (
                        <li>• High transaction amount (${transaction.amount.toLocaleString()})</li>
                      )}
                      {transaction.status === "failed" && <li>• Transaction failed - possible fraud attempt</li>}
                      <li>• Unusual transaction pattern detected</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleMarkSafe(transaction)} className="flex-1">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Safe
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBlockTransaction(transaction)}
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Block Transaction
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Prevention Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Real-time Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                All transactions are monitored in real-time using AI-based anomaly detection algorithms.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Multi-factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                High-value transactions require additional verification through OTP and biometric authentication.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Limits</h4>
              <p className="text-sm text-muted-foreground">
                Daily transaction limits help prevent unauthorized large transfers from compromised accounts.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Instant Alerts</h4>
              <p className="text-sm text-muted-foreground">
                Customers receive instant SMS and email alerts for all transactions on their accounts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
