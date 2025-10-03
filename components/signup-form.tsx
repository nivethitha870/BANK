"use client"

import { setCurrentUser } from "@/lib/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  Building2,
  Lock,
  User,
  AtSign,
  Smartphone,
  KeyRound,
  Eye,
} from "lucide-react"

// ✅ Import data-store helpers
import { addAccount, getAccounts } from "@/lib/data-store"

export function SignupForm() {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"customer" | "banker" | "admin">("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [errors, setErrors] = useState<any>({})

  const router = useRouter()
  const { toast } = useToast()

  // ✅ Validation
  const validateFields = () => {
    const newErrors: any = {}

    if (!/^SB\d{10}$/.test(id)) {
      newErrors.id = "ID must start with SB and contain 10 digits."
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must only contain letters."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address."
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits."
    }
    if (!/^(?=.*[!@#$%^&*(),.?\":{}|<>]).{6,}$/.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters and include a special character."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateFields()) {
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // ✅ Check if user already exists (inside accounts)
    const existingAccounts = getAccounts()
    if (existingAccounts.some((acc) => acc.accountNumber === id || acc.email === email)) {
      toast({
        title: "Sign Up Failed",
        description: "User already exists. Please login.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // ✅ Create account in "accounts" storage
    const newUser = addAccount({
  accountNumber: id,
  accountType: "savings",
  balance: 0,
  customerName: name,
  email,
  phone: phoneNumber,
  password,
  role, // ✅ already in lowercase because of fix above
  status: "active",
  createdAt: new Date().toISOString(),
})


    // ✅ Save session
    setCurrentUser(newUser)
    localStorage.setItem("userEmail", newUser.email)

    toast({
      title: "Account Created",
      description: `Welcome, ${name} (${role})! Please login.`,
    })

    setIsLoading(false)
    router.push("/login")
  }

  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl animate-fade-in">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">SecureBank Sign Up</CardTitle>
        <CardDescription>Create your account to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID */}
          <div className="space-y-1">
            <Label htmlFor="id">Account ID</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="id"
                type="text"
                placeholder="SB1234567890"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.id && <p className="text-xs text-red-500">{errors.id}</p>}
          </div>

          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-green-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <select
  id="role"
  value={role}
  onChange={(e) => setRole(e.target.value as "customer" | "banker" | "admin")}
  className="w-full rounded-md border px-3 py-2"
>
  <option value="customer">Customer</option>
  <option value="banker">Banker</option>
  <option value="admin">Admin</option>
</select>

          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        {/* ✅ Login link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-600 underline cursor-pointer hover:text-green-700"
          >
            Log in
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
