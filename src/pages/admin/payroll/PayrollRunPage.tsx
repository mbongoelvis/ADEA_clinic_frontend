import { useState } from "react"
import { ChevronDown, ChevronRight, Download, Play } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PayrollRow {
  id: string
  name: string
  regular: number
  overtime: number
  leave: number
  rate: number
  grossPay: number
  tax: number
  benefits: number
  netPay: number
  adjustment: number
}

const MOCK_PAYROLL: PayrollRow[] = [
  {
    id: "E001",
    name: "Dr. Sarah Johnson",
    regular: 80,
    overtime: 0,
    leave: 0,
    rate: 95,
    grossPay: 7600,
    tax: 1824,
    benefits: 380,
    netPay: 5396,
    adjustment: 0,
  },
  {
    id: "E002",
    name: "Marcus Torres",
    regular: 80,
    overtime: 0,
    leave: 0,
    rate: 22,
    grossPay: 1760,
    tax: 352,
    benefits: 88,
    netPay: 1320,
    adjustment: 0,
  },
  {
    id: "E003",
    name: "Rina Patel",
    regular: 76,
    overtime: 4,
    leave: 0,
    rate: 38,
    grossPay: 3230,
    tax: 710.6,
    benefits: 161.5,
    netPay: 2357.9,
    adjustment: 0,
  },
  {
    id: "E004",
    name: "James Okonkwo",
    regular: 48,
    overtime: 8,
    leave: 0,
    rate: 30,
    grossPay: 1680,
    tax: 369.6,
    benefits: 84,
    netPay: 1226.4,
    adjustment: 0,
  },
]

const HISTORY = [
  {
    date: "Jun 15, 2026",
    period: "Jun 1–15, 2026",
    total: "$14,270.00",
    status: "Completed",
  },
  {
    date: "May 31, 2026",
    period: "May 16–31, 2026",
    total: "$14,100.00",
    status: "Completed",
  },
  {
    date: "May 15, 2026",
    period: "May 1–15, 2026",
    total: "$13,980.00",
    status: "Completed",
  },
]

export default function PayrollRunPage() {
  const [startDate, setStartDate] = useState("2026-06-16")
  const [endDate, setEndDate] = useState("2026-06-30")
  const [payDate, setPayDate] = useState("2026-06-30")
  const [rows, setRows] = useState<PayrollRow[]>(MOCK_PAYROLL)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [ran, setRan] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const total = rows.reduce((s, r) => s + r.grossPay + r.adjustment, 0)

  const updateAdj = (id: string, val: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, adjustment: parseFloat(val) || 0 } : r
      )
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Payroll Processing</h1>
        <p className="text-muted-foreground">
          Review and run payroll for a pay period
        </p>
      </div>

      {/* Period config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Pay Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Period Start</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-44"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Period End</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-44"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Pay Date</Label>
              <Input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-44"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Payroll Preview — {startDate} to {endDate}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={() => setConfirmOpen(true)}
              disabled={ran}
            >
              <Play className="mr-2 h-4 w-4" />
              {ran ? "Payroll Processed" : "Run Payroll"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Reg. Hrs</TableHead>
                <TableHead className="text-right">OT Hrs</TableHead>
                <TableHead className="text-right">Leave Hrs</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Benefits</TableHead>
                <TableHead className="text-right">Adjustment</TableHead>
                <TableHead className="text-right font-semibold">
                  Net Pay
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const expanded = expandedId === r.id
                return (
                  <>
                    <TableRow
                      key={r.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedId(expanded ? null : r.id)}
                    >
                      <TableCell>
                        {expanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-right">{r.regular}</TableCell>
                      <TableCell className="text-right">
                        {r.overtime || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {r.leave || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        ${r.grossPay.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${r.tax.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        ${r.benefits.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          value={r.adjustment || ""}
                          placeholder="0.00"
                          onChange={(e) => updateAdj(r.id, e.target.value)}
                          className="h-7 w-24 text-right text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${(r.netPay + r.adjustment).toFixed(2)}
                      </TableCell>
                    </TableRow>
                    {expanded && (
                      <TableRow key={`${r.id}-detail`} className="bg-muted/30">
                        <TableCell
                          colSpan={10}
                          className="px-8 py-3 text-sm text-muted-foreground"
                        >
                          <strong>Tax Breakdown:</strong> Federal withholding: $
                          {(r.tax * 0.6).toFixed(2)} · State: $
                          {(r.tax * 0.3).toFixed(2)} · FICA: $
                          {(r.tax * 0.1).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
              <TableRow className="font-semibold">
                <TableCell colSpan={5} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell colSpan={4} />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payroll History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run Date</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead>Total Gross</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORY.map((h) => (
                <TableRow key={h.date}>
                  <TableCell>{h.date}</TableCell>
                  <TableCell>{h.period}</TableCell>
                  <TableCell className="font-medium">{h.total}</TableCell>
                  <TableCell>
                    <Badge variant="default">{h.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run Payroll?</AlertDialogTitle>
            <AlertDialogDescription>
              This will process payroll for {rows.length} employees totalling{" "}
              <strong>
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </strong>{" "}
              for the period {startDate} to {endDate}. A NACHA direct deposit
              file will be generated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setRan(true)
                setConfirmOpen(false)
              }}
            >
              Confirm & Run Payroll
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
