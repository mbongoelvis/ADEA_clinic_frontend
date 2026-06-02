import { useState } from "react"
import { Download, MoreHorizontal, Search, UserPlus } from "lucide-react"
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
import { Card, CardContent } from "@/components/ui/card"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface User {
  id: string
  name: string
  email: string
  username: string
  roles: string[]
  status: "Active" | "Disabled"
  lastLogin: string
  employeeId: string
}

const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Smith",
    email: "sarah.smith@clinic.com",
    username: "ssmith",
    roles: ["Clinician"],
    status: "Active",
    lastLogin: "Today, 9:32 AM",
    employeeId: "EMP001",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@clinic.com",
    username: "jdoe",
    roles: ["Receptionist"],
    status: "Active",
    lastLogin: "Today, 8:15 AM",
    employeeId: "EMP002",
  },
  {
    id: "3",
    name: "Robert Brown",
    email: "r.brown@clinic.com",
    username: "rbrown",
    roles: ["Billing Specialist"],
    status: "Active",
    lastLogin: "Yesterday",
    employeeId: "EMP003",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "m.garcia@clinic.com",
    username: "mgarcia",
    roles: ["Nurse/MA", "Clinician"],
    status: "Active",
    lastLogin: "2 days ago",
    employeeId: "EMP004",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "j.wilson@clinic.com",
    username: "jwilson",
    roles: ["Auditor"],
    status: "Disabled",
    lastLogin: "15 days ago",
    employeeId: "EMP005",
  },
  {
    id: "6",
    name: "Admin User",
    email: "admin@clinic.com",
    username: "admin",
    roles: ["Admin"],
    status: "Active",
    lastLogin: "Just now",
    employeeId: "EMP006",
  },
]

const ALL_ROLES = [
  "Admin",
  "Receptionist",
  "Billing Specialist",
  "Clinician",
  "Nurse/MA",
  "Auditor",
]
const EMPTY_FORM = {
  name: "",
  email: "",
  username: "",
  password: "",
  autoPassword: true,
  employeeId: "",
  department: "",
  npi: "",
  roles: [] as string[],
  requireMfa: false,
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    const matchRole = roleFilter === "all" || u.roles.includes(roleFilter)
    const matchStatus = statusFilter === "all" || u.status === statusFilter
    return matchSearch && matchRole && matchStatus
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const allChecked =
    paginated.length > 0 && paginated.every((u) => selectedIds.has(u.id))

  const toggleAll = () => {
    const s = new Set(selectedIds)
    if (allChecked) paginated.forEach((u) => s.delete(u.id))
    else paginated.forEach((u) => s.add(u.id))
    setSelectedIds(s)
  }

  const toggleOne = (id: string) => {
    const s = new Set(selectedIds)
    s.has(id) ? s.delete(id) : s.add(id)
    setSelectedIds(s)
  }

  const openAdd = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      username: user.username,
      password: "",
      autoPassword: false,
      employeeId: user.employeeId,
      department: "",
      npi: "",
      roles: [...user.roles],
      requireMfa: false,
    })
    setDialogOpen(true)
  }

  const saveUser = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: form.name,
                email: form.email,
                username: form.username,
                roles: form.roles,
                employeeId: form.employeeId,
              }
            : u
        )
      )
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          name: form.name,
          email: form.email,
          username: form.username,
          roles: form.roles,
          status: "Active",
          lastLogin: "Never",
          employeeId: form.employeeId,
        },
      ])
    }
    setDialogOpen(false)
  }

  const toggleStatus = (user: User) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "Active" ? "Disabled" : "Active" }
          : u
      )
    )

  const confirmDelete = () => {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const bulkDisable = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedIds.has(u.id) ? { ...u, status: "Disabled" } : u
      )
    )
    setSelectedIds(new Set())
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">
            {users.filter((u) => u.status === "Active").length} active ·{" "}
            {users.length} total
          </p>
        </div>
        <Button onClick={openAdd}>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, username…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-8"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              setRoleFilter(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2 text-sm">
            <span className="font-medium">{selectedIds.size} selected</span>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" size="sm" onClick={bulkDisable}>
              Disable selected
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear selection
            </Button>
          </div>
        )}

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-4">
                  <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role(s)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={() => toggleOne(user.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((r) => (
                          <Badge key={r} variant="secondary">
                            {r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEdit(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(user)}>
                            {user.status === "Active" ? "Disable" : "Enable"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(user)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Add / Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="u-name">Full Name *</Label>
                <Input
                  id="u-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-email">Email *</Label>
                <Input
                  id="u-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-username">Username *</Label>
                <Input
                  id="u-username"
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
              </div>
            </div>
            <Separator />
            <p className="text-sm font-medium">Password</p>
            <div className="flex items-center gap-3">
              <Switch
                id="u-autopw"
                checked={form.autoPassword}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, autoPassword: v }))
                }
              />
              <Label htmlFor="u-autopw">Auto-generate temporary password</Label>
            </div>
            {!form.autoPassword && (
              <Input
                type="password"
                placeholder="Temporary password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            )}
            <Separator />
            <p className="text-sm font-medium">Employee / Provider Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-empid">Employee ID</Label>
                <Input
                  id="u-empid"
                  value={form.employeeId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employeeId: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="u-dept">Department</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, department: v }))
                  }
                >
                  <SelectTrigger id="u-dept">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administration</SelectItem>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="reception">Reception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.roles.includes("Clinician") && (
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="u-npi">Provider NPI</Label>
                  <Input
                    id="u-npi"
                    value={form.npi}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, npi: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>
            <Separator />
            <p className="text-sm font-medium">Role Assignment</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ROLES.map((role) => (
                <div key={role} className="flex items-center gap-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={form.roles.includes(role)}
                    onCheckedChange={(c) =>
                      setForm((f) => ({
                        ...f,
                        roles: c
                          ? [...f.roles, role]
                          : f.roles.filter((r) => r !== role),
                      }))
                    }
                  />
                  <Label htmlFor={`role-${role}`} className="font-normal">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Switch
                id="u-mfa"
                checked={form.requireMfa}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, requireMfa: v }))
                }
              />
              <Label htmlFor="u-mfa">Require MFA</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            {editingUser && (
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteTarget(editingUser)
                  setDialogOpen(false)
                }}
              >
                Delete User
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUser}>
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
