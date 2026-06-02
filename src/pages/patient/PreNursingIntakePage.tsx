import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usePatientRequests } from "@/contexts/PatientRequestsContext"
import type { NursingIntakeData } from "@/contexts/PatientRequestsContext"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Save } from "lucide-react"

const EMPTY_FORM: NursingIntakeData = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  phone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  chiefComplaint: "",
  currentMedications: "",
  allergies: "",
  pastMedicalHistory: "",
  pastSurgicalHistory: "",
  familyHistory: "",
  smokingStatus: "",
  alcoholUse: "",
  exerciseFrequency: "",
  diet: "",
  moodDescription: "",
  sleepQuality: "",
  stressLevel: "",
  mobilityLevel: "",
  adlIndependence: "",
  fallRisk: "",
  painPresent: false,
  painLocation: "",
  painIntensity: 0,
  painDescription: "",
  additionalNotes: "",
}

export default function PreNursingIntakePage() {
  const { user } = useAuth()
  const {
    draftData,
    saveDraft,
    submitIntake,
    notificationPrefs,
    updateNotificationPrefs,
  } = usePatientRequests()
  const navigate = useNavigate()

  const [form, setForm] = useState<NursingIntakeData>(() => ({
    ...EMPTY_FORM,
    fullName: user?.name ?? "",
    ...draftData,
  }))

  const [notifyEmail, setNotifyEmail] = useState(notificationPrefs.email)
  const [notifySms, setNotifySms] = useState(notificationPrefs.sms)
  const [draftSaved, setDraftSaved] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const updateField = <K extends keyof NursingIntakeData>(
    field: K,
    value: NursingIntakeData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setDraftSaved(false)
  }

  const handleSaveDraft = () => {
    saveDraft(form)
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 3000)
  }

  const validate = (): string[] => {
    const errs: string[] = []
    if (!form.fullName.trim()) errs.push("Full name is required")
    if (!form.dateOfBirth) errs.push("Date of birth is required")
    if (!form.gender) errs.push("Gender is required")
    if (!form.phone.trim()) errs.push("Phone number is required")
    if (!form.chiefComplaint.trim()) errs.push("Chief complaint is required")
    if (!form.emergencyContactName.trim())
      errs.push("Emergency contact name is required")
    if (!form.emergencyContactPhone.trim())
      errs.push("Emergency contact phone is required")
    return errs
  }

  const handleSubmit = () => {
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setErrors([])
    updateNotificationPrefs({ email: notifyEmail, sms: notifySms })
    submitIntake(form)
    navigate("/patient/requests")
  }

  const handleCancel = () => {
    if (
      JSON.stringify(form) !==
      JSON.stringify({ ...EMPTY_FORM, fullName: user?.name ?? "" })
    ) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        return
      }
    }
    navigate("/patient/dashboard")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">Pre-Nursing Assessment Intake</h1>
        <p className="text-muted-foreground">
          Complete this form to submit your health information for nursing
          review.
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-inside list-disc space-y-1">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {draftSaved && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Draft saved successfully.</AlertDescription>
        </Alert>
      )}

      {/* Section 1: Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics</CardTitle>
          <CardDescription>
            Your personal and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => updateField("gender", v)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>

          <Separator />
          <p className="text-sm font-medium">Emergency Contact</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ecName">Name *</Label>
              <Input
                id="ecName"
                value={form.emergencyContactName}
                onChange={(e) =>
                  updateField("emergencyContactName", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecPhone">Phone *</Label>
              <Input
                id="ecPhone"
                type="tel"
                value={form.emergencyContactPhone}
                onChange={(e) =>
                  updateField("emergencyContactPhone", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecRelation">Relationship</Label>
              <Input
                id="ecRelation"
                value={form.emergencyContactRelation}
                onChange={(e) =>
                  updateField("emergencyContactRelation", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Current health concerns and history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">
              Chief Complaint / Reason for Visit *
            </Label>
            <Textarea
              id="chiefComplaint"
              placeholder="Describe your main health concern..."
              value={form.chiefComplaint}
              onChange={(e) => updateField("chiefComplaint", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentMedications">Current Medications</Label>
            <Textarea
              id="currentMedications"
              placeholder="List all current medications with dosages..."
              value={form.currentMedications}
              onChange={(e) =>
                updateField("currentMedications", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Input
              id="allergies"
              placeholder="e.g., Penicillin, Latex, None"
              value={form.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pastMedical">Past Medical History</Label>
              <Textarea
                id="pastMedical"
                placeholder="Previous diagnoses, chronic conditions..."
                value={form.pastMedicalHistory}
                onChange={(e) =>
                  updateField("pastMedicalHistory", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastSurgical">Past Surgical History</Label>
              <Textarea
                id="pastSurgical"
                placeholder="Previous surgeries with dates..."
                value={form.pastSurgicalHistory}
                onChange={(e) =>
                  updateField("pastSurgicalHistory", e.target.value)
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="familyHistory">Family History</Label>
            <Textarea
              id="familyHistory"
              placeholder="Relevant family medical history..."
              value={form.familyHistory}
              onChange={(e) => updateField("familyHistory", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Lifestyle */}
      <Card>
        <CardHeader>
          <CardTitle>Lifestyle</CardTitle>
          <CardDescription>Habits and daily routines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smoking">Smoking Status</Label>
              <Select
                value={form.smokingStatus}
                onValueChange={(v) => updateField("smokingStatus", v)}
              >
                <SelectTrigger id="smoking">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Former">Former smoker</SelectItem>
                  <SelectItem value="Current">Current smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alcohol">Alcohol Use</Label>
              <Select
                value={form.alcoholUse}
                onValueChange={(v) => updateField("alcoholUse", v)}
              >
                <SelectTrigger id="alcohol">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Social">Social (occasional)</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise Frequency</Label>
              <Select
                value={form.exerciseFrequency}
                onValueChange={(v) => updateField("exerciseFrequency", v)}
              >
                <SelectTrigger id="exercise">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedentary">Sedentary</SelectItem>
                  <SelectItem value="1-2 times/week">1-2 times/week</SelectItem>
                  <SelectItem value="3-4 times/week">3-4 times/week</SelectItem>
                  <SelectItem value="5+ times/week">5+ times/week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diet">Diet</Label>
              <Input
                id="diet"
                placeholder="e.g., Balanced, Vegetarian, Low-sodium"
                value={form.diet}
                onChange={(e) => updateField("diet", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Mental Health */}
      <Card>
        <CardHeader>
          <CardTitle>Mental Health & Wellbeing</CardTitle>
          <CardDescription>
            Your emotional and psychological state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood Description</Label>
              <Select
                value={form.moodDescription}
                onValueChange={(v) => updateField("moodDescription", v)}
              >
                <SelectTrigger id="mood">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Neutral">Neutral</SelectItem>
                  <SelectItem value="Anxious">Anxious</SelectItem>
                  <SelectItem value="Depressed">Depressed</SelectItem>
                  <SelectItem value="Irritable">Irritable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sleep">Sleep Quality</Label>
              <Select
                value={form.sleepQuality}
                onValueChange={(v) => updateField("sleepQuality", v)}
              >
                <SelectTrigger id="sleep">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Insomnia">Insomnia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stress">Stress Level</Label>
              <Select
                value={form.stressLevel}
                onValueChange={(v) => updateField("stressLevel", v)}
              >
                <SelectTrigger id="stress">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Functional Status */}
      <Card>
        <CardHeader>
          <CardTitle>Functional Status</CardTitle>
          <CardDescription>
            Mobility and daily living activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mobility">Mobility Level</Label>
              <Select
                value={form.mobilityLevel}
                onValueChange={(v) => updateField("mobilityLevel", v)}
              >
                <SelectTrigger id="mobility">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Independent">Independent</SelectItem>
                  <SelectItem value="Uses assistive device">
                    Uses assistive device
                  </SelectItem>
                  <SelectItem value="Requires assistance">
                    Requires assistance
                  </SelectItem>
                  <SelectItem value="Wheelchair-bound">
                    Wheelchair-bound
                  </SelectItem>
                  <SelectItem value="Bedbound">Bedbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adl">ADL Independence</Label>
              <Select
                value={form.adlIndependence}
                onValueChange={(v) => updateField("adlIndependence", v)}
              >
                <SelectTrigger id="adl">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fully independent">
                    Fully independent
                  </SelectItem>
                  <SelectItem value="Mostly independent">
                    Mostly independent
                  </SelectItem>
                  <SelectItem value="Needs some help">
                    Needs some help
                  </SelectItem>
                  <SelectItem value="Dependent">Dependent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fall">Fall Risk</Label>
              <Select
                value={form.fallRisk}
                onValueChange={(v) => updateField("fallRisk", v)}
              >
                <SelectTrigger id="fall">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Pain Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Pain Assessment</CardTitle>
          <CardDescription>Current pain status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="painPresent"
              checked={form.painPresent}
              onCheckedChange={(checked) =>
                updateField("painPresent", checked === true)
              }
            />
            <Label htmlFor="painPresent">
              I am currently experiencing pain
            </Label>
          </div>

          {form.painPresent && (
            <div className="space-y-4 pl-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="painLocation">Pain Location</Label>
                  <Input
                    id="painLocation"
                    placeholder="e.g., Lower back, Head"
                    value={form.painLocation}
                    onChange={(e) =>
                      updateField("painLocation", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="painIntensity">
                    Pain Intensity (0-10): {form.painIntensity}
                  </Label>
                  <input
                    id="painIntensity"
                    type="range"
                    min={0}
                    max={10}
                    value={form.painIntensity}
                    onChange={(e) =>
                      updateField("painIntensity", Number(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No pain</span>
                    <span>Worst pain</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="painDesc">Pain Description</Label>
                <Input
                  id="painDesc"
                  placeholder="e.g., Throbbing, Sharp, Dull, Burning"
                  value={form.painDescription}
                  onChange={(e) =>
                    updateField("painDescription", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 7: Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Any other information you'd like to share
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Anything else you'd like the nursing team to know..."
            value={form.additionalNotes}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you'd like to receive updates about this request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send updates to your registered email address
              </p>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send text messages to your mobile phone
              </p>
            </div>
            <Switch checked={notifySms} onCheckedChange={setNotifySms} />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>Submit to Clinic</Button>
        </div>
      </div>
    </div>
  )
}
