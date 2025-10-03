"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Loan } from "@/lib/data-store"
import { updateLoan } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { Check, X } from "lucide-react"

interface LoanApprovalsProps {
  loans: Loan[]
  onUpdate: () => void
}

export function LoanApprovals({ loans, onUpdate }: LoanApprovalsProps) {
  const { toast } = useToast()

  const pendingLoans = loans.filter((l) => l.status === "pending")
  const approvedLoans = loans.filter((l) => l.status === "approved" || l.status === "active")
  const rejectedLoans = loans.filter((l) => l.status === "rejected")

  const handleApprove = (loan: Loan) => {
    updateLoan(loan.id, { status: "approved" })
    toast({
      title: "Loan Approved",
      description: `${loan.loanType} loan for ${loan.customerName} has been approved`,
    })
    onUpdate()
  }

  const handleReject = (loan: Loan) => {
    updateLoan(loan.id, { status: "rejected" })
    toast({
      title: "Loan Rejected",
      description: `${loan.loanType} loan for ${loan.customerName} has been rejected`,
      variant: "destructive",
    })
    onUpdate()
  }

  const renderLoanCard = (loan: Loan, showActions = false) => (
    <div key={loan.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold capitalize">{loan.loanType} Loan</h4>
          <p className="text-sm text-muted-foreground">{loan.customerName}</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Account Number</span>
          <span className="font-mono font-semibold">{loan.accountNumber}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-muted-foreground">Applied Date</span>
          <span className="font-semibold">{new Date(loan.appliedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={() => handleApprove(loan)} className="flex-1">
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(loan)} className="flex-1">
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
          <CardTitle>Pending Loan Applications</CardTitle>
          <CardDescription>Review and approve loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLoans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending loan applications</p>
          ) : (
            <div className="space-y-4">{pendingLoans.map((loan) => renderLoanCard(loan, true))}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Loans</CardTitle>
          <CardDescription>Successfully approved loan applications</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedLoans.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No approved loans</p>
          ) : (
            <div className="space-y-4">{approvedLoans.map((loan) => renderLoanCard(loan))}</div>
          )}
        </CardContent>
      </Card>

      {rejectedLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rejected Loans</CardTitle>
            <CardDescription>Loan applications that were rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">{rejectedLoans.map((loan) => renderLoanCard(loan))}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
