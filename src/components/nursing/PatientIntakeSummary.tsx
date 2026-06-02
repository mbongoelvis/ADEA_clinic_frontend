import type { PatientIntakeData } from "@/contexts/NursingContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle } from "lucide-react"

interface Props {
  data: PatientIntakeData
}

function Field({ label, value }: { label: string; value: string | boolean }) {
  if (value === "" || value === false) return null
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}:
        </span>
        <Badge variant="destructive">Yes</Badge>
      </div>
    )
  }
  return (
    <div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <p className="text-sm">{value}</p>
    </div>
  )
}

export default function PatientIntakeSummary({ data }: Props) {
  const hasSafetyAlerts =
    data.suicidalIdeation || data.homicidalIdeation || data.safetyNotes

  return (
    <div className="space-y-2">
      {hasSafetyAlerts && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive bg-destructive/5 p-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div className="text-sm font-medium text-destructive">
            Safety Alert
            {data.suicidalIdeation && " — Suicidal Ideation reported"}
            {data.homicidalIdeation && " — Homicidal Ideation reported"}
          </div>
        </div>
      )}

      <Accordion
        type="multiple"
        defaultValue={["demographics", "complaint", "medical", "medications"]}
      >
        {/* Demographics */}
        <AccordionItem value="demographics">
          <AccordionTrigger className="text-sm font-semibold">
            Demographics
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full Name" value={data.fullName} />
              <Field label="Date of Birth" value={data.dateOfBirth} />
              <Field label="Gender" value={data.gender} />
              <Field label="Race/Ethnicity" value={data.race} />
              <Field label="Marital Status" value={data.maritalStatus} />
              <Field label="Phone" value={data.phone} />
              <Field label="Address" value={data.address} />
              <Field label="Primary Language" value={data.primaryLanguage} />
            </div>
            <Separator className="my-3" />
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Emergency Contact
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Name" value={data.emergencyContactName} />
              <Field label="Phone" value={data.emergencyContactPhone} />
              <Field
                label="Relationship"
                value={data.emergencyContactRelation}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Chief Complaint */}
        <AccordionItem value="complaint">
          <AccordionTrigger className="text-sm font-semibold">
            Chief Complaint
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm">{data.chiefComplaint || "Not provided"}</p>
          </AccordionContent>
        </AccordionItem>

        {/* Medical History */}
        <AccordionItem value="medical">
          <AccordionTrigger className="text-sm font-semibold">
            Medical History
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field
                label="Past Medical History"
                value={data.pastMedicalHistory}
              />
              <Field
                label="Past Surgical History"
                value={data.pastSurgicalHistory}
              />
              <Field label="Family History" value={data.familyHistory} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Medications & Allergies */}
        <AccordionItem value="medications">
          <AccordionTrigger className="text-sm font-semibold">
            Medications & Allergies
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field
                label="Current Medications"
                value={data.currentMedications}
              />
              <Field label="Allergies" value={data.allergies} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Review of Systems */}
        <AccordionItem value="ros">
          <AccordionTrigger className="text-sm font-semibold">
            Review of Systems (Subjective)
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Constitutional" value={data.rosConstitutional} />
              <Field label="Cardiovascular" value={data.rosCardiovascular} />
              <Field label="Respiratory" value={data.rosRespiratory} />
              <Field
                label="Gastrointestinal"
                value={data.rosGastrointestinal}
              />
              <Field label="Genitourinary" value={data.rosGenitourinary} />
              <Field label="Musculoskeletal" value={data.rosMusculoskeletal} />
              <Field label="Neurological" value={data.rosNeurological} />
              <Field label="Psychiatric" value={data.rosPsychiatric} />
              <Field label="Skin" value={data.rosSkin} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Nutritional */}
        <AccordionItem value="nutrition">
          <AccordionTrigger className="text-sm font-semibold">
            Nutrition & Diet
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Diet Type" value={data.dietType} />
              <Field label="Appetite Level" value={data.appetiteLevel} />
              <Field
                label="Recent Weight Change"
                value={data.recentWeightChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sleep & Activity */}
        <AccordionItem value="sleep">
          <AccordionTrigger className="text-sm font-semibold">
            Sleep & Activity
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Sleep Quality" value={data.sleepQuality} />
              <Field label="Hours/Night" value={data.sleepHoursPerNight} />
              <Field
                label="Exercise Frequency"
                value={data.exerciseFrequency}
              />
              <Field label="Mobility Level" value={data.mobilityLevel} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Substance Use */}
        <AccordionItem value="substance">
          <AccordionTrigger className="text-sm font-semibold">
            Substance Use
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Smoking Status" value={data.smokingStatus} />
              <Field label="Alcohol Use" value={data.alcoholUse} />
              <Field label="Substance Use" value={data.substanceUse} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Social / Home / Work */}
        <AccordionItem value="social">
          <AccordionTrigger className="text-sm font-semibold">
            Social / Home / Work / Spiritual
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Living Arrangement"
                value={data.livingArrangement}
              />
              <Field label="Occupation" value={data.occupation} />
              <Field label="Social Support" value={data.socialSupport} />
              <Field label="Spiritual Beliefs" value={data.spiritualBeliefs} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Coping & Mood */}
        <AccordionItem value="coping">
          <AccordionTrigger className="text-sm font-semibold">
            Coping & Mood
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Coping Skills" value={data.copingSkills} />
              <Field label="Self-Reported Mood" value={data.selfReportedMood} />
              <Field label="Stress Level" value={data.stressLevel} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Communication & Decision Making */}
        <AccordionItem value="communication">
          <AccordionTrigger className="text-sm font-semibold">
            Communication & Decision Making
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Communication Preferences"
                value={data.communicationPreferences}
              />
              <Field
                label="Decision-Making Capacity"
                value={data.decisionMakingCapacity}
              />
              <Field
                label="Advance Directives"
                value={data.advanceDirectives}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Safety */}
        <AccordionItem value="safety">
          <AccordionTrigger className="text-sm font-semibold">
            Safety Alerts
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Field label="Suicidal Ideation" value={data.suicidalIdeation} />
              <Field
                label="Homicidal Ideation"
                value={data.homicidalIdeation}
              />
              <Field
                label="Fall Risk (Self-Report)"
                value={data.fallRiskSelfReport}
              />
              <Field label="Safety Notes" value={data.safetyNotes} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Additional Notes */}
        {data.additionalNotes && (
          <AccordionItem value="additional">
            <AccordionTrigger className="text-sm font-semibold">
              Additional Notes
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{data.additionalNotes}</p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
