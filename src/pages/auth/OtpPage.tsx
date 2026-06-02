import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, ArrowLeft, Mail } from "lucide-react"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function OtpPage() {
  const {
    verifyPatientOtp,
    resendOtp,
    pendingEmail,
    pendingRole,
    resendAvailableAt,
  } = useAuth()
  const navigate = useNavigate()

  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Guard: only accessible when patient is pending OTP
  useEffect(() => {
    if (pendingRole !== "patient") navigate("/login", { replace: true })
  }, [pendingRole, navigate])

  // Countdown timer
  useEffect(() => {
    if (!resendAvailableAt) return
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((resendAvailableAt.getTime() - Date.now()) / 1000)
      )
      setResendCooldown(remaining)
    }
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [resendAvailableAt])

  const handleVerify = () => {
    if (code.length !== 6) return
    setError("")
    setLoading(true)
    const result = verifyPatientOtp(code)
    setLoading(false)
    if (result.success) {
      navigate("/patient/dashboard", { replace: true })
    } else {
      setError(result.error ?? "Verification failed")
      setCode("")
      if (result.error?.includes("new code")) {
        navigate("/login", { replace: true })
      }
    }
  }

  const handleResend = () => {
    const result = resendOtp()
    if (result.success) {
      setResendSuccess(true)
      setError("")
      setTimeout(() => setResendSuccess(false), 3000)
    } else {
      setError(result.error ?? "Failed to resend")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Activity className="h-8 w-8 text-primary" />
            <span>Clinic IMS</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We sent a 6-digit code to
              <br />
              <span className="font-medium text-foreground">
                {pendingEmail}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {resendSuccess && (
              <Alert>
                <AlertDescription>
                  A new code has been sent to your email.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center py-2">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={handleVerify}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={code.length !== 6 || loading}
            >
              {loading ? "Verifying…" : "Verify Code"}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                className="text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </button>
            </div>

            {/* Test hint */}
            <div className="rounded-lg bg-muted p-3 text-xs">
              <p className="mb-1 font-medium">Test OTP Code</p>
              <p>
                Enter:{" "}
                <code className="rounded bg-background px-1">654321</code>
              </p>
              <p className="mt-1 text-muted-foreground">
                OTP expires after 10 minutes · 3 attempts allowed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
