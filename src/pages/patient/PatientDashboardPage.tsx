import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { usePatientRequests } from "@/contexts/PatientRequestsContext"
import type { RequestStatus } from "@/contexts/PatientRequestsContext"
import {
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  Plus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  in_review: { label: "In Review", variant: "default" },
  completed: { label: "Completed", variant: "outline" },
  action_needed: { label: "Action Needed", variant: "destructive" },
}

export default function PatientDashboardPage() {
  const { user } = useAuth()
  const { requests } = usePatientRequests()
  const navigate = useNavigate()

  const activeRequests = requests.filter((r) => r.status !== "completed")

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg border bg-gradient-to-r from-primary/5 to-primary/10 p-6">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your healthcare from your patient portal
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Next: Jun 5, 2026 at 10:00 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45.00</div>
            <p className="text-xs text-muted-foreground">Due by Jun 15, 2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Requests
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeRequests.length === 0
                ? "No pending requests"
                : "Awaiting nurse review"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>
              Your pending nursing assessment intake requests
            </CardDescription>
          </div>
          <Button onClick={() => navigate("/patient/pre-nursing-intake")}>
            <Plus className="mr-2 h-4 w-4" />
            Start Nursing Intake
          </Button>
        </CardHeader>
        <CardContent>
          {activeRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No active requests. Start a new nursing assessment intake to get
                started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {req.intakeData.chiefComplaint}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Submitted:{" "}
                      {new Date(req.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={STATUS_CONFIG[req.status].variant}>
                      {STATUS_CONFIG[req.status].label}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/patient/requests")}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View All Requests Link */}
      <div className="text-center">
        <Button variant="link" onClick={() => navigate("/patient/requests")}>
          View all my requests →
        </Button>
      </div>
    </div>
  )
}
