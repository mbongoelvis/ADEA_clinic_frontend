import type { ClinicalData } from "@/contexts/NursingContext"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Props {
  data: ClinicalData
  signedBy?: string | null
  signedAt?: string | null
}

function Field({ label, value }: { label: string; value: string | boolean }) {
  if (value === "" || value === false) return null
  if (typeof value === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {label}:
        </span>
        <Badge variant="secondary">Yes</Badge>
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

export default function ClinicalSection({ data, signedBy, signedAt }: Props) {
  return (
    <div className="space-y-2">
      <Accordion
        type="multiple"
        defaultValue={["vitals", "physical", "cognitive", "plan"]}
      >
        {/* Vital Signs */}
        <AccordionItem value="vitals">
          <AccordionTrigger className="text-sm font-semibold">
            Vital Signs
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Field label="Blood Pressure" value={data.bloodPressure} />
              <Field label="Pulse" value={data.pulse} />
              <Field label="Temperature" value={data.temperature} />
              <Field label="Respiratory Rate" value={data.respiratoryRate} />
              <Field label="O2 Saturation" value={data.oxygenSaturation} />
              <Field label="Pain Level" value={data.painLevel} />
              <Field label="Weight (lbs)" value={data.weight} />
              <Field label="Height (in)" value={data.height} />
              <Field label="BMI" value={data.bmi} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Labs Review */}
        <AccordionItem value="labs">
          <AccordionTrigger className="text-sm font-semibold">
            Labs Review
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Field label="Labs Reviewed" value={data.labsReviewed} />
              <Field label="Lab Notes" value={data.labNotes} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fall Risk */}
        <AccordionItem value="fallrisk">
          <AccordionTrigger className="text-sm font-semibold">
            Fall Risk Assessment
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Fall Risk Score" value={data.fallRiskScore} />
              <Field label="Fall Risk Level" value={data.fallRiskLevel} />
              <Field label="Fall Precautions" value={data.fallPrecautions} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Physical ROS */}
        <AccordionItem value="physical">
          <AccordionTrigger className="text-sm font-semibold">
            Physical Examination (Objective)
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="General Appearance"
                value={data.generalAppearance}
              />
              <Field label="Pupils" value={data.pupils} />
              <Field label="Skin Condition" value={data.skinCondition} />
              <Field label="Edema" value={data.edema} />
              <Field label="Breath Sounds" value={data.breathSounds} />
              <Field label="Heart Sounds" value={data.heartSounds} />
              <Field label="Abdomen" value={data.abdomen} />
              <Field label="Extremities" value={data.extremities} />
              <Field label="Neurological Findings" value={data.neuroFindings} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* AIMS */}
        <AccordionItem value="aims">
          <AccordionTrigger className="text-sm font-semibold">
            AIMS Assessment
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="AIMS Score" value={data.aimsScore} />
              <Field label="AIMS Notes" value={data.aimsNotes} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Cognitive & Mental Status */}
        <AccordionItem value="cognitive">
          <AccordionTrigger className="text-sm font-semibold">
            Cognitive & Mental Status
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Orientation" value={data.orientation} />
              <Field label="Memory" value={data.memory} />
              <Field label="Attention" value={data.attention} />
              <Field label="Thought Content" value={data.thoughtContent} />
              <Field label="Thought Process" value={data.thoughtProcess} />
              <Field label="Perceptions" value={data.perceptions} />
              <Field label="Judgment" value={data.judgment} />
              <Field label="Insight" value={data.insight} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Behaviors & Communication */}
        <AccordionItem value="behaviors">
          <AccordionTrigger className="text-sm font-semibold">
            Behaviors & Communication
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Behavior" value={data.behavior} />
              <Field label="Affect" value={data.affect} />
              <Field label="Speech" value={data.speech} />
              <Field label="Eye Contact" value={data.eyeContact} />
              <Field label="Cooperation" value={data.cooperation} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Implementation Assessment */}
        <AccordionItem value="implementation">
          <AccordionTrigger className="text-sm font-semibold">
            Implementation Assessment
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field
                label="Decision-Making Assessment"
                value={data.decisionMakingAssessment}
              />
              <Field label="Stability Rating" value={data.stabilityRating} />
              <Field label="Stability Notes" value={data.stabilityNotes} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Knowledge & Demonstrations */}
        <AccordionItem value="knowledge">
          <AccordionTrigger className="text-sm font-semibold">
            Knowledge & Demonstrations
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field
                label="Medication Knowledge"
                value={data.medicationKnowledge}
              />
              <Field label="Self-Care Ability" value={data.selfCareAbility} />
              <Field label="Teaching Needs" value={data.teachingNeeds} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Medication Delegation */}
        <AccordionItem value="delegation">
          <AccordionTrigger className="text-sm font-semibold">
            Medication Delegation
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field
                label="Delegation Decision"
                value={data.medicationDelegationDecision}
              />
              <Field
                label="Delegation Instructions"
                value={data.delegationInstructions}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Nursing Service Plan */}
        <AccordionItem value="plan">
          <AccordionTrigger className="text-sm font-semibold">
            Nursing Service Plan
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <Field label="Nursing Diagnoses" value={data.nursingDiagnoses} />
              <Field label="Strategies" value={data.strategies} />
              <Field label="Goals" value={data.goals} />
              <Field label="Planned Units" value={data.plannedUnits} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Signatures & Review */}
        <AccordionItem value="signatures">
          <AccordionTrigger className="text-sm font-semibold">
            Signatures & Review
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Next Review Date" value={data.nextReviewDate} />
                <Field
                  label="Review Period"
                  value={
                    data.reviewPeriodMonths
                      ? `${data.reviewPeriodMonths} months`
                      : ""
                  }
                />
                <Field
                  label="Supervisor Review"
                  value={data.supervisorReview}
                />
              </div>
              {signedBy && (
                <>
                  <Separator />
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm font-medium">Signed by: {signedBy}</p>
                    {signedAt && (
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(signedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Additional Notes */}
        {data.additionalClinicalNotes && (
          <AccordionItem value="clinicalnotes">
            <AccordionTrigger className="text-sm font-semibold">
              Additional Clinical Notes
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm whitespace-pre-wrap">
                {data.additionalClinicalNotes}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
