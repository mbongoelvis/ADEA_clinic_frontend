import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STAT_CARDS = [
  {
    label: "Total Inventory Value",
    value: "$12,480.00",
    icon: DollarSign,
    sub: "+3.2% vs last month",
  },
  {
    label: "Low Stock Items",
    value: "5",
    icon: Package,
    sub: "Below reorder point",
  },
  {
    label: "COGS This Month",
    value: "$3,210.00",
    icon: BarChart3,
    sub: "Cost of goods sold",
  },
  {
    label: "Pending Orders",
    value: "2",
    icon: ShoppingCart,
    sub: "Open purchase orders",
  },
]

const ALERTS = [
  {
    msg: "Flu Vaccine (vial) — 8 units remaining. Reorder point: 20.",
    type: "warning",
  },
  {
    msg: "Nitrile Gloves (box) — 3 boxes remaining. Reorder point: 10.",
    type: "warning",
  },
  {
    msg: "2 items expiring within 30 days: Hepatitis B Vaccine, Epinephrine Auto-Injector.",
    type: "destructive",
  },
]

const TOP_ITEMS = [
  { name: "Flu Vaccine (vial)", category: "Vaccine", used: 142, unit: "vials" },
  { name: "Nitrile Gloves", category: "PPE", used: 420, unit: "pairs" },
  { name: "Disposable Syringes", category: "Supply", used: 310, unit: "pcs" },
  { name: "Alcohol Swabs", category: "Supply", used: 580, unit: "pcs" },
  { name: "COVID-19 Test Kit", category: "Lab", used: 88, unit: "kits" },
]

const STOCK_LEVELS = [
  { name: "Flu Vaccine", current: 8, max: 100, unit: "vials" },
  { name: "Nitrile Gloves", current: 3, max: 50, unit: "boxes" },
  { name: "Disposable Syringes", current: 45, max: 200, unit: "pcs" },
  { name: "Alcohol Swabs", current: 120, max: 500, unit: "pcs" },
]

export default function InventoryDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        <p className="text-muted-foreground">
          Stock health, alerts, and quick actions
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, sub }) => (
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

      {/* Alerts */}
      <div className="flex flex-col gap-3">
        {ALERTS.map((a, i) => (
          <Alert
            key={i}
            variant={a.type === "destructive" ? "destructive" : "default"}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>
              {a.type === "destructive" ? "Expiring Soon" : "Low Stock"}
            </AlertTitle>
            <AlertDescription>{a.msg}</AlertDescription>
          </Alert>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
            <Button size="sm" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Create PO
            </Button>
            <Button size="sm" variant="outline">
              Scan Barcode
            </Button>
          </CardContent>
        </Card>

        {/* Stock levels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critical Stock Levels</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {STOCK_LEVELS.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground">
                    {s.current}/{s.max} {s.unit}
                  </span>
                </div>
                <Progress value={(s.current / s.max) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top moving items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top Moving Items — Last 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TOP_ITEMS.map((i) => (
                <TableRow key={i.name}>
                  <TableCell className="font-medium">{i.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{i.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {i.used} {i.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
