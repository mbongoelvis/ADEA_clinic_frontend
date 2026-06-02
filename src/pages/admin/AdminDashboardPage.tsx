import { Link } from "react-router-dom"
import {
  Activity,
  Calendar,
  Database,
  DollarSign,
  HardDrive,
  RefreshCw,
  UserPlus,
  Users,
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const healthCards = [
  {
    label: "API Status",
    value: "Operational",
    status: "green",
    icon: Activity,
  },
  {
    label: "Last Backup",
    value: "Today, 03:00 AM",
    status: "green",
    icon: HardDrive,
  },
  { label: "Database Size", value: "4.2 GB", status: "green", icon: Database },
  {
    label: "Pending Updates",
    value: "2 available",
    status: "yellow",
    icon: RefreshCw,
  },
]

const recentAudit = [
  {
    user: "Dr. Sarah Smith",
    action: "Updated patient demographics",
    entity: "Patient #4521",
    time: "2 min ago",
    type: "Update",
  },
  {
    user: "Jane Doe",
    action: "Submitted claim",
    entity: "Claim #8834",
    time: "15 min ago",
    type: "Create",
  },
  {
    user: "Admin",
    action: "Created new user: rbrown",
    entity: "User",
    time: "1 hr ago",
    type: "Create",
  },
  {
    user: "Dr. Lee",
    action: "Signed consent document",
    entity: "Document",
    time: "2 hr ago",
    type: "Update",
  },
  {
    user: "System",
    action: "Auto-submitted claims batch",
    entity: "Batch #221",
    time: "5 hr ago",
    type: "System",
  },
]

const actionTypeBadge: Record<string, string> = {
  Update: "bg-blue-100 text-blue-800",
  Create: "bg-green-100 text-green-800",
  System: "bg-gray-100 text-gray-800",
  Delete: "bg-red-100 text-red-800",
}

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner + quick actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Good morning — {today}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* System health cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {healthCards.map(({ label, value, status, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    status === "green"
                      ? "bg-green-500"
                      : status === "yellow"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                <span className="font-semibold">{value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              8 logged in today · 3 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Collections
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,820</div>
            <p className="text-xs text-muted-foreground">
              MRR: $58,400 · Outstanding A/R: $12,300
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              No-show (7d): 8% · Cancellations: 5%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Storage + Recent audit */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>
              Document storage across the system
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={68} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                68 GB used of 100 GB
              </span>
              <span className="text-muted-foreground">
                ↑ 2.4 GB from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Audit Events</CardTitle>
              <CardDescription>Last 5 system actions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentAudit.map((event, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.user}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${actionTypeBadge[event.type] ?? ""}`}
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground">
                        {event.action}
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {event.time}
                    </span>
                  </div>
                  {i < recentAudit.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
