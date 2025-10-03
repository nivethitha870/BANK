"use client"

// ============================
// INTERFACES
// ============================

export interface Account {
  id: string
  accountNumber: string
  accountType: "savings" | "current"
  balance: number
  customerName: string
  email: string
  phone?: string
  address?: string
  password: string
  role: "admin" | "banker" | "customer"
  status: "active" | "inactive" | "pending"
  createdAt: string
}

export interface Transaction {
  id: string
  fromAccount: string
  toAccount: string
  amount: number
  type: "IMPS" | "NEFT" | "RTGS" | "UPI"
  category: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  description: string
}

export interface Card {
  id: string
  cardNumber: string
  cardType: "debit" | "credit" | "virtual"
  accountNumber: string
  customerName: string
  expiryDate: string
  cvv: string
  limit?: number
  status: "active" | "blocked" | "pending"
}

export interface Loan {
  id: string
  loanType: "personal" | "home" | "car" | "education"
  amount: number
  interestRate: number
  tenure: number
  emi: number
  accountNumber: string
  customerName: string
  status: "pending" | "approved" | "rejected" | "active"
  appliedDate: string
}

export interface Investment {
  id: string
  investmentType: "FD" | "RD" | "Mutual Fund"
  amount: number
  interestRate: number
  tenure: number
  accountNumber: string
  customerName: string
  maturityDate: string
  status: "active" | "matured"
}

// ============================
// INITIAL DATA
// ============================

const initializeData = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("accounts")) {
    const sampleAccounts: Account[] = [
      {
        id: "1",
        accountNumber: "ACC1234567890",
        accountType: "savings",
        balance: 50000,
        customerName: "John Customer",
        email: "john.customer@bank.com",
        phone: "9876543210",
        address: "Chennai",
        password: "password123",
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        accountNumber: "ACC9876543210",
        accountType: "current",
        balance: 100000,
        customerName: "Jane Customer",
        email: "jane.customer@bank.com",
        phone: "9123456789",
        address: "Bangalore",
        password: "password123",
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("accounts", JSON.stringify(sampleAccounts))
  }

  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]))
  }

  if (!localStorage.getItem("cards")) {
    localStorage.setItem("cards", JSON.stringify([]))
  }

  if (!localStorage.getItem("loans")) {
    localStorage.setItem("loans", JSON.stringify([]))
  }

  if (!localStorage.getItem("investments")) {
    localStorage.setItem("investments", JSON.stringify([]))
  }
}

// ============================
// ACCOUNTS
// ============================

export function getAccounts(): Account[] {
  initializeData()
  const data = localStorage.getItem("accounts")
  return data ? (JSON.parse(data) as Account[]) : []
}

export function addAccount(account: Omit<Account, "id">): Account {
  const accounts = getAccounts()
  const newAccount: Account = { ...account, id: Date.now().toString() }
  accounts.push(newAccount)
  localStorage.setItem("accounts", JSON.stringify(accounts))
  return newAccount
}

export function updateAccount(id: string, updates: Partial<Account>): Account | null {
  const accounts = getAccounts()
  const index = accounts.findIndex(a => a.id === id)
  if (index === -1) return null
  accounts[index] = { ...accounts[index], ...updates }
  localStorage.setItem("accounts", JSON.stringify(accounts))
  return accounts[index]
}

// ✅ Get account by accountNumber (used for login with SB123... ID)
export function getAccountByNumber(accountNumber: string): Account | null {
  const accounts = getAccounts()
  return accounts.find(a => a.accountNumber === accountNumber) || null
}

// ✅ Get user by email (for edit-profile, etc.)
export function getUserByEmail(email: string): Account | null {
  const accounts = getAccounts()
  return accounts.find(a => a.email === email) || null
}

// ✅ Update user profile by email
export function updateUserProfile(email: string, updates: Partial<Account>): Account | null {
  const accounts = getAccounts()
  const index = accounts.findIndex(a => a.email === email)
  if (index === -1) return null
  accounts[index] = { ...accounts[index], ...updates }
  localStorage.setItem("accounts", JSON.stringify(accounts))
  return accounts[index]
}

// ============================
// TRANSACTIONS
// ============================

export function getTransactions(): Transaction[] {
  initializeData()
  const data = localStorage.getItem("transactions")
  return data ? (JSON.parse(data) as Transaction[]) : []
}

export function addTransaction(transaction: Omit<Transaction, "id">): Transaction {
  const transactions = getTransactions()
  const newTransaction = { ...transaction, id: Date.now().toString() }
  transactions.push(newTransaction)
  localStorage.setItem("transactions", JSON.stringify(transactions))
  return newTransaction
}

// ============================
// CARDS
// ============================

export function getCards(): Card[] {
  initializeData()
  const data = localStorage.getItem("cards")
  return data ? (JSON.parse(data) as Card[]) : []
}

export function addCard(card: Omit<Card, "id">): Card {
  const cards = getCards()
  const newCard = { ...card, id: Date.now().toString() }
  cards.push(newCard)
  localStorage.setItem("cards", JSON.stringify(cards))
  return newCard
}

export function updateCard(id: string, updates: Partial<Card>): Card | null {
  const cards = getCards()
  const index = cards.findIndex(c => c.id === id)
  if (index === -1) return null
  cards[index] = { ...cards[index], ...updates }
  localStorage.setItem("cards", JSON.stringify(cards))
  return cards[index]
}

// ============================
// LOANS
// ============================

export function getLoans(): Loan[] {
  initializeData()
  const data = localStorage.getItem("loans")
  return data ? (JSON.parse(data) as Loan[]) : []
}

export function addLoan(loan: Omit<Loan, "id">): Loan {
  const loans = getLoans()
  const newLoan = { ...loan, id: Date.now().toString() }
  loans.push(newLoan)
  localStorage.setItem("loans", JSON.stringify(loans))
  return newLoan
}

export function updateLoan(id: string, updates: Partial<Loan>): Loan | null {
  const loans = getLoans()
  const index = loans.findIndex(l => l.id === id)
  if (index === -1) return null
  loans[index] = { ...loans[index], ...updates }
  localStorage.setItem("loans", JSON.stringify(loans))
  return loans[index]
}

// ============================
// INVESTMENTS
// ============================

export function getInvestments(): Investment[] {
  initializeData()
  const data = localStorage.getItem("investments")
  return data ? (JSON.parse(data) as Investment[]) : []
}

export function addInvestment(investment: Omit<Investment, "id">): Investment {
  const investments = getInvestments()
  const newInvestment = { ...investment, id: Date.now().toString() }
  investments.push(newInvestment)
  localStorage.setItem("investments", JSON.stringify(investments))
  return newInvestment
}

// ============================
// SESSION HANDLING
// ============================

export type User = {
  accountNumber: string
  accountType: string
  balance: number
  customerName: string
  email: string
  phone: string
  password: string
  role: "customer" | "banker" | "admin"
  status: string
  createdAt: string
}

let currentUser: User | null = null

export function setCurrentUser(user: User) {
  currentUser = user
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export function getCurrentUser(): User | null {
  if (!currentUser && typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser")
    if (stored) {
      currentUser = JSON.parse(stored)
    }
  }
  return currentUser
}

export function logout() {
  currentUser = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}
