import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  RefreshCw,
  XCircle,
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const COMPONENTS = [
  { name: "Database", status: "ok", detail: "PostgreSQL 15.3 · 4.2 GB" },
  { name: "API Server", status: "ok", detail: "v2.4.1 · Avg response 142ms" },
  { name: "File Storage", status: "ok", detail: "68 GB used / 100 GB" },
  {
    name: "Background Jobs",
    status: "degraded",
    detail: "Queue: 14 pending · Last failed: 3 min ago",
  },
  { name: "Email Gateway", status: "ok", detail: "Twilio · 0 errors last 24h" },
  { name: "SMS Gateway", status: "ok", detail: "Twilio · 0 errors last 24h" },
]

const INCIDENTS = [
  {
    date: "May 18, 2026",
    duration: "22 min",
    description: "Background job queue backlog due to high claim volume",
    resolution: "Queue cleared; added worker capacity",
  },
  {
    date: "May 3, 2026",
    duration: "8 min",
    description: "API response time spike (p95 > 3s)",
    resolution: "Auto-scaled API instances; resolved",
  },
  {
    date: "Apr 12, 2026",
    duration: "45 min",
    description: "Scheduled backup job failed (disk space)",
    resolution: "Increased storage quota; backup re-ran successfully",
  },
]

const BG_JOBS = [
  { name: "Insurance eligibility batch", status: "Running", count: 8 },
  { name: "ERA posting", status: "Pending", count: 4 },
  { name: "Appointment reminders (SMS)", status: "Failed", count: 1 },
  { name: "Nightly report generation", status: "Pending", count: 2 },
]

const statusIcon = (s: string) => {
  if (s === "ok") return <CheckCircle className="h-4 w-4 text-green-500" />
  if (s === "degraded")
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  return <XCircle className="h-4 w-4 text-red-500" />
}

const statusBadge = (s: string) => {
  if (s === "ok")
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
        OK
      </Badge>
    )
  if (s === "degraded")
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200">
        Degraded
      </Badge>
    )
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Down</Badge>
  )
}

const jobStatusBadge = (s: string) => {
  if (s === "Running")
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
        Running
      </Badge>
    )
  if (s === "Pending") return <Badge variant="secondary">Pending</Badge>
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
  )
}

export default function SystemStatusPage() {
  const allOk = COMPONENTS.every((c) => c.status === "ok")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Status</h1>
          <p className="text-sm text-muted-foreground">
            Real-time health of all system components
          </p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overall status */}
      <Card
        className={
          allOk
            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
            : "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
        }
      >
        <CardContent className="flex items-center gap-4 pt-6">
          {allOk ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          )}
          <div>
            <p className="text-lg font-semibold">
              {allOk
                ? "All Systems Operational"
                : "Partial Service Degradation"}
            </p>
            <p className="text-sm text-muted-foreground">
              Last checked: just now
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Component status */}
      <Card>
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {COMPONENTS.map((comp, i) => (
              <div key={comp.name}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {statusIcon(comp.status)}
                    <div>
                      <p className="text-sm font-medium">{comp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {comp.detail}
                      </p>
                    </div>
                  </div>
                  {statusBadge(comp.status)}
                </div>
                {i < COMPONENTS.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Background jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Background Jobs</CardTitle>
          <CardDescription>Currently queued and running jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {BG_JOBS.map((job) => (
                <TableRow key={job.name}>
                  <TableCell className="font-medium">{job.name}</TableCell>
                  <TableCell>{jobStatusBadge(job.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {job.count}
                  </TableCell>
                  <TableCell>
                    {job.status === "Failed" && (
                      <Button variant="ghost" size="sm">
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Resolution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INCIDENTS.map((inc) => (
                <TableRow key={inc.date}>
                  <TableCell className="whitespace-nowrap">
                    {inc.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      {inc.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>{inc.description}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {inc.resolution}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Support + License + Version */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Error Logs</CardTitle>
            <CardDescription>Download logs for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Logs
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Support</CardTitle>
            <CardDescription>
              Contact vendor with system diagnostics pre-filled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Support Ticket
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">License</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                Jun 4, 2026
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <span>24 / 50</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>2.4.1</span>
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Check for Updates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
