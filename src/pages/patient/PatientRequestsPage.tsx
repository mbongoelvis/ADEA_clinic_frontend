import { useState } from "react"
import { usePatientRequests } from "@/contexts/PatientRequestsContext"
import type {
  PatientRequest,
  RequestStatus,
} from "@/contexts/PatientRequestsContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react"

const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string
    variant: "default" | "secondary" | "destructive" | "outline"
    icon: typeof Circle
    message: string
  }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
    message: "Your request is waiting for a nurse to review it.",
  },
  in_review: {
    label: "In Review",
    variant: "default",
    icon: Circle,
    message:
      "A nurse is reviewing your information and may contact you if needed.",
  },
  completed: {
    label: "Completed",
    variant: "outline",
    icon: CheckCircle2,
    message: "Your assessment is complete. You can view a summary below.",
  },
  action_needed: {
    label: "Action Needed",
    variant: "destructive",
    icon: AlertTriangle,
    message: "Please provide additional information (see message).",
  },
}

export default function PatientRequestsPage() {
  const { requests } = usePatientRequests()
  const [selectedRequest, setSelectedRequest] = useState<PatientRequest | null>(
    null
  )

  if (selectedRequest) {
    return (
      <RequestDetailView
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Requests</h1>
        <p className="text-muted-foreground">
          Track the status of your nursing assessment intake requests
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              You haven't submitted any requests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>
              {requests.length} total request{requests.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => {
                  const config = STATUS_CONFIG[req.status]
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(req.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {req.intakeData.chiefComplaint}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(req.lastUpdatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(req)}
                        >
                          View Summary
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RequestDetailView({
  request,
  onBack,
}: {
  request: PatientRequest
  onBack: () => void
}) {
  const config = STATUS_CONFIG[request.status]
  const StatusIcon = config.icon

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to All Requests
      </Button>

      {/* Status Banner */}
      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <StatusIcon className="h-6 w-6 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Status:</h2>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {config.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nurse's Message */}
      {request.nurseMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Nurse's Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{request.nurseMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Completed Summary */}
      {request.status === "completed" && request.completedSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assessment Summary</CardTitle>
            <CardDescription>
              Summary of the completed nursing assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">
              {request.completedSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {request.statusHistory.map((entry, i) => {
              const entryConfig = STATUS_CONFIG[entry.status]
              const EntryIcon = entryConfig.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <EntryIcon className="h-5 w-5 text-primary" />
                    {i < request.statusHistory.length - 1 && (
                      <div className="mt-1 h-6 w-px bg-border" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{entryConfig.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Submitted Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What You Submitted</CardTitle>
          <CardDescription>
            Read-only view of your intake form data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Section title="Demographics">
            <Field label="Full Name" value={request.intakeData.fullName} />
            <Field
              label="Date of Birth"
              value={request.intakeData.dateOfBirth}
            />
            <Field label="Gender" value={request.intakeData.gender} />
            <Field label="Phone" value={request.intakeData.phone} />
            <Field label="Address" value={request.intakeData.address} />
            <Field
              label="Emergency Contact"
              value={`${request.intakeData.emergencyContactName} (${request.intakeData.emergencyContactRelation}) – ${request.intakeData.emergencyContactPhone}`}
            />
          </Section>

          <Separator />

          <Section title="Medical History">
            <Field
              label="Chief Complaint"
              value={request.intakeData.chiefComplaint}
            />
            <Field
              label="Current Medications"
              value={request.intakeData.currentMedications}
            />
            <Field label="Allergies" value={request.intakeData.allergies} />
            <Field
              label="Past Medical History"
              value={request.intakeData.pastMedicalHistory}
            />
            <Field
              label="Past Surgical History"
              value={request.intakeData.pastSurgicalHistory}
            />
            <Field
              label="Family History"
              value={request.intakeData.familyHistory}
            />
          </Section>

          <Separator />

          <Section title="Lifestyle">
            <Field label="Smoking" value={request.intakeData.smokingStatus} />
            <Field label="Alcohol" value={request.intakeData.alcoholUse} />
            <Field
              label="Exercise"
              value={request.intakeData.exerciseFrequency}
            />
            <Field label="Diet" value={request.intakeData.diet} />
          </Section>

          <Separator />

          <Section title="Mental Health">
            <Field label="Mood" value={request.intakeData.moodDescription} />
            <Field
              label="Sleep Quality"
              value={request.intakeData.sleepQuality}
            />
            <Field
              label="Stress Level"
              value={request.intakeData.stressLevel}
            />
          </Section>

          <Separator />

          <Section title="Functional Status">
            <Field label="Mobility" value={request.intakeData.mobilityLevel} />
            <Field
              label="ADL Independence"
              value={request.intakeData.adlIndependence}
            />
            <Field label="Fall Risk" value={request.intakeData.fallRisk} />
          </Section>

          {request.intakeData.painPresent && (
            <>
              <Separator />
              <Section title="Pain Assessment">
                <Field
                  label="Location"
                  value={request.intakeData.painLocation}
                />
                <Field
                  label="Intensity"
                  value={`${request.intakeData.painIntensity}/10`}
                />
                <Field
                  label="Description"
                  value={request.intakeData.painDescription}
                />
              </Section>
            </>
          )}

          {request.intakeData.additionalNotes && (
            <>
              <Separator />
              <Section title="Additional Notes">
                <p className="text-sm">{request.intakeData.additionalNotes}</p>
              </Section>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}
