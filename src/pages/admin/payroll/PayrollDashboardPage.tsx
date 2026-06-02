import {
  DollarSign,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SUMMARY_CARDS = [
  {
    label: "Total Payroll This Month",
    value: "$84,320.00",
    icon: DollarSign,
    sub: "+2.4% vs last month",
  },
  {
    label: "Average Hourly Rate",
    value: "$32.50",
    icon: TrendingUp,
    sub: "Across 26 employees",
  },
  {
    label: "Hours Logged (Period)",
    value: "2,418 hrs",
    icon: Clock,
    sub: "Jun 1–15, 2026",
  },
]

const UPCOMING_DATES = [
  {
    label: "Next Payroll Processing",
    date: "Jun 30, 2026",
    note: "Bi-weekly cycle",
  },
  {
    label: "Direct Deposit Submission",
    date: "Jun 29, 2026",
    note: "NACHA file to bank",
  },
]

export default function PayrollDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Payroll Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of payroll activity and upcoming actions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {SUMMARY_CARDS.map(({ label, value, icon: Icon, sub }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm">Run Payroll</Button>
          </CardContent>
        </Card>

        {/* Upcoming dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Payroll Dates</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {UPCOMING_DATES.map((d) => (
                  <TableRow key={d.label}>
                    <TableCell className="font-medium">{d.label}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{d.date}</Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {d.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
