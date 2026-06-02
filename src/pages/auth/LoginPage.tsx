import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const { user, loginWithPassword, initiatePatientOtp } = useAuth()
  const navigate = useNavigate()

  // Redirect already-authenticated users
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard", { replace: true })
    else if (user?.role === "patient")
      navigate("/patient/dashboard", { replace: true })
  }, [user, navigate])

  // Admin form
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [adminError, setAdminError] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)

  // Patient form
  const [patientEmail, setPatientEmail] = useState("")
  const [patientError, setPatientError] = useState("")
  const [patientLoading, setPatientLoading] = useState(false)

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAdminError("")
    setAdminLoading(true)
    const result = loginWithPassword(adminEmail, adminPassword)
    setAdminLoading(false)
    if (result.success && result.requiresMfa) {
      navigate("/auth/mfa")
    } else if (!result.success) {
      setAdminError(result.error ?? "Login failed")
    }
  }

  const handlePatientOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setPatientError("")
    setPatientLoading(true)
    const result = initiatePatientOtp(patientEmail)
    setPatientLoading(false)
    if (result.success) {
      navigate("/auth/otp")
    } else {
      setPatientError(result.error ?? "Failed to send OTP")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Activity className="h-8 w-8 text-primary" />
            <span>Clinic IMS</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to access your portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="staff">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="staff">Staff Login</TabsTrigger>
                <TabsTrigger value="patient">Patient Portal</TabsTrigger>
              </TabsList>

              {/* ── Staff / Admin tab ── */}
              <TabsContent value="staff">
                <form
                  onSubmit={handleAdminLogin}
                  className="flex flex-col gap-4"
                >
                  {adminError && (
                    <Alert variant="destructive">
                      <AlertDescription>{adminError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@clinic.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        className="absolute top-2.5 right-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={adminLoading}
                  >
                    {adminLoading ? "Signing in…" : "Sign In"}
                  </Button>
                  {/* Test credential hint */}
                  <div className="rounded-lg bg-muted p-3 text-xs">
                    <p className="mb-1 font-medium">Test credentials</p>
                    <p>
                      Email:{" "}
                      <code className="rounded bg-background px-1">
                        admin@clinic.com
                      </code>
                    </p>
                    <p>
                      Password:{" "}
                      <code className="rounded bg-background px-1">
                        Admin@1234
                      </code>
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      MFA code shown on the next step.
                    </p>
                  </div>
                </form>
              </TabsContent>

              {/* ── Patient tab ── */}
              <TabsContent value="patient">
                <form
                  onSubmit={handlePatientOtp}
                  className="flex flex-col gap-4"
                >
                  {patientError && (
                    <Alert variant="destructive">
                      <AlertDescription>{patientError}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a one-time code
                    to sign in — no password needed.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="patient-email">Email Address</Label>
                    <Input
                      id="patient-email"
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={patientLoading}
                  >
                    {patientLoading ? "Sending…" : "Send One-Time Code"}
                  </Button>
                  {/* Test credential hint */}
                  <div className="rounded-lg bg-muted p-3 text-xs">
                    <p className="mb-1 font-medium">Test credentials</p>
                    <p>
                      Email:{" "}
                      <code className="rounded bg-background px-1">
                        patient@example.com
                      </code>
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      OTP code shown on the next step.
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
