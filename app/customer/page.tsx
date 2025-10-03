"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser, logout } from "@/lib/auth"
import { getAccounts, getTransactions, getCards, getLoans, getInvestments } from "@/lib/data-store"
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
  Send,
  FileText,
} from "lucide-react"
import { TransferMoneyDialog } from "@/components/customer/transfer-money-dialog"
import { TransactionHistory } from "@/components/customer/transaction-history"
import { ApplyCardDialog } from "@/components/customer/apply-card-dialog"
import { ApplyLoanDialog } from "@/components/customer/apply-loan-dialog"
import { InvestmentDialog } from "@/components/customer/investment-dialog"
import { MyCards } from "@/components/customer/my-cards"
import { MyLoans } from "@/components/customer/my-loans"
import { MyInvestments } from "@/components/customer/my-investments"

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [investments, setInvestments] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const router = useRouter()

  // ✅ Check login user
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)

      // 🔥 Try to pull account info from localStorage
      const storedAcc = localStorage.getItem("accountNumber")
      const storedName = localStorage.getItem("customerName")

      if (storedAcc && storedName) {
        setAccount({ accountNumber: storedAcc, balance: 50000, accountType: "savings", status: "active" })
        setUser((prev: any) => ({ ...prev, name: storedName }))
      }
    }
  }, [router])

  // ✅ Load user-related data
  useEffect(() => {
    if (user) {
      const accounts = getAccounts()
      const userAccount = accounts.find((a) => a.email === user.email) || accounts[0]
      if (!account) setAccount(userAccount)

      const allTransactions = getTransactions()
      const userTransactions = allTransactions.filter(
        (t) => t.fromAccount === userAccount?.accountNumber || t.toAccount === userAccount?.accountNumber,
      )
      setTransactions(userTransactions)

      const allCards = getCards()
      setCards(allCards.filter((c) => c.accountNumber === userAccount?.accountNumber))

      const allLoans = getLoans()
      setLoans(allLoans.filter((l) => l.accountNumber === userAccount?.accountNumber))

      const allInvestments = getInvestments()
      setInvestments(allInvestments.filter((i) => i.accountNumber === userAccount?.accountNumber))
    }
  }, [user, refreshKey])

  const refresh = () => setRefreshKey((prev) => prev + 1)

  if (!user) return <p className="p-6">Loading...</p>

  const recentTransactions = transactions.slice(0, 5)
  const totalSpent = transactions
    .filter((t) => t.fromAccount === account?.accountNumber && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalReceived = transactions
    .filter((t) => t.toAccount === account?.accountNumber && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  // 🔑 Handlers
  const handleLogout = () => {
    logout()
    localStorage.removeItem("accountNumber")
    localStorage.removeItem("customerName")
    router.push("/login")
  }

  const goToProfile = () => {
    router.push("/customer/profile")
  }

  return (
    <DashboardLayout title="Customer Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name} 👋</h2>
            <p className="text-muted-foreground">Here’s your financial overview</p>
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
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${account?.balance?.toLocaleString() || "0"}
              </div>
              <p className="text-xs text-muted-foreground">Account: {account?.accountNumber}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">${totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Received</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${totalReceived.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cards.filter((c) => c.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">{cards.length} total cards</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your account efficiently</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <TransferMoneyDialog
                    accountNumber={account?.accountNumber}
                    currentBalance={account?.balance}
                    onSuccess={refresh}
                  >
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Send className="mr-2 h-4 w-4" />
                      Transfer Money
                    </Button>
                  </TransferMoneyDialog>
                  <ApplyCardDialog
                    accountNumber={account?.accountNumber}
                    customerName={user?.name || ""}
                    onSuccess={refresh}
                  >
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Apply for Card
                    </Button>
                  </ApplyCardDialog>
                  <ApplyLoanDialog
                    accountNumber={account?.accountNumber}
                    customerName={user?.name || ""}
                    onSuccess={refresh}
                  >
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Apply for Loan
                    </Button>
                  </ApplyLoanDialog>
                  <InvestmentDialog
                    accountNumber={account?.accountNumber}
                    customerName={user?.name || ""}
                    currentBalance={account?.balance}
                    onSuccess={refresh}
                  >
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Start Investment
                    </Button>
                  </InvestmentDialog>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No transactions yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.fromAccount === account?.accountNumber
                                  ? "bg-destructive/10"
                                  : "bg-accent/10"
                              }`}
                            >
                              {transaction.fromAccount === account?.accountNumber ? (
                                <ArrowUpRight className="h-4 w-4 text-destructive" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-accent" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-sm font-bold ${
                                transaction.fromAccount === account?.accountNumber
                                  ? "text-destructive"
                                  : "text-accent"
                              }`}
                            >
                              {transaction.fromAccount === account?.accountNumber ? "-" : "+"}$
                              {transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="text-lg font-mono font-semibold">{account?.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="text-lg font-semibold capitalize">{account?.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Status</p>
                  <p className="text-lg font-semibold capitalize">{account?.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <TransactionHistory transactions={transactions} accountNumber={account?.accountNumber} />
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards">
            <MyCards cards={cards} onUpdate={refresh} />
          </TabsContent>

          {/* Loans */}
          <TabsContent value="loans">
            <MyLoans loans={loans} />
          </TabsContent>

          {/* Investments */}
          <TabsContent value="investments">
            <MyInvestments investments={investments} />
          </TabsContent>

          {/* Statements */}
          <TabsContent value="statements">
            <Card>
              <CardHeader>
                <CardTitle>Account Statements</CardTitle>
                <CardDescription>Download your account statements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Current Month Statement
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Last 3 Months Statement
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Annual Statement
                  </Button>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Statements are generated in PDF format and include all transactions, account balance, and detailed activity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
