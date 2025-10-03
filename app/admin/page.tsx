"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAccounts, getTransactions, getLoans, getCards } from "@/lib/data-store"
import {
  Users, DollarSign, AlertTriangle, TrendingUp, Activity, CreditCard
} from "lucide-react"
import { UserManagement } from "@/components/admin/user-management"
import { FraudMonitoring } from "@/components/admin/fraud-monitoring"
import { SystemReports } from "@/components/admin/system-reports"
import { TransactionMonitoring } from "@/components/admin/transaction-monitoring"
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function AdminDashboard() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@bank.com" })

  useEffect(() => {
    setAccounts(getAccounts())
    setTransactions(getTransactions())
    setLoans(getLoans())
    setCards(getCards())
  }, [refreshKey])

  const refresh = () => setRefreshKey((prev) => prev + 1)

  const totalUsers = accounts.length
  const activeUsers = accounts.filter((a) => a.status === "active").length
  const totalTransactions = transactions.length
  const totalTransactionVolume = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const suspiciousTransactions = transactions.filter((t) => t.amount > 5000).length
  const pendingApprovals =
    loans.filter((l) => l.status === "pending").length + cards.filter((c) => c.status === "pending").length

  const transactionData = [
    { name: "Mon", transactions: 45, volume: 12000 },
    { name: "Tue", transactions: 52, volume: 15000 },
    { name: "Wed", transactions: 48, volume: 13500 },
    { name: "Thu", transactions: 61, volume: 18000 },
    { name: "Fri", transactions: 55, volume: 16500 },
    { name: "Sat", transactions: 38, volume: 9000 },
    { name: "Sun", transactions: 32, volume: 7500 },
  ]

  const accountTypeData = [
    { name: "Savings", value: accounts.filter((a) => a.accountType === "savings").length },
    { name: "Current", value: accounts.filter((a) => a.accountType === "current").length },
  ]

  const COLORS = ["#10b981", "#3b82f6"]

  const handleProfileSave = () => {
    setIsProfileOpen(false)
    // TODO: connect backend update later
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* ---------- Edit Profile Modal ---------- */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Full Name"
            />
            <Input
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleProfileSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------- Dashboard Content ---------- */}
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
  <div>
    <h2 className="text-3xl font-bold">Admin Dashboard</h2>
    <p className="text-muted-foreground">Monitor system performance and manage operations</p>
  </div>
  <div className="flex items-center gap-3">
    <Button 
  onClick={() => router.push("/edit-profile")} 
  variant="outline"
>
  Edit Profile
</Button>

    <Button
      onClick={() => {
        router.push("/login") // later connect with logout()
      }}
      variant="destructive"
    >
      Logout
    </Button>
  </div>
</div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">{activeUsers} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">Total processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ${(totalTransactionVolume / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">Transaction volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fraud Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{suspiciousTransactions}</div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">98.5%</div>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="transactions" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={accountTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {accountTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Monitoring</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement accounts={accounts} onUpdate={refresh} />
          </TabsContent>

          <TabsContent value="fraud">
            <FraudMonitoring transactions={transactions} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionMonitoring transactions={transactions} />
          </TabsContent>

          <TabsContent value="reports">
            <SystemReports accounts={accounts} transactions={transactions} loans={loans} cards={cards} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
