"use client"

import { setCurrentUser, getAccountByNumber } from "@/lib/data-store"   // ✅ use accountNumber now
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Building2, Lock, KeyRound, Eye } from "lucide-react"

export function LoginForm() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [idError, setIdError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  const validateFields = () => {
    let valid = true
    setIdError("")
    setPasswordError("")

    if (!/^SB\d{10}$/.test(id)) {
      setIdError("ID must start with SB and contain 10 digits.")
      valid = false
    }
    if (!password) {
      setPasswordError("Password is required.")
      valid = false
    }
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateFields()) {
      setIsLoading(false)
      return
    }

    // ✅ fetch user from accounts by accountNumber
    const user = getAccountByNumber(id)

    if (!user) {
      toast({
        title: "Login Failed",
        description: "User not found. Please register first.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (user.password !== password) {
      setPasswordError("Invalid password.")
      setIsLoading(false)
      return
    }

    // ✅ Save session
    setCurrentUser(user)
    localStorage.setItem("accountNumber", user.accountNumber)
    localStorage.setItem("customerName", user.customerName)
    localStorage.setItem("userEmail", user.email)
    localStorage.setItem("currentUser", JSON.stringify(user))

    toast({
      title: "Login Successful",
      description: `Welcome, ${user.customerName}!`,
    })

    // ✅ Redirect based on role (lowercase check)
    if (user.role === "admin") router.push("/admin")
    else if (user.role === "banker") router.push("/banker")
    else router.push("/customer")

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl animate-fade-in">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">SecureBank Login</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account ID */}
          <div className="space-y-2">
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
            {idError && <p className="text-sm text-red-500">{idError}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
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
                className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* ✅ Signup link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 underline cursor-pointer hover:text-blue-700"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
