import { useState } from "react"
import { useNursing } from "@/contexts/NursingContext"
import type {
  NursingEntry,
  NursingRequest,
  NursingAssessment,
  AssessmentStatus,
  PatientIntakeData,
  ClinicalData,
} from "@/contexts/NursingContext"
import PatientIntakeSummary from "@/components/nursing/PatientIntakeSummary"
import ClinicalSection from "@/components/nursing/ClinicalSection"
import AssessmentForm from "@/components/nursing/AssessmentForm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
import {
  ClipboardList,
  FileSignature,
  Import,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

const STATUS_CONFIG: Record<
  AssessmentStatus,
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

const CURRENT_RN = "Sarah Nurse"

export default function NursingAssessmentsPage() {
  const {
    entries,
    importRequest,
    updateAssessment,
    signAssessment,
    changeRequestStatus,
    createManualAssessment,
    deleteEntry,
  } = useNursing()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rnFilter, setRnFilter] = useState<string>("all")

  // Dialogs / views
  const [newAssessmentOpen, setNewAssessmentOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<NursingAssessment | null>(null)
  const [viewEntry, setViewEntry] = useState<NursingEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<NursingEntry | null>(null)
  const [statusChangeTarget, setStatusChangeTarget] =
    useState<NursingRequest | null>(null)
  const [statusChangeValue, setStatusChangeValue] =
    useState<AssessmentStatus>("pending")
  const [statusChangeMessage, setStatusChangeMessage] = useState("")

  // New assessment form
  const [newPatientName, setNewPatientName] = useState("")
  const [newPatientMrn, setNewPatientMrn] = useState("")

  const filterEntries = (list: NursingEntry[]) => {
    return list.filter((e) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          e.patientName.toLowerCase().includes(q) ||
          e.patientMrn.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (statusFilter !== "all" && e.status !== statusFilter) return false
      if (rnFilter !== "all") {
        const rn = e.assignedRn
        if (rn !== rnFilter) return false
      }
      return true
    })
  }

  const allFiltered = filterEntries(entries)
  const pendingRequests = filterEntries(
    entries.filter((e) => e.type === "request" && e.status === "pending")
  )
  const myDrafts = filterEntries(
    entries.filter(
      (e) =>
        e.type === "assessment" &&
        (e as NursingAssessment).isDraft &&
        e.assignedRn === CURRENT_RN
    )
  )
  const signed = filterEntries(
    entries.filter(
      (e) => e.type === "assessment" && (e as NursingAssessment).isSigned
    )
  )

  const handleImport = (requestId: string) => {
    const result = importRequest(requestId, CURRENT_RN)
    if (result) {
      setEditEntry(result)
    }
  }

  const handleSign = (id: string) => {
    signAssessment(id, `${CURRENT_RN}, RN`)
  }

  const handleCreateNew = () => {
    if (!newPatientName.trim() || !newPatientMrn.trim()) return
    const assessment = createManualAssessment(
      { fullName: newPatientName },
      {},
      CURRENT_RN
    )
    setNewAssessmentOpen(false)
    setNewPatientName("")
    setNewPatientMrn("")
    setEditEntry(assessment)
  }

  const handleStatusChange = () => {
    if (statusChangeTarget) {
      changeRequestStatus(
        statusChangeTarget.id,
        statusChangeValue,
        statusChangeMessage
      )
      setStatusChangeTarget(null)
      setStatusChangeMessage("")
    }
  }

  const handleSaveDraft = (
    intake: PatientIntakeData,
    clinical: ClinicalData
  ) => {
    if (!editEntry) return
    updateAssessment(editEntry.id, {
      intakeData: intake,
      clinicalData: clinical,
      isDraft: true,
      status: "in_review",
    })
    setEditEntry(null)
  }

  const handleSignFromForm = (
    intake: PatientIntakeData,
    clinical: ClinicalData
  ) => {
    if (!editEntry) return
    updateAssessment(editEntry.id, {
      intakeData: intake,
      clinicalData: {
        ...clinical,
        rnSignature: `${CURRENT_RN}, RN`,
        signedDate: new Date().toISOString(),
      },
    })
    signAssessment(editEntry.id, `${CURRENT_RN}, RN`)
    setEditEntry(null)
  }

  const uniqueRns = Array.from(
    new Set(entries.map((e) => e.assignedRn).filter(Boolean))
  ) as string[]

  // ─── Full-page edit mode ────────────────────────────────────────────────────
  if (editEntry) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Edit Assessment – {editEntry.patientName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {editEntry.patientMrn} | Source: {editEntry.source} | Assigned:{" "}
            {editEntry.assignedRn}
          </p>
        </div>
        <AssessmentForm
          defaultIntake={editEntry.intakeData}
          defaultClinical={editEntry.clinicalData}
          readOnlyIntake={editEntry.source === "request"}
          onSaveDraft={handleSaveDraft}
          onSign={handleSignFromForm}
          onCancel={() => setEditEntry(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nursing Assessments</h1>
          <p className="text-sm text-muted-foreground">
            Manage patient intake requests and nursing assessments
          </p>
        </div>
        <Button onClick={() => setNewAssessmentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Assessment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patient name, MRN, or ID..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="action_needed">Action Needed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={rnFilter} onValueChange={setRnFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Assigned RN" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All RNs</SelectItem>
              {uniqueRns.map((rn) => (
                <SelectItem key={rn} value={rn}>
                  {rn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({allFiltered.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            My Drafts ({myDrafts.length})
          </TabsTrigger>
          <TabsTrigger value="signed">Signed ({signed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <EntryTable
            entries={allFiltered}
            onView={setViewEntry}
            onImport={handleImport}
            onEdit={(e) => setEditEntry(e as NursingAssessment)}
            onSign={handleSign}
            onDelete={setDeleteTarget}
            onChangeStatus={(e) => {
              setStatusChangeTarget(e as NursingRequest)
              setStatusChangeValue(e.status)
            }}
          />
        </TabsContent>
        <TabsContent value="pending">
          <EntryTable
            entries={pendingRequests}
            onView={setViewEntry}
            onImport={handleImport}
            onEdit={(e) => setEditEntry(e as NursingAssessment)}
            onSign={handleSign}
            onDelete={setDeleteTarget}
            onChangeStatus={(e) => {
              setStatusChangeTarget(e as NursingRequest)
              setStatusChangeValue(e.status)
            }}
          />
        </TabsContent>
        <TabsContent value="drafts">
          <EntryTable
            entries={myDrafts}
            onView={setViewEntry}
            onImport={handleImport}
            onEdit={(e) => setEditEntry(e as NursingAssessment)}
            onSign={handleSign}
            onDelete={setDeleteTarget}
            onChangeStatus={(e) => {
              setStatusChangeTarget(e as NursingRequest)
              setStatusChangeValue(e.status)
            }}
          />
        </TabsContent>
        <TabsContent value="signed">
          <EntryTable
            entries={signed}
            onView={setViewEntry}
            onImport={handleImport}
            onEdit={(e) => setEditEntry(e as NursingAssessment)}
            onSign={handleSign}
            onDelete={setDeleteTarget}
            onChangeStatus={(e) => {
              setStatusChangeTarget(e as NursingRequest)
              setStatusChangeValue(e.status)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* New Assessment Dialog */}
      <Dialog open={newAssessmentOpen} onOpenChange={setNewAssessmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Patient MRN</Label>
              <Input
                value={newPatientMrn}
                onChange={(e) => setNewPatientMrn(e.target.value)}
                placeholder="MRN-XXXXX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewAssessmentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNew}
              disabled={!newPatientName.trim() || !newPatientMrn.trim()}
            >
              Create & Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Entry Dialog */}
      {viewEntry && (
        <ViewEntryDialog entry={viewEntry} onClose={() => setViewEntry(null)} />
      )}

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteTarget?.type}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) deleteEntry(deleteTarget.id)
                setDeleteTarget(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Dialog */}
      <Dialog
        open={!!statusChangeTarget}
        onOpenChange={() => setStatusChangeTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Request Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={statusChangeValue}
                onValueChange={(v) =>
                  setStatusChangeValue(v as AssessmentStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="action_needed">Action Needed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message to Patient (optional)</Label>
              <Textarea
                value={statusChangeMessage}
                onChange={(e) => setStatusChangeMessage(e.target.value)}
                placeholder="e.g., Please provide your discharge summary..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusChangeTarget(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Entry Table ──────────────────────────────────────────────────────────────

function EntryTable({
  entries,
  onView,
  onImport,
  onEdit,
  onSign,
  onDelete,
  onChangeStatus,
}: {
  entries: NursingEntry[]
  onView: (e: NursingEntry) => void
  onImport: (id: string) => void
  onEdit: (e: NursingEntry) => void
  onSign: (id: string) => void
  onDelete: (e: NursingEntry) => void
  onChangeStatus: (e: NursingEntry) => void
}) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No entries found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned RN</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const config = STATUS_CONFIG[entry.status]
              const isRequest = entry.type === "request"
              const isAssessment = entry.type === "assessment"
              const isDraft =
                isAssessment && (entry as NursingAssessment).isDraft
              const isSigned =
                isAssessment && (entry as NursingAssessment).isSigned
              const canImport = isRequest && entry.status === "pending"
              const canSign = isDraft && !isSigned

              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Badge variant={isRequest ? "secondary" : "default"}>
                      {isRequest ? "Request" : "Assessment"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.patientName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.patientMrn}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(
                      isRequest
                        ? (entry as NursingRequest).submittedAt
                        : (entry as NursingAssessment).createdAt
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </TableCell>
                  <TableCell>{entry.assignedRn ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(entry.lastUpdatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="View"
                        onClick={() => onView(entry)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      {canImport && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Import to Assessment"
                          onClick={() => onImport(entry.id)}
                        >
                          <Import className="h-4 w-4" />
                        </Button>
                      )}
                      {isDraft && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit"
                          onClick={() => onEdit(entry)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canSign && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Sign"
                          onClick={() => onSign(entry.id)}
                        >
                          <FileSignature className="h-4 w-4" />
                        </Button>
                      )}
                      {isRequest && entry.status !== "completed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Change Status"
                          onClick={() => onChangeStatus(entry)}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => onDelete(entry)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// ─── View Entry Dialog ────────────────────────────────────────────────────────

function ViewEntryDialog({
  entry,
  onClose,
}: {
  entry: NursingEntry
  onClose: () => void
}) {
  const isRequest = entry.type === "request"
  const request = isRequest ? (entry as NursingRequest) : null
  const assessment = !isRequest ? (entry as NursingAssessment) : null

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isRequest ? "Request Details" : "Assessment Details"} –{" "}
            {entry.patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Patient:
              </span>{" "}
              {entry.patientName}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">MRN:</span>{" "}
              {entry.patientMrn}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>{" "}
              <Badge variant={STATUS_CONFIG[entry.status].variant}>
                {STATUS_CONFIG[entry.status].label}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">
                Assigned RN:
              </span>{" "}
              {entry.assignedRn ?? "Unassigned"}
            </div>
          </div>

          <Separator />

          {/* Patient Intake Section */}
          {request && (
            <>
              <h3 className="text-sm font-semibold">
                Patient-Submitted Intake
              </h3>
              <PatientIntakeSummary data={request.intakeData} />
              {request.nurseNotes && (
                <div>
                  <h3 className="mt-3 text-sm font-semibold">Nurse Notes</h3>
                  <p className="text-sm">{request.nurseNotes}</p>
                </div>
              )}
            </>
          )}

          {assessment && (
            <>
              <h3 className="text-sm font-semibold">Patient Intake Data</h3>
              <PatientIntakeSummary data={assessment.intakeData} />
              <Separator />
              <h3 className="text-sm font-semibold">Clinical Assessment</h3>
              <ClinicalSection
                data={assessment.clinicalData}
                signedBy={assessment.signedBy}
                signedAt={assessment.signedAt}
              />
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
