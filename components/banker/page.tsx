import AccountManagement from "@/components/banker/account-management"
import CardApprovals from "@/components/banker/card-approvals"
import LoanApprovals from "@/components/banker/loan-approvals"

export default function BankerDashboard() {
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Banker Dashboard</h1>
      <AccountManagement />
      <CardApprovals />
      <LoanApprovals />
    </div>
  )
}
