"use client"

import { Account } from "./data-store"

// Save the current logged-in account
export function setCurrentUser(user: Account | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user)) // ✅ single key
  } else {
    localStorage.removeItem("currentUser")
  }
}

// Get the current logged-in account
export function getCurrentUser(): Account | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("currentUser")
  return data ? (JSON.parse(data) as Account) : null
}

// Logout clears session
export function logout() {
  setCurrentUser(null)
}
