import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "patient")[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, pendingRole } = useAuth()

  if (!user) {
    // Redirect to the correct pending step if mid-auth
    if (pendingRole === "admin") return <Navigate to="/auth/mfa" replace />
    if (pendingRole === "patient") return <Navigate to="/auth/otp" replace />
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Wrong role → send to their own portal
    if (user.role === "patient")
      return <Navigate to="/patient/dashboard" replace />
    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}
