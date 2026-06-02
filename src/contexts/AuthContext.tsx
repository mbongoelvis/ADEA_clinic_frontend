import { createContext, useContext, useState, ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  name: string
  email: string
  role: "admin" | "patient"
  mfaVerified: boolean
}

interface AuthContextType {
  user: AuthUser | null
  pendingEmail: string | null
  pendingRole: "admin" | "patient" | null
  resendAvailableAt: Date | null
  lockedUntil: Date | null
  loginAttempts: number
  loginWithPassword: (
    email: string,
    password: string
  ) => { success: boolean; requiresMfa?: boolean; error?: string }
  initiatePatientOtp: (email: string) => { success: boolean; error?: string }
  verifyMfa: (code: string) => { success: boolean; error?: string }
  verifyPatientOtp: (code: string) => { success: boolean; error?: string }
  resendOtp: () => { success: boolean; error?: string }
  logout: () => void
}

// ─── Test credentials ────────────────────────────────────────────────────────

const ADMIN_CREDS = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@clinic.com",
  password: "Admin@1234",
  mfaCode: "123456",
  role: "admin" as const,
}

const PATIENT_CREDS = {
  id: "patient-1",
  name: "John Patient",
  email: "patient@example.com",
  otpCode: "654321",
  role: "patient" as const,
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 min
const MAX_OTP_ATTEMPTS = 3
const RESEND_COOLDOWN_MS = 60 * 1000 // 60 sec
const SESSION_KEY = "clinic_ims_session"

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch {
      return null
    }
  })

  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [pendingRole, setPendingRole] = useState<"admin" | "patient" | null>(
    null
  )
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null)
  const [otpAttempts, setOtpAttempts] = useState(0)
  const [resendAvailableAt, setResendAvailableAt] = useState<Date | null>(null)

  // ── Password login (admin) ─────────────────────────────────────────────────

  const loginWithPassword = (email: string, password: string) => {
    // Check lockout
    if (lockedUntil && new Date() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil.getTime() - Date.now()) / 60000)
      return {
        success: false,
        error: `Account locked. Try again in ${remaining} minute(s).`,
      }
    }

    const isValid =
      email.toLowerCase() === ADMIN_CREDS.email &&
      password === ADMIN_CREDS.password

    if (!isValid) {
      const attempts = loginAttempts + 1
      setLoginAttempts(attempts)
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        setLockedUntil(new Date(Date.now() + LOCKOUT_DURATION_MS))
        setLoginAttempts(0)
        return {
          success: false,
          error: "Too many failed attempts. Account locked for 15 minutes.",
        }
      }
      return {
        success: false,
        error: `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - attempts} attempt(s) remaining.`,
      }
    }

    // Success → trigger MFA step
    setLoginAttempts(0)
    setLockedUntil(null)
    setPendingEmail(email)
    setPendingRole("admin")
    setOtpAttempts(0)
    setResendAvailableAt(new Date(Date.now() + RESEND_COOLDOWN_MS))
    return { success: true, requiresMfa: true }
  }

  // ── Patient OTP initiation ─────────────────────────────────────────────────

  const initiatePatientOtp = (email: string) => {
    if (email.toLowerCase() !== PATIENT_CREDS.email) {
      return {
        success: false,
        error: "No patient account found with that email address.",
      }
    }
    if (resendAvailableAt && new Date() < resendAvailableAt) {
      const remaining = Math.ceil(
        (resendAvailableAt.getTime() - Date.now()) / 1000
      )
      return {
        success: false,
        error: `Please wait ${remaining}s before requesting another code.`,
      }
    }

    setPendingEmail(email)
    setPendingRole("patient")
    setOtpAttempts(0)
    setResendAvailableAt(new Date(Date.now() + RESEND_COOLDOWN_MS))
    return { success: true }
  }

  // ── Admin MFA verification ─────────────────────────────────────────────────

  const verifyMfa = (code: string) => {
    if (pendingRole !== "admin")
      return { success: false, error: "No pending MFA session." }

    if (code !== ADMIN_CREDS.mfaCode) {
      const attempts = otpAttempts + 1
      setOtpAttempts(attempts)
      if (attempts >= MAX_OTP_ATTEMPTS) {
        setPendingEmail(null)
        setPendingRole(null)
        return {
          success: false,
          error: "Too many incorrect attempts. Please log in again.",
          forceLogout: true,
        }
      }
      return {
        success: false,
        error: `Incorrect code. ${MAX_OTP_ATTEMPTS - attempts} attempt(s) remaining.`,
      }
    }

    const authUser: AuthUser = {
      id: ADMIN_CREDS.id,
      name: ADMIN_CREDS.name,
      email: ADMIN_CREDS.email,
      role: "admin",
      mfaVerified: true,
    }
    setUser(authUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    setPendingEmail(null)
    setPendingRole(null)
    return { success: true }
  }

  // ── Patient OTP verification ───────────────────────────────────────────────

  const verifyPatientOtp = (code: string) => {
    if (pendingRole !== "patient")
      return { success: false, error: "No pending OTP session." }

    if (code !== PATIENT_CREDS.otpCode) {
      const attempts = otpAttempts + 1
      setOtpAttempts(attempts)
      if (attempts >= MAX_OTP_ATTEMPTS) {
        setPendingEmail(null)
        setPendingRole(null)
        return {
          success: false,
          error: "Too many incorrect attempts. Please request a new code.",
          forceLogout: true,
        }
      }
      return {
        success: false,
        error: `Incorrect code. ${MAX_OTP_ATTEMPTS - attempts} attempt(s) remaining.`,
      }
    }

    const authUser: AuthUser = {
      id: PATIENT_CREDS.id,
      name: PATIENT_CREDS.name,
      email: PATIENT_CREDS.email,
      role: "patient",
      mfaVerified: false,
    }
    setUser(authUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
    setPendingEmail(null)
    setPendingRole(null)
    return { success: true }
  }

  // ── Resend OTP/MFA code ────────────────────────────────────────────────────

  const resendOtp = () => {
    if (!pendingEmail || !pendingRole)
      return { success: false, error: "No pending session." }
    if (resendAvailableAt && new Date() < resendAvailableAt) {
      const remaining = Math.ceil(
        (resendAvailableAt.getTime() - Date.now()) / 1000
      )
      return { success: false, error: `Please wait ${remaining}s.` }
    }
    setOtpAttempts(0)
    setResendAvailableAt(new Date(Date.now() + RESEND_COOLDOWN_MS))
    return { success: true }
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
    setPendingEmail(null)
    setPendingRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingEmail,
        pendingRole,
        resendAvailableAt,
        lockedUntil,
        loginAttempts,
        loginWithPassword,
        initiatePatientOtp,
        verifyMfa,
        verifyPatientOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
