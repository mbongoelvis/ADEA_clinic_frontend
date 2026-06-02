import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { PatientIntakeData, ClinicalData } from "@/contexts/NursingContext"
import { EMPTY_INTAKE, EMPTY_CLINICAL } from "@/contexts/NursingContext"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save, FileSignature } from "lucide-react"

// ─── Validation Schema ───────────────────────────────────────────────────────

const assessmentSchema = z.object({
  // Patient Intake fields
  fullName: z.string().min(1, "Patient name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  race: z.string().optional(),
  maritalStatus: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  chiefComplaint: z.string().min(1, "Chief complaint is required"),
  pastMedicalHistory: z.string().optional(),
  pastSurgicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),
  rosConstitutional: z.string().optional(),
  rosCardiovascular: z.string().optional(),
  rosRespiratory: z.string().optional(),
  rosGastrointestinal: z.string().optional(),
  rosGenitourinary: z.string().optional(),
  rosMusculoskeletal: z.string().optional(),
  rosNeurological: z.string().optional(),
  rosPsychiatric: z.string().optional(),
  rosSkin: z.string().optional(),
  dietType: z.string().optional(),
  appetiteLevel: z.string().optional(),
  recentWeightChange: z.string().optional(),
  sleepQuality: z.string().optional(),
  sleepHoursPerNight: z.string().optional(),
  exerciseFrequency: z.string().optional(),
  mobilityLevel: z.string().optional(),
  smokingStatus: z.string().optional(),
  alcoholUse: z.string().optional(),
  substanceUse: z.string().optional(),
  livingArrangement: z.string().optional(),
  occupation: z.string().optional(),
  socialSupport: z.string().optional(),
  spiritualBeliefs: z.string().optional(),
  copingSkills: z.string().optional(),
  selfReportedMood: z.string().optional(),
  stressLevel: z.string().optional(),
  primaryLanguage: z.string().optional(),
  communicationPreferences: z.string().optional(),
  decisionMakingCapacity: z.string().optional(),
  advanceDirectives: z.string().optional(),
  suicidalIdeation: z.boolean().optional(),
  homicidalIdeation: z.boolean().optional(),
  fallRiskSelfReport: z.string().optional(),
  safetyNotes: z.string().optional(),
  additionalNotes: z.string().optional(),
  // Clinical fields
  bloodPressure: z.string().optional(),
  pulse: z.string().optional(),
  temperature: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  painLevel: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  bmi: z.string().optional(),
  labsReviewed: z.boolean().optional(),
  labNotes: z.string().optional(),
  fallRiskScore: z.string().optional(),
  fallRiskLevel: z.string().optional(),
  fallPrecautions: z.string().optional(),
  generalAppearance: z.string().optional(),
  pupils: z.string().optional(),
  skinCondition: z.string().optional(),
  edema: z.string().optional(),
  breathSounds: z.string().optional(),
  heartSounds: z.string().optional(),
  abdomen: z.string().optional(),
  extremities: z.string().optional(),
  neuroFindings: z.string().optional(),
  aimsScore: z.string().optional(),
  aimsNotes: z.string().optional(),
  orientation: z.string().optional(),
  memory: z.string().optional(),
  attention: z.string().optional(),
  thoughtContent: z.string().optional(),
  thoughtProcess: z.string().optional(),
  perceptions: z.string().optional(),
  judgment: z.string().optional(),
  insight: z.string().optional(),
  behavior: z.string().optional(),
  affect: z.string().optional(),
  speech: z.string().optional(),
  eyeContact: z.string().optional(),
  cooperation: z.string().optional(),
  decisionMakingAssessment: z.string().optional(),
  stabilityRating: z.string().optional(),
  stabilityNotes: z.string().optional(),
  medicationKnowledge: z.string().optional(),
  selfCareAbility: z.string().optional(),
  teachingNeeds: z.string().optional(),
  medicationDelegationDecision: z.string().optional(),
  delegationInstructions: z.string().optional(),
  nursingDiagnoses: z.string().optional(),
  strategies: z.string().optional(),
  goals: z.string().optional(),
  plannedUnits: z.string().optional(),
  nextReviewDate: z.string().optional(),
  reviewPeriodMonths: z.string().optional(),
  supervisorReview: z.string().optional(),
  additionalClinicalNotes: z.string().optional(),
})

type AssessmentFormValues = z.infer<typeof assessmentSchema>

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  defaultIntake?: Partial<PatientIntakeData>
  defaultClinical?: Partial<ClinicalData>
  readOnlyIntake?: boolean
  onSaveDraft: (intake: PatientIntakeData, clinical: ClinicalData) => void
  onSign: (intake: PatientIntakeData, clinical: ClinicalData) => void
  onCancel: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AssessmentForm({
  defaultIntake,
  defaultClinical,
  readOnlyIntake = false,
  onSaveDraft,
  onSign,
  onCancel,
}: Props) {
  const defaults: AssessmentFormValues = {
    ...EMPTY_INTAKE,
    ...EMPTY_CLINICAL,
    ...defaultIntake,
    ...defaultClinical,
    suicidalIdeation: defaultIntake?.suicidalIdeation ?? false,
    homicidalIdeation: defaultIntake?.homicidalIdeation ?? false,
    labsReviewed: defaultClinical?.labsReviewed ?? false,
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: defaults,
  })

  const suicidalIdeation = watch("suicidalIdeation")
  const homicidalIdeation = watch("homicidalIdeation")
  const labsReviewed = watch("labsReviewed")

  const extractData = (values: AssessmentFormValues) => {
    const intake: PatientIntakeData = {
      fullName: values.fullName ?? "",
      dateOfBirth: values.dateOfBirth ?? "",
      gender: values.gender ?? "",
      race: values.race ?? "",
      maritalStatus: values.maritalStatus ?? "",
      address: values.address ?? "",
      phone: values.phone ?? "",
      emergencyContactName: values.emergencyContactName ?? "",
      emergencyContactPhone: values.emergencyContactPhone ?? "",
      emergencyContactRelation: values.emergencyContactRelation ?? "",
      chiefComplaint: values.chiefComplaint ?? "",
      pastMedicalHistory: values.pastMedicalHistory ?? "",
      pastSurgicalHistory: values.pastSurgicalHistory ?? "",
      familyHistory: values.familyHistory ?? "",
      currentMedications: values.currentMedications ?? "",
      allergies: values.allergies ?? "",
      rosConstitutional: values.rosConstitutional ?? "",
      rosCardiovascular: values.rosCardiovascular ?? "",
      rosRespiratory: values.rosRespiratory ?? "",
      rosGastrointestinal: values.rosGastrointestinal ?? "",
      rosGenitourinary: values.rosGenitourinary ?? "",
      rosMusculoskeletal: values.rosMusculoskeletal ?? "",
      rosNeurological: values.rosNeurological ?? "",
      rosPsychiatric: values.rosPsychiatric ?? "",
      rosSkin: values.rosSkin ?? "",
      dietType: values.dietType ?? "",
      appetiteLevel: values.appetiteLevel ?? "",
      recentWeightChange: values.recentWeightChange ?? "",
      sleepQuality: values.sleepQuality ?? "",
      sleepHoursPerNight: values.sleepHoursPerNight ?? "",
      exerciseFrequency: values.exerciseFrequency ?? "",
      mobilityLevel: values.mobilityLevel ?? "",
      smokingStatus: values.smokingStatus ?? "",
      alcoholUse: values.alcoholUse ?? "",
      substanceUse: values.substanceUse ?? "",
      livingArrangement: values.livingArrangement ?? "",
      occupation: values.occupation ?? "",
      socialSupport: values.socialSupport ?? "",
      spiritualBeliefs: values.spiritualBeliefs ?? "",
      copingSkills: values.copingSkills ?? "",
      selfReportedMood: values.selfReportedMood ?? "",
      stressLevel: values.stressLevel ?? "",
      primaryLanguage: values.primaryLanguage ?? "",
      communicationPreferences: values.communicationPreferences ?? "",
      decisionMakingCapacity: values.decisionMakingCapacity ?? "",
      advanceDirectives: values.advanceDirectives ?? "",
      suicidalIdeation: values.suicidalIdeation ?? false,
      homicidalIdeation: values.homicidalIdeation ?? false,
      fallRiskSelfReport: values.fallRiskSelfReport ?? "",
      safetyNotes: values.safetyNotes ?? "",
      additionalNotes: values.additionalNotes ?? "",
    }

    const clinical: ClinicalData = {
      bloodPressure: values.bloodPressure ?? "",
      pulse: values.pulse ?? "",
      temperature: values.temperature ?? "",
      respiratoryRate: values.respiratoryRate ?? "",
      oxygenSaturation: values.oxygenSaturation ?? "",
      painLevel: values.painLevel ?? "",
      weight: values.weight ?? "",
      height: values.height ?? "",
      bmi: values.bmi ?? "",
      labsReviewed: values.labsReviewed ?? false,
      labNotes: values.labNotes ?? "",
      fallRiskScore: values.fallRiskScore ?? "",
      fallRiskLevel: values.fallRiskLevel ?? "",
      fallPrecautions: values.fallPrecautions ?? "",
      generalAppearance: values.generalAppearance ?? "",
      pupils: values.pupils ?? "",
      skinCondition: values.skinCondition ?? "",
      edema: values.edema ?? "",
      breathSounds: values.breathSounds ?? "",
      heartSounds: values.heartSounds ?? "",
      abdomen: values.abdomen ?? "",
      extremities: values.extremities ?? "",
      neuroFindings: values.neuroFindings ?? "",
      aimsScore: values.aimsScore ?? "",
      aimsNotes: values.aimsNotes ?? "",
      orientation: values.orientation ?? "",
      memory: values.memory ?? "",
      attention: values.attention ?? "",
      thoughtContent: values.thoughtContent ?? "",
      thoughtProcess: values.thoughtProcess ?? "",
      perceptions: values.perceptions ?? "",
      judgment: values.judgment ?? "",
      insight: values.insight ?? "",
      behavior: values.behavior ?? "",
      affect: values.affect ?? "",
      speech: values.speech ?? "",
      eyeContact: values.eyeContact ?? "",
      cooperation: values.cooperation ?? "",
      decisionMakingAssessment: values.decisionMakingAssessment ?? "",
      stabilityRating: values.stabilityRating ?? "",
      stabilityNotes: values.stabilityNotes ?? "",
      medicationKnowledge: values.medicationKnowledge ?? "",
      selfCareAbility: values.selfCareAbility ?? "",
      teachingNeeds: values.teachingNeeds ?? "",
      medicationDelegationDecision: values.medicationDelegationDecision ?? "",
      delegationInstructions: values.delegationInstructions ?? "",
      nursingDiagnoses: values.nursingDiagnoses ?? "",
      strategies: values.strategies ?? "",
      goals: values.goals ?? "",
      plannedUnits: values.plannedUnits ?? "",
      rnSignature: "",
      signedDate: "",
      nextReviewDate: values.nextReviewDate ?? "",
      reviewPeriodMonths: values.reviewPeriodMonths ?? "12",
      supervisorReview: values.supervisorReview ?? "",
      additionalClinicalNotes: values.additionalClinicalNotes ?? "",
    }

    return { intake, clinical }
  }

  const handleSave = handleSubmit((values) => {
    const { intake, clinical } = extractData(values)
    onSaveDraft(intake, clinical)
  })

  const handleSignSubmit = handleSubmit((values) => {
    const { intake, clinical } = extractData(values)
    onSign(intake, clinical)
  })

  return (
    <form className="space-y-4">
      {errors.fullName && (
        <p className="text-sm text-destructive">{errors.fullName.message}</p>
      )}
      {errors.chiefComplaint && (
        <p className="text-sm text-destructive">
          {errors.chiefComplaint.message}
        </p>
      )}

      <Tabs defaultValue="patient">
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="patient">Patient Information</TabsTrigger>
          <TabsTrigger value="ros">Review of Systems</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle & Social</TabsTrigger>
          <TabsTrigger value="safety">Safety & Coping</TabsTrigger>
          <TabsTrigger value="vitals">Vitals & Labs</TabsTrigger>
          <TabsTrigger value="physical">Physical Exam</TabsTrigger>
          <TabsTrigger value="mental">Mental Status</TabsTrigger>
          <TabsTrigger value="plan">Nursing Plan</TabsTrigger>
        </TabsList>

        {/* ── Patient Information Tab ── */}
        <TabsContent value="patient" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input {...register("fullName")} disabled={readOnlyIntake} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    {...register("dateOfBirth")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    defaultValue={defaults.gender}
                    onValueChange={(v) => setValue("gender", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Race/Ethnicity</Label>
                  <Input {...register("race")} disabled={readOnlyIntake} />
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    defaultValue={defaults.maritalStatus}
                    onValueChange={(v) => setValue("maritalStatus", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...register("phone")} disabled={readOnlyIntake} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input {...register("address")} disabled={readOnlyIntake} />
              </div>
              <div className="space-y-2">
                <Label>Primary Language</Label>
                <Input
                  {...register("primaryLanguage")}
                  disabled={readOnlyIntake}
                />
              </div>
              <Separator />
              <p className="text-sm font-medium">Emergency Contact</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    {...register("emergencyContactName")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    {...register("emergencyContactPhone")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Input
                    {...register("emergencyContactRelation")}
                    disabled={readOnlyIntake}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Chief Complaint & Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chief Complaint / Reason for Visit *</Label>
                <Textarea
                  {...register("chiefComplaint")}
                  disabled={readOnlyIntake}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Medications</Label>
                <Textarea
                  {...register("currentMedications")}
                  disabled={readOnlyIntake}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Allergies</Label>
                <Input {...register("allergies")} disabled={readOnlyIntake} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Past Medical History</Label>
                  <Textarea
                    {...register("pastMedicalHistory")}
                    disabled={readOnlyIntake}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Past Surgical History</Label>
                  <Textarea
                    {...register("pastSurgicalHistory")}
                    disabled={readOnlyIntake}
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Family History</Label>
                <Textarea
                  {...register("familyHistory")}
                  disabled={readOnlyIntake}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Review of Systems Tab ── */}
        <TabsContent value="ros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Review of Systems (Subjective Symptoms)
              </CardTitle>
              <CardDescription>
                Patient-reported symptoms by system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  field: "rosConstitutional",
                  label: "Constitutional (fever, weight loss, fatigue)",
                },
                {
                  field: "rosCardiovascular",
                  label: "Cardiovascular (chest pain, palpitations)",
                },
                {
                  field: "rosRespiratory",
                  label: "Respiratory (cough, shortness of breath)",
                },
                {
                  field: "rosGastrointestinal",
                  label: "Gastrointestinal (nausea, pain, appetite)",
                },
                {
                  field: "rosGenitourinary",
                  label: "Genitourinary (frequency, pain)",
                },
                {
                  field: "rosMusculoskeletal",
                  label: "Musculoskeletal (joint pain, weakness)",
                },
                {
                  field: "rosNeurological",
                  label: "Neurological (headaches, numbness, dizziness)",
                },
                {
                  field: "rosPsychiatric",
                  label: "Psychiatric (anxiety, depression, sleep issues)",
                },
                { field: "rosSkin", label: "Skin (rashes, lesions, itching)" },
              ].map(({ field, label }) => (
                <div key={field} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    {...register(field as keyof AssessmentFormValues)}
                    disabled={readOnlyIntake}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Lifestyle & Social Tab ── */}
        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Nutrition, Sleep & Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Diet Type</Label>
                  <Input
                    {...register("dietType")}
                    disabled={readOnlyIntake}
                    placeholder="e.g., Regular, Diabetic"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Appetite Level</Label>
                  <Select
                    defaultValue={defaults.appetiteLevel}
                    onValueChange={(v) => setValue("appetiteLevel", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recent Weight Change</Label>
                  <Input
                    {...register("recentWeightChange")}
                    disabled={readOnlyIntake}
                    placeholder="e.g., Lost 5 lbs"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sleep Quality</Label>
                  <Select
                    defaultValue={defaults.sleepQuality}
                    onValueChange={(v) => setValue("sleepQuality", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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
                  <Label>Hours/Night</Label>
                  <Input
                    {...register("sleepHoursPerNight")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Exercise Frequency</Label>
                  <Input
                    {...register("exerciseFrequency")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobility Level</Label>
                  <Input
                    {...register("mobilityLevel")}
                    disabled={readOnlyIntake}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Substance Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Smoking Status</Label>
                  <Select
                    defaultValue={defaults.smokingStatus}
                    onValueChange={(v) => setValue("smokingStatus", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Never">Never</SelectItem>
                      <SelectItem value="Former">Former</SelectItem>
                      <SelectItem value="Current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Alcohol Use</Label>
                  <Input
                    {...register("alcoholUse")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Substance Use</Label>
                  <Input
                    {...register("substanceUse")}
                    disabled={readOnlyIntake}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Social / Home / Work / Spiritual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Living Arrangement</Label>
                  <Input
                    {...register("livingArrangement")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input
                    {...register("occupation")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Social Support</Label>
                  <Input
                    {...register("socialSupport")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spiritual Beliefs</Label>
                  <Input
                    {...register("spiritualBeliefs")}
                    disabled={readOnlyIntake}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Safety & Coping Tab ── */}
        <TabsContent value="safety" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coping & Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Coping Skills</Label>
                  <Input
                    {...register("copingSkills")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Self-Reported Mood</Label>
                  <Input
                    {...register("selfReportedMood")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stress Level</Label>
                  <Select
                    defaultValue={defaults.stressLevel}
                    onValueChange={(v) => setValue("stressLevel", v)}
                    disabled={readOnlyIntake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Communication & Decision Making
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Communication Preferences</Label>
                  <Input
                    {...register("communicationPreferences")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Decision-Making Capacity</Label>
                  <Input
                    {...register("decisionMakingCapacity")}
                    disabled={readOnlyIntake}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Advance Directives</Label>
                  <Input
                    {...register("advanceDirectives")}
                    disabled={readOnlyIntake}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Safety Alerts</CardTitle>
              <CardDescription>Critical safety screening</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="si"
                  checked={suicidalIdeation}
                  onCheckedChange={(v) =>
                    setValue("suicidalIdeation", v === true)
                  }
                  disabled={readOnlyIntake}
                />
                <Label htmlFor="si" className="text-sm">
                  Suicidal Ideation reported
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hi"
                  checked={homicidalIdeation}
                  onCheckedChange={(v) =>
                    setValue("homicidalIdeation", v === true)
                  }
                  disabled={readOnlyIntake}
                />
                <Label htmlFor="hi" className="text-sm">
                  Homicidal Ideation reported
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Fall Risk (Self-Report)</Label>
                <Input
                  {...register("fallRiskSelfReport")}
                  disabled={readOnlyIntake}
                />
              </div>
              <div className="space-y-2">
                <Label>Safety Notes</Label>
                <Textarea
                  {...register("safetyNotes")}
                  disabled={readOnlyIntake}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Vitals & Labs Tab (Clinical) ── */}
        <TabsContent value="vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vital Signs</CardTitle>
              <CardDescription>
                Clinical measurements taken by staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Blood Pressure</Label>
                  <Input {...register("bloodPressure")} placeholder="120/80" />
                </div>
                <div className="space-y-2">
                  <Label>Pulse (bpm)</Label>
                  <Input {...register("pulse")} placeholder="72" />
                </div>
                <div className="space-y-2">
                  <Label>Temperature (°F)</Label>
                  <Input {...register("temperature")} placeholder="98.6" />
                </div>
                <div className="space-y-2">
                  <Label>Respiratory Rate</Label>
                  <Input {...register("respiratoryRate")} placeholder="16" />
                </div>
                <div className="space-y-2">
                  <Label>O2 Saturation (%)</Label>
                  <Input {...register("oxygenSaturation")} placeholder="98" />
                </div>
                <div className="space-y-2">
                  <Label>Pain Level (0-10)</Label>
                  <Input {...register("painLevel")} placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Weight (lbs)</Label>
                  <Input {...register("weight")} />
                </div>
                <div className="space-y-2">
                  <Label>Height (inches)</Label>
                  <Input {...register("height")} />
                </div>
                <div className="space-y-2">
                  <Label>BMI</Label>
                  <Input {...register("bmi")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Labs Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="labs"
                  checked={labsReviewed}
                  onCheckedChange={(v) => setValue("labsReviewed", v === true)}
                />
                <Label htmlFor="labs" className="text-sm">
                  Labs reviewed
                </Label>
              </div>
              <div className="space-y-2">
                <Label>Lab Notes</Label>
                <Textarea
                  {...register("labNotes")}
                  rows={3}
                  placeholder="Document lab findings..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fall Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Fall Risk Score</Label>
                  <Input {...register("fallRiskScore")} placeholder="0-10" />
                </div>
                <div className="space-y-2">
                  <Label>Fall Risk Level</Label>
                  <Select
                    defaultValue={defaults.fallRiskLevel}
                    onValueChange={(v) => setValue("fallRiskLevel", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Precautions</Label>
                  <Input {...register("fallPrecautions")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Physical Exam Tab ── */}
        <TabsContent value="physical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Physical Examination (Objective)
              </CardTitle>
              <CardDescription>
                Clinical findings from physical assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>General Appearance</Label>
                <Textarea {...register("generalAppearance")} rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pupils</Label>
                  <Input {...register("pupils")} placeholder="PERRLA" />
                </div>
                <div className="space-y-2">
                  <Label>Skin Condition</Label>
                  <Input {...register("skinCondition")} />
                </div>
                <div className="space-y-2">
                  <Label>Edema</Label>
                  <Input
                    {...register("edema")}
                    placeholder="None / Location & grade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Breath Sounds</Label>
                  <Input {...register("breathSounds")} />
                </div>
                <div className="space-y-2">
                  <Label>Heart Sounds</Label>
                  <Input {...register("heartSounds")} />
                </div>
                <div className="space-y-2">
                  <Label>Abdomen</Label>
                  <Input {...register("abdomen")} />
                </div>
                <div className="space-y-2">
                  <Label>Extremities</Label>
                  <Input {...register("extremities")} />
                </div>
                <div className="space-y-2">
                  <Label>Neurological Findings</Label>
                  <Input {...register("neuroFindings")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AIMS Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>AIMS Score</Label>
                  <Input {...register("aimsScore")} placeholder="0 or N/A" />
                </div>
                <div className="space-y-2">
                  <Label>AIMS Notes</Label>
                  <Input {...register("aimsNotes")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Mental Status Tab ── */}
        <TabsContent value="mental" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Cognitive & Mental Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <Input
                    {...register("orientation")}
                    placeholder="Person, place, time, situation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Memory</Label>
                  <Input {...register("memory")} />
                </div>
                <div className="space-y-2">
                  <Label>Attention</Label>
                  <Input {...register("attention")} />
                </div>
                <div className="space-y-2">
                  <Label>Thought Content</Label>
                  <Input {...register("thoughtContent")} />
                </div>
                <div className="space-y-2">
                  <Label>Thought Process</Label>
                  <Input {...register("thoughtProcess")} />
                </div>
                <div className="space-y-2">
                  <Label>Perceptions</Label>
                  <Input {...register("perceptions")} />
                </div>
                <div className="space-y-2">
                  <Label>Judgment</Label>
                  <Input {...register("judgment")} />
                </div>
                <div className="space-y-2">
                  <Label>Insight</Label>
                  <Input {...register("insight")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Behaviors & Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Behavior</Label>
                  <Input {...register("behavior")} />
                </div>
                <div className="space-y-2">
                  <Label>Affect</Label>
                  <Input {...register("affect")} />
                </div>
                <div className="space-y-2">
                  <Label>Speech</Label>
                  <Input {...register("speech")} />
                </div>
                <div className="space-y-2">
                  <Label>Eye Contact</Label>
                  <Input {...register("eyeContact")} />
                </div>
                <div className="space-y-2">
                  <Label>Cooperation</Label>
                  <Input {...register("cooperation")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Implementation Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Decision-Making Assessment</Label>
                <Textarea {...register("decisionMakingAssessment")} rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Stability Rating</Label>
                  <Select
                    defaultValue={defaults.stabilityRating}
                    onValueChange={(v) => setValue("stabilityRating", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stable">Stable</SelectItem>
                      <SelectItem value="Improving">Improving</SelectItem>
                      <SelectItem value="Declining">Declining</SelectItem>
                      <SelectItem value="Unstable">Unstable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stability Notes</Label>
                  <Input {...register("stabilityNotes")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Knowledge & Demonstrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Medication Knowledge</Label>
                  <Input {...register("medicationKnowledge")} />
                </div>
                <div className="space-y-2">
                  <Label>Self-Care Ability</Label>
                  <Input {...register("selfCareAbility")} />
                </div>
                <div className="space-y-2">
                  <Label>Teaching Needs</Label>
                  <Input {...register("teachingNeeds")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Nursing Plan Tab ── */}
        <TabsContent value="plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Medication Delegation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Delegation Decision</Label>
                <Select
                  defaultValue={defaults.medicationDelegationDecision}
                  onValueChange={(v) =>
                    setValue("medicationDelegationDecision", v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delegate">Delegate</SelectItem>
                    <SelectItem value="Do not delegate">
                      Do not delegate
                    </SelectItem>
                    <SelectItem value="Continue current regimen">
                      Continue current regimen
                    </SelectItem>
                    <SelectItem value="Refer to MD">
                      Refer to MD for changes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delegation Instructions</Label>
                <Textarea {...register("delegationInstructions")} rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Nursing Service Plan</CardTitle>
              <CardDescription>
                Diagnoses, strategies, goals, and planned service units
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nursing Diagnoses</Label>
                <Textarea {...register("nursingDiagnoses")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Strategies / Interventions</Label>
                <Textarea {...register("strategies")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Goals</Label>
                <Textarea {...register("goals")} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Planned Units</Label>
                <Input
                  {...register("plannedUnits")}
                  placeholder="e.g., 4 visits over 30 days"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Next Review Date</Label>
                  <Input type="date" {...register("nextReviewDate")} />
                </div>
                <div className="space-y-2">
                  <Label>Review Period (months)</Label>
                  <Select
                    defaultValue={defaults.reviewPeriodMonths || "12"}
                    onValueChange={(v) => setValue("reviewPeriodMonths", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Supervisor Review Notes</Label>
                <Input {...register("supervisorReview")} />
              </div>
              <div className="space-y-2">
                <Label>Additional Clinical Notes</Label>
                <Textarea {...register("additionalClinicalNotes")} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Patient Additional Notes</Label>
                <Textarea
                  {...register("additionalNotes")}
                  disabled={readOnlyIntake}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button type="button" onClick={handleSignSubmit}>
            <FileSignature className="mr-2 h-4 w-4" />
            Sign & Complete
          </Button>
        </div>
      </div>
    </form>
  )
}
