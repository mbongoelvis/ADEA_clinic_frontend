import { useState } from "react"
import { HardDrive, Merge, RefreshCw, Search, Trash2 } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const MOCK_DUPLICATES = [
  {
    id: "a1",
    name: "John Smith",
    dob: "1975-04-12",
    phone: "555-1234",
    email: "jsmith@email.com",
    records: 14,
  },
  {
    id: "a2",
    name: "Jon Smith",
    dob: "1975-04-12",
    phone: "555-1234",
    email: "jonsmith@email.com",
    records: 3,
  },
  {
    id: "b1",
    name: "Maria Garcia",
    dob: "1983-09-30",
    phone: "555-5678",
    email: "mgarcia@email.com",
    records: 22,
  },
  {
    id: "b2",
    name: "Maria E. Garcia",
    dob: "1983-09-30",
    phone: "555-5679",
    email: "m.garcia@email.com",
    records: 1,
  },
]

export default function DataMaintenancePage() {
  const [backupDialog, setBackupDialog] = useState(false)
  const [purgeDialog, setPurgeDialog] = useState(false)
  const [mergeSelected, setMergeSelected] = useState<Set<string>>(new Set())
  const [mergeConfirmOpen, setMergeConfirmOpen] = useState(false)
  const [purgeOption, setPurgeOption] = useState("anonymize")
  const [adminPassword, setAdminPassword] = useState("")

  const toggleMerge = (id: string) => {
    const s = new Set(mergeSelected)
    s.has(id) ? s.delete(id) : s.add(id)
    setMergeSelected(s)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Data Maintenance</h1>
        <p className="text-sm text-muted-foreground">
          Backup, merge, purge, and system cleanup tools
        </p>
      </div>

      {/* Backup */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>
                Automated daily backups with 30-day cloud retention
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Last Backup</p>
              <p className="text-sm text-muted-foreground">
                May 25, 2026 at 03:00 AM —{" "}
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Success
                </Badge>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBackupDialog(true)}>
                <HardDrive className="mr-2 h-4 w-4" /> Run Manual Backup
              </Button>
              <Button variant="outline">Restore from Backup</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merge Duplicates */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Merge className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Merge Duplicate Patients</CardTitle>
              <CardDescription>
                Find and merge duplicate patient records into a single master
                record
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Name</Label>
              <Input placeholder="Search by name…" className="w-48" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" className="w-36" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Phone</Label>
              <Input placeholder="555-0000" className="w-36" />
            </div>
            <div className="flex items-end">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Find Duplicates
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Records</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DUPLICATES.map((p) => (
                <TableRow
                  key={p.id}
                  className={mergeSelected.has(p.id) ? "bg-muted/40" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={mergeSelected.has(p.id)}
                      onCheckedChange={() => toggleMerge(p.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.dob}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.records}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center gap-3">
            <Button
              disabled={mergeSelected.size < 2}
              onClick={() => setMergeConfirmOpen(true)}
            >
              <Merge className="mr-2 h-4 w-4" /> Merge Selected (
              {mergeSelected.size})
            </Button>
            {mergeSelected.size < 2 && (
              <p className="text-xs text-muted-foreground">
                Select at least 2 records to merge
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Purge Old Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Purge Old Data</CardTitle>
              <CardDescription>
                Anonymize or permanently delete inactive patient records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>No activity since</Label>
              <Input type="date" className="w-36" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Action</Label>
              <Select value={purgeOption} onValueChange={setPurgeOption}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anonymize">
                    Anonymize (replace PII)
                  </SelectItem>
                  <SelectItem value="delete">Delete permanently</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="mb-3 text-sm font-medium text-destructive">
              Requires second admin approval
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="admin-pw">Admin Password</Label>
              <Input
                id="admin-pw"
                type="password"
                placeholder="Enter your admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="max-w-72"
              />
            </div>
          </div>
          <Button
            variant="destructive"
            disabled={!adminPassword}
            onClick={() => setPurgeDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />{" "}
            {purgeOption === "anonymize" ? "Anonymize" : "Delete"} Records
          </Button>
        </CardContent>
      </Card>

      {/* System Cleanup */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>System Cleanup</CardTitle>
              <CardDescription>
                Maintenance tasks to improve performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Temporary Files</p>
              <p className="text-xs text-muted-foreground">
                Cached exports and session temp files · Est. 240 MB
              </p>
            </div>
            <Button variant="outline" size="sm">
              Clear Temp Files
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Rebuild Database Indexes</p>
              <p className="text-xs text-muted-foreground">
                Optimize query performance — may take a few minutes
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rebuild Indexes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup confirmation */}
      <AlertDialog open={backupDialog} onOpenChange={setBackupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run Manual Backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a full system backup immediately. The process may
              take a few minutes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setBackupDialog(false)}>
              Start Backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge confirmation */}
      <AlertDialog open={mergeConfirmOpen} onOpenChange={setMergeConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Merge {mergeSelected.size} Records?
            </AlertDialogTitle>
            <AlertDialogDescription>
              All appointments, claims, and documents from the selected records
              will be moved into the master record. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setMergeSelected(new Set())
                setMergeConfirmOpen(false)
              }}
            >
              Confirm Merge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purge confirmation */}
      <AlertDialog open={purgeDialog} onOpenChange={setPurgeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm{" "}
              {purgeOption === "anonymize"
                ? "Anonymization"
                : "Permanent Deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {purgeOption === "anonymize"
                ? "Patient names and personally identifiable information will be replaced with placeholders. This cannot be undone."
                : "Selected patient records will be permanently deleted from the system. This action is irreversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setAdminPassword("")
                setPurgeDialog(false)
              }}
            >
              Confirm {purgeOption === "anonymize" ? "Anonymize" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
