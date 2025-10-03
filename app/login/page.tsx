"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* ✅ Only Login form, no register link */}
      <LoginForm />
    </div>
  )
}
