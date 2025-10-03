"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { getAccounts, getLoans, getCards, getTransactions } from "@/lib/data-store"
import { Users, CreditCard, DollarSign, TrendingUp, FileCheck } from "lucide-react"

import { AccountManagement } from "@/components/banker/account-management"
import { LoanApprovals } from "@/components/banker/loan-approvals"
import { CardApprovals } from "@/components/banker/card-approvals"
import { KYCVerification } from "@/components/banker/kyc-verification"
import { CreateAccountDialog } from "@/components/banker/create-account-dialog"

export default function BankerDashboard() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const router = useRouter()

  useEffect(() => {
    setAccounts(getAccounts())
    setLoans(getLoans())
    setCards(getCards())
    setTransactions(getTransactions())
  }, [refreshKey])

  const refresh = () => setRefreshKey((prev) => prev + 1)

  const activeAccounts = accounts.filter((a) => a.status === "active").length
  const pendingLoans = loans.filter((l) => l.status === "pending").length
  const pendingCards = cards.filter((c) => c.status === "pending").length
  const pendingKYC = accounts.filter((a) => a.status === "pending").length
  const totalTransactions = transactions.length

  // Fake logout → just navigate to login page
  const handleLogout = () => {
    router.push("/login")
  }

  // Fake profile page navigation
  const goToProfile = () => {
    router.push("/banker/profile")
  }

  return (
    <DashboardLayout title="Banker Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Header with buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Banker Dashboard</h2>
            <p className="text-muted-foreground">
              Manage accounts, approvals, and customer services
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
  onClick={() => router.push("/edit-profile")} 
  variant="outline"
>
  Edit Profile
</Button>

            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
            <CreateAccountDialog onSuccess={refresh}>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Create New Account
              </button>
            </CreateAccountDialog>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAccounts}</div>
              <p className="text-xs text-muted-foreground">{accounts.length} total accounts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingLoans}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingCards}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingKYC}</div>
              <p className="text-xs text-muted-foreground">Verification needed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Total processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="loans">Loan Approvals</TabsTrigger>
            <TabsTrigger value="cards">Card Approvals</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <AccountManagement accounts={accounts} onUpdate={refresh} />
          </TabsContent>

          <TabsContent value="loans">
            <LoanApprovals loans={loans} onUpdate={refresh} />
          </TabsContent>

          <TabsContent value="cards">
            <CardApprovals cards={cards} onUpdate={refresh} />
          </TabsContent>

          <TabsContent value="kyc">
            <KYCVerification accounts={accounts} onUpdate={refresh} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
