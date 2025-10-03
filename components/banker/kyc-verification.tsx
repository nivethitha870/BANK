"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Account } from "@/lib/data-store"
import { updateAccount } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { Check, X, FileCheck } from "lucide-react"

interface KYCVerificationProps {
  accounts: Account[]
  onUpdate: () => void
}

export function KYCVerification({ accounts, onUpdate }: KYCVerificationProps) {
  const { toast } = useToast()

  const pendingKYC = accounts.filter((a) => a.status === "pending")
  const verifiedAccounts = accounts.filter((a) => a.status === "active")

  const handleApprove = (account: Account) => {
    updateAccount(account.id, { status: "active" })
    toast({
      title: "KYC Approved",
      description: `Account ${account.accountNumber} has been verified and activated`,
    })
    onUpdate()
  }

  const handleReject = (account: Account) => {
    updateAccount(account.id, { status: "inactive" })
    toast({
      title: "KYC Rejected",
      description: `Account ${account.accountNumber} verification failed`,
      variant: "destructive",
    })
    onUpdate()
  }

  const renderAccountCard = (account: Account, showActions = false) => (
    <div key={account.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FileCheck className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold">{account.customerName}</h4>
            <p className="text-sm text-muted-foreground">{account.email}</p>
          </div>
        </div>
        <Badge
          variant={account.status === "active" ? "default" : account.status === "pending" ? "secondary" : "outline"}
          className="capitalize"
        >
          {account.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Account Number</p>
          <p className="font-mono font-semibold">{account.accountNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Account Type</p>
          <p className="font-semibold capitalize">{account.accountType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Initial Balance</p>
          <p className="font-semibold text-accent">${account.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="pt-2 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Created Date</span>
          <span className="font-semibold">{new Date(account.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {showActions && (
        <div className="space-y-2 pt-2">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-2">KYC Documents:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Identity Proof (Verified)</li>
              <li>✓ Address Proof (Verified)</li>
              <li>✓ Income Proof (Verified)</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleApprove(account)} className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Approve KYC
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleReject(account)} className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Reject KYC
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Verification</CardTitle>
          <CardDescription>Review and verify customer KYC documents</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingKYC.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending KYC verifications</p>
          ) : (
            <div className="space-y-4">{pendingKYC.map((account) => renderAccountCard(account, true))}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verified Accounts</CardTitle>
          <CardDescription>Accounts with completed KYC verification</CardDescription>
        </CardHeader>
        <CardContent>
          {verifiedAccounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No verified accounts</p>
          ) : (
            <div className="space-y-4">{verifiedAccounts.map((account) => renderAccountCard(account))}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
