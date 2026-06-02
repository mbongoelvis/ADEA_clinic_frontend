import { useState } from "react"
import { Download, MoreHorizontal, Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Employee {
  id: string
  name: string
  role: string
  department: string
  payRate: string
  payType: "Hourly" | "Salary"
  taxType: "W2" | "1099"
  taxId: string
  frequency: string
  status: "Active" | "Inactive"
  lastRun: string
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "E001",
    name: "Dr. Sarah Johnson",
    role: "Clinician",
    department: "Clinical",
    payRate: "$95.00/hr",
    payType: "Salary",
    taxType: "W2",
    taxId: "***-**-4521",
    frequency: "Bi-weekly",
    status: "Active",
    lastRun: "Jun 15, 2026",
  },
  {
    id: "E002",
    name: "Marcus Torres",
    role: "Receptionist",
    department: "Admin",
    payRate: "$22.00/hr",
    payType: "Hourly",
    taxType: "W2",
    taxId: "***-**-7812",
    frequency: "Bi-weekly",
    status: "Active",
    lastRun: "Jun 15, 2026",
  },
  {
    id: "E003",
    name: "Rina Patel",
    role: "Nurse",
    department: "Clinical",
    payRate: "$38.00/hr",
    payType: "Hourly",
    taxType: "W2",
    taxId: "***-**-3309",
    frequency: "Bi-weekly",
    status: "Active",
    lastRun: "Jun 15, 2026",
  },
  {
    id: "E004",
    name: "James Okonkwo",
    role: "Lab Technician",
    department: "Lab",
    payRate: "$30.00/hr",
    payType: "Hourly",
    taxType: "W2",
    taxId: "***-**-6614",
    frequency: "Weekly",
    status: "Active",
    lastRun: "Jun 22, 2026",
  },
  {
    id: "E005",
    name: "Claire Dubois",
    role: "Consultant",
    department: "Admin",
    payRate: "$85.00/hr",
    payType: "Hourly",
    taxType: "1099",
    taxId: "***-**-9901",
    frequency: "Monthly",
    status: "Inactive",
    lastRun: "May 31, 2026",
  },
]

const BLANK: Partial<Employee> = {
  name: "",
  role: "",
  department: "Clinical",
  payRate: "",
  payType: "Hourly",
  taxType: "W2",
  frequency: "Bi-weekly",
  status: "Active",
}

export default function PayrollEmployeesPage() {
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Partial<Employee>>(BLANK)

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === "all" || e.department === deptFilter
    const matchType = typeFilter === "all" || e.taxType === typeFilter
    const matchStatus = statusFilter === "all" || e.status === statusFilter
    return matchSearch && matchDept && matchType && matchStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll Employees</h1>
          <p className="text-muted-foreground">
            Manage staff pay rates, tax info, and direct deposit
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setForm(BLANK)
              setDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-4">
          <div className="relative min-w-45 flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-37.5">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Clinical">Clinical</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32.5">
              <SelectValue placeholder="Pay Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="W2">W2</SelectItem>
              <SelectItem value="1099">1099</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Pay Rate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tax ID</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell>{e.role}</TableCell>
                  <TableCell>{e.payRate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{e.taxType}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{e.taxId}</TableCell>
                  <TableCell>{e.frequency}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.lastRun}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={e.status === "Active" ? "default" : "secondary"}
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setForm(e)
                            setDialogOpen(true)
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {e.status === "Active"
                            ? "Mark Inactive"
                            : "Reactivate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Pay History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Edit Employee Payroll" : "Add Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label>Full Name</Label>
              <Input
                value={form.name ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Dr. Jane Smith"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <Input
                value={form.role ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
                placeholder="Clinician"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Department</Label>
              <Select
                value={form.department}
                onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clinical">Clinical</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Pay Rate</Label>
              <Input
                value={form.payRate ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, payRate: e.target.value }))
                }
                placeholder="$25.00/hr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Pay Frequency</Label>
              <Select
                value={form.frequency}
                onValueChange={(v) => setForm((f) => ({ ...f, frequency: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Tax Classification</Label>
              <Select
                value={form.taxType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, taxType: v as "W2" | "1099" }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="W2">W2 Employee</SelectItem>
                  <SelectItem value="1099">1099 Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Direct Deposit — Bank (last 4)</Label>
              <Input placeholder="****1234" maxLength={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Save Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
