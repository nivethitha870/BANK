"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Account } from "@/lib/data-store"
import { updateAccount } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { Search, Ban, CheckCircle } from "lucide-react"

interface UserManagementProps {
  accounts: Account[]
  onUpdate: () => void
}

export function UserManagement({ accounts, onUpdate }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeactivate = (account: Account) => {
    updateAccount(account.id, { status: "inactive" })
    toast({
      title: "Account Deactivated",
      description: `Account ${account.accountNumber} has been deactivated`,
      variant: "destructive",
    })
    onUpdate()
  }

  const handleActivate = (account: Account) => {
    updateAccount(account.id, { status: "active" })
    toast({
      title: "Account Activated",
      description: `Account ${account.accountNumber} has been activated`,
    })
    onUpdate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage all user accounts and permissions</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by account, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredAccounts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        ) : (
          <div className="space-y-4">
            {filteredAccounts.map((account) => (
              <div key={account.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{account.customerName}</h4>
                    <p className="text-sm text-muted-foreground">{account.email}</p>
                  </div>
                  <Badge
                    variant={
                      account.status === "active" ? "default" : account.status === "pending" ? "secondary" : "outline"
                    }
                    className="capitalize"
                  >
                    {account.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-mono font-semibold">{account.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-semibold capitalize">{account.accountType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-semibold text-accent">${account.balance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-semibold">{new Date(account.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {account.status === "active" ? (
                    <Button size="sm" variant="destructive" onClick={() => handleDeactivate(account)}>
                      <Ban className="mr-2 h-4 w-4" />
                      Deactivate Account
                    </Button>
                  ) : account.status === "inactive" ? (
                    <Button size="sm" onClick={() => handleActivate(account)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activate Account
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
