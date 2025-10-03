"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Account } from "@/lib/data-store"
import { updateAccount } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"
import { Search, Lock, Unlock } from "lucide-react"

interface AccountManagementProps {
  accounts: Account[]
  onUpdate: () => void
}

export function AccountManagement({ accounts, onUpdate }: AccountManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleStatus = (account: Account) => {
    const newStatus = account.status === "active" ? "inactive" : "active"
    updateAccount(account.id, { status: newStatus })
    toast({
      title: "Account Updated",
      description: `Account ${account.accountNumber} is now ${newStatus}`,
    })
    onUpdate()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <CardDescription>View and manage all customer accounts</CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by account number, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredAccounts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No accounts found</p>
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

                {account.status !== "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant={account.status === "active" ? "destructive" : "default"}
                      onClick={() => handleToggleStatus(account)}
                    >
                      {account.status === "active" ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
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
