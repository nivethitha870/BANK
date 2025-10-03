"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Account, Transaction, Loan, Card as CardType } from "@/lib/data-store"
import { FileText, Download, TrendingUp, Users, DollarSign, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SystemReportsProps {
  accounts: Account[]
  transactions: Transaction[]
  loans: Loan[]
  cards: CardType[]
}

export function SystemReports({ accounts, transactions, loans, cards }: SystemReportsProps) {
  const { toast } = useToast()

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report has been downloaded successfully`,
    })
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)
  const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0)
  const totalTransactionVolume = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Key metrics and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Total Accounts</h4>
              </div>
              <p className="text-3xl font-bold">{accounts.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {accounts.filter((a) => a.status === "active").length} active
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-accent" />
                <h4 className="font-semibold">Total Deposits</h4>
              </div>
              <p className="text-3xl font-bold text-accent">${(totalBalance / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground mt-1">Across all accounts</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Total Loans</h4>
              </div>
              <p className="text-3xl font-bold">${(totalLoans / 1000).toFixed(1)}K</p>
              <p className="text-sm text-muted-foreground mt-1">{loans.length} active loans</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Active Cards</h4>
              </div>
              <p className="text-3xl font-bold">{cards.filter((c) => c.status === "active").length}</p>
              <p className="text-sm text-muted-foreground mt-1">{cards.length} total cards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed system reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("User Activity")}
          >
            <FileText className="mr-2 h-4 w-4" />
            User Activity Report
            <Download className="ml-auto h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("Transaction")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Transaction Report
            <Download className="ml-auto h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("Loan Portfolio")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Loan Portfolio Report
            <Download className="ml-auto h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("Card Usage")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Card Usage Report
            <Download className="ml-auto h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("Fraud Detection")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Fraud Detection Report
            <Download className="ml-auto h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start bg-transparent"
            onClick={() => handleDownloadReport("System Performance")}
          >
            <FileText className="mr-2 h-4 w-4" />
            System Performance Report
            <Download className="ml-auto h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Recent system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">New account created</p>
                <p className="text-sm text-muted-foreground">Account ACC1234567890 created by Banker John</p>
              </div>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Loan approved</p>
                <p className="text-sm text-muted-foreground">Personal loan of $50,000 approved</p>
              </div>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Fraud alert resolved</p>
                <p className="text-sm text-muted-foreground">Transaction marked as safe by Admin</p>
              </div>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
