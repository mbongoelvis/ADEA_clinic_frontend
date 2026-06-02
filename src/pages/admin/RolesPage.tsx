import { useState } from "react"
import { Copy, PlusCircle, Trash2 } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const PERMISSION_CATEGORIES = [
  {
    id: "appointments",
    label: "Appointments",
    permissions: [
      { id: "view_own_schedule", label: "View own schedule" },
      { id: "view_all_schedule", label: "View all schedules" },
      { id: "create_appointment", label: "Create appointment" },
      { id: "edit_appointment", label: "Edit appointment" },
      { id: "delete_appointment", label: "Delete appointment" },
      { id: "reschedule", label: "Reschedule" },
      { id: "cancel_appointment", label: "Cancel appointment" },
    ],
  },
  {
    id: "patient_records",
    label: "Patient Records",
    permissions: [
      { id: "view_patient", label: "View patient" },
      { id: "edit_patient_demographics", label: "Edit demographics" },
      { id: "merge_patient", label: "Merge duplicate patient" },
      { id: "delete_patient", label: "Delete patient" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    permissions: [
      { id: "view_claim", label: "View claims" },
      { id: "create_claim", label: "Create claim" },
      { id: "submit_claim", label: "Submit claim" },
      { id: "post_payment", label: "Post payment" },
      { id: "void_claim", label: "Void claim" },
      { id: "issue_refund", label: "Issue refund" },
      { id: "run_billing_reports", label: "Run billing reports" },
    ],
  },
  {
    id: "documents",
    label: "Documents",
    permissions: [
      { id: "upload_doc", label: "Upload documents" },
      { id: "download_doc", label: "Download documents" },
      { id: "delete_doc", label: "Delete documents" },
      { id: "sign_doc", label: "Sign documents" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    permissions: [
      { id: "manage_users", label: "Manage users" },
      { id: "manage_roles", label: "Manage roles" },
      { id: "configure_system", label: "Configure system" },
    ],
  },
  {
    id: "nursing",
    label: "Nursing",
    permissions: [
      { id: "nursing_view", label: "View nursing assessments" },
      { id: "nursing_create", label: "Create assessment manually" },
      { id: "nursing_import", label: "Import patient request" },
      { id: "nursing_edit", label: "Edit draft assessments" },
      { id: "nursing_sign", label: "Sign assessments" },
      { id: "nursing_delete", label: "Delete requests/assessments" },
      { id: "nursing_review", label: "Perform annual review" },
      { id: "nursing_change_status", label: "Change request status" },
    ],
  },
]

type PermissionMap = Record<string, boolean>

interface Role {
  id: string
  name: string
  isDefault: boolean
  userCount: number
  permissions: PermissionMap
}

const makePerms = (ids: string[]): PermissionMap =>
  Object.fromEntries(
    PERMISSION_CATEGORIES.flatMap((c) =>
      c.permissions.map((p) => [p.id, ids.includes(p.id)])
    )
  )

const INITIAL_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    isDefault: true,
    userCount: 1,
    permissions: makePerms(
      PERMISSION_CATEGORIES.flatMap((c) => c.permissions.map((p) => p.id))
    ),
  },
  {
    id: "receptionist",
    name: "Receptionist",
    isDefault: true,
    userCount: 3,
    permissions: makePerms([
      "view_own_schedule",
      "view_all_schedule",
      "create_appointment",
      "edit_appointment",
      "reschedule",
      "cancel_appointment",
      "view_patient",
      "upload_doc",
      "download_doc",
    ]),
  },
  {
    id: "billing",
    name: "Billing Specialist",
    isDefault: true,
    userCount: 2,
    permissions: makePerms([
      "view_patient",
      "view_claim",
      "create_claim",
      "submit_claim",
      "post_payment",
      "void_claim",
      "issue_refund",
      "run_billing_reports",
      "upload_doc",
      "download_doc",
    ]),
  },
  {
    id: "clinician",
    name: "Clinician",
    isDefault: true,
    userCount: 4,
    permissions: makePerms([
      "view_own_schedule",
      "view_patient",
      "upload_doc",
      "download_doc",
      "sign_doc",
    ]),
  },
  {
    id: "nurse",
    name: "Nurse/MA",
    isDefault: true,
    userCount: 2,
    permissions: makePerms([
      "view_own_schedule",
      "view_patient",
      "upload_doc",
      "download_doc",
      "nursing_view",
      "nursing_create",
      "nursing_import",
      "nursing_edit",
      "nursing_sign",
      "nursing_change_status",
    ]),
  },
  {
    id: "auditor",
    name: "Auditor",
    isDefault: true,
    userCount: 1,
    permissions: makePerms(["run_billing_reports"]),
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
  const [selectedId, setSelectedId] = useState<string>("admin")
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")

  const selectedRole = roles.find((r) => r.id === selectedId)

  const togglePermission = (permId: string, value: boolean) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === selectedId
          ? { ...r, permissions: { ...r.permissions, [permId]: value } }
          : r
      )
    )
  }

  const cloneRole = () => {
    if (!selectedRole) return
    const cloned: Role = {
      ...selectedRole,
      id: `custom-${Date.now()}`,
      name: `${selectedRole.name} (Copy)`,
      isDefault: false,
      userCount: 0,
      permissions: { ...selectedRole.permissions },
    }
    setRoles((prev) => [...prev, cloned])
    setSelectedId(cloned.id)
  }

  const createRole = () => {
    if (!newRoleName.trim()) return
    const role: Role = {
      id: `custom-${Date.now()}`,
      name: newRoleName.trim(),
      isDefault: false,
      userCount: 0,
      permissions: makePerms([]),
    }
    setRoles((prev) => [...prev, role])
    setSelectedId(role.id)
    setNewRoleName("")
    setNewRoleDialogOpen(false)
  }

  const deleteRole = () => {
    if (!deleteTarget) return
    setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id))
    setSelectedId(roles.find((r) => r.id !== deleteTarget.id)?.id ?? "")
    setDeleteTarget(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Define what each role can access in the system
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Role list */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Roles</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNewRoleDialogOpen(true)}
              >
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" /> New Role
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-125">
              <div className="flex flex-col gap-0.5 px-3 pb-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedId(role.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted ${selectedId === role.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground"}`}
                  >
                    <span>{role.name}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {role.userCount}
                      </Badge>
                      {role.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Permission editor */}
        {selectedRole ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedRole.name}</CardTitle>
                  <CardDescription>
                    {selectedRole.userCount} user(s) assigned to this role
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cloneRole}>
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Clone
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      selectedRole.isDefault || selectedRole.userCount > 0
                    }
                    onClick={() => setDeleteTarget(selectedRole)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                  <Button size="sm">Save Permissions</Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <Accordion
                type="multiple"
                defaultValue={["appointments", "patient_records"]}
                className="w-full"
              >
                {PERMISSION_CATEGORIES.filter(
                  (cat) => cat.id !== "admin" || selectedRole.name === "Admin"
                ).map((cat) => (
                  <AccordionItem key={cat.id} value={cat.id}>
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {cat.label}
                        <Badge variant="secondary" className="text-xs">
                          {
                            cat.permissions.filter(
                              (p) => selectedRole.permissions[p.id]
                            ).length
                          }
                          /{cat.permissions.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 pb-2 md:grid-cols-3">
                        {cat.permissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              id={`${selectedId}-${perm.id}`}
                              checked={!!selectedRole.permissions[perm.id]}
                              onCheckedChange={(c) =>
                                togglePermission(perm.id, !!c)
                              }
                            />
                            <Label
                              htmlFor={`${selectedId}-${perm.id}`}
                              className="text-sm font-normal"
                            >
                              {perm.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex items-center justify-center text-muted-foreground">
            <p>Select a role to edit permissions</p>
          </Card>
        )}
      </div>

      {/* New Role Dialog */}
      <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Role</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Label htmlFor="new-role-name">Role Name</Label>
            <Input
              id="new-role-name"
              placeholder="e.g. Junior Biller"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createRole()}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={createRole} disabled={!newRoleName.trim()}>
              Create Role
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
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Delete <strong>{deleteTarget?.name}</strong>? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteRole}
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
