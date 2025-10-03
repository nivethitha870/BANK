"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getUserByEmail, updateUserProfile } from "@/lib/data-store"

export default function EditProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [passwords, setPasswords] = useState({ new: "", confirm: "" })
  const [errors, setErrors] = useState<any>({})
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    console.log("🔎 Logged in email from localStorage:", email)

    if (email) {
      const user = getUserByEmail(email) // ✅ sync function
      console.log("📂 Fetched user from accounts:", user)

      if (user) {
        setProfile({
          accountNumber: user.accountNumber,
          name: user.customerName,
          email: user.email,
          phone: user.phone || "",
        })
      } else {
        console.warn("⚠️ No user found for this email in accounts")
      }
    } else {
      console.warn("⚠️ userEmail not found in localStorage. Did you set it during login?")
    }
  }, [])

  const validate = () => {
    let newErrors: any = {}

    if (!profile?.name?.trim()) {
      newErrors.name = "Full Name is required"
    }
    if (!profile?.phone?.trim()) {
      newErrors.phone = "Phone Number is required"
    } else if (!/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = "Phone Number must be exactly 10 digits"
    }
    if (passwords.new || passwords.confirm) {
      if (passwords.new.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters"
      }
      if (passwords.new !== passwords.confirm) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = () => {
    if (!validate()) return
    if (!profile) return

    console.log("💾 Saving profile updates:", profile)

    updateUserProfile(profile.email, {
      customerName: profile.name,
      phone: profile.phone,
      ...(passwords.new ? { password: passwords.new } : {}),
    })

    setSuccess("Profile updated successfully ✅")
    setTimeout(() => router.push("/admin"), 2000)
  }

  if (!profile) return <p className="text-center mt-10">Loading...</p>

  return (
    <DashboardLayout title="Edit Profile">
      <Card className="p-6 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Account Number (readonly) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Account Number</label>
            <Input value={profile.accountNumber} disabled />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Email (readonly) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input value={profile.email} disabled />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
            {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.push("/admin")}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
