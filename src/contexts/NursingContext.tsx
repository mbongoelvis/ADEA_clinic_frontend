import { createContext, useContext, useState, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssessmentStatus =
  | "pending"
  | "in_review"
  | "completed"
  | "action_needed"

export type EntryType = "request" | "assessment"
export type AssessmentSource = "request" | "manual"

// Patient-entered intake data (from self-report form)
export interface PatientIntakeData {
  // Demographics
  fullName: string
  dateOfBirth: string
  gender: string
  race: string
  maritalStatus: string
  address: string
  phone: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  // Chief Complaint
  chiefComplaint: string
  // Medical History
  pastMedicalHistory: string
  pastSurgicalHistory: string
  familyHistory: string
  // Medications & Allergies
  currentMedications: string
  allergies: string
  // Review of Systems (subjective)
  rosConstitutional: string
  rosCardiovascular: string
  rosRespiratory: string
  rosGastrointestinal: string
  rosGenitourinary: string
  rosMusculoskeletal: string
  rosNeurological: string
  rosPsychiatric: string
  rosSkin: string
  // Nutritional
  dietType: string
  appetiteLevel: string
  recentWeightChange: string
  // Sleep & Activity
  sleepQuality: string
  sleepHoursPerNight: string
  exerciseFrequency: string
  mobilityLevel: string
  // Substance Use
  smokingStatus: string
  alcoholUse: string
  substanceUse: string
  // Social / Home / Work / Spiritual
  livingArrangement: string
  occupation: string
  socialSupport: string
  spiritualBeliefs: string
  // Coping & Mood
  copingSkills: string
  selfReportedMood: string
  stressLevel: string
  // Communication & Decision Making
  primaryLanguage: string
  communicationPreferences: string
  decisionMakingCapacity: string
  advanceDirectives: string
  // Safety Alerts
  suicidalIdeation: boolean
  homicidalIdeation: boolean
  fallRiskSelfReport: string
  safetyNotes: string
  // Additional
  additionalNotes: string
}

// Clinical data (RN-entered)
export interface ClinicalData {
  // Vital Signs
  bloodPressure: string
  pulse: string
  temperature: string
  respiratoryRate: string
  oxygenSaturation: string
  painLevel: string
  weight: string
  height: string
  bmi: string
  // Labs Review
  labsReviewed: boolean
  labNotes: string
  // Fall Risk Assessment
  fallRiskScore: string
  fallRiskLevel: string
  fallPrecautions: string
  // Physical Review of Systems (objective)
  generalAppearance: string
  pupils: string
  skinCondition: string
  edema: string
  breathSounds: string
  heartSounds: string
  abdomen: string
  extremities: string
  neuroFindings: string
  // AIMS Assessment
  aimsScore: string
  aimsNotes: string
  // Cognitive & Mental Status
  orientation: string
  memory: string
  attention: string
  thoughtContent: string
  thoughtProcess: string
  perceptions: string
  judgment: string
  insight: string
  // Behaviors & Communication
  behavior: string
  affect: string
  speech: string
  eyeContact: string
  cooperation: string
  // Implementation Assessment
  decisionMakingAssessment: string
  stabilityRating: string
  stabilityNotes: string
  // Knowledge & Demonstrations
  medicationKnowledge: string
  selfCareAbility: string
  teachingNeeds: string
  // Medication Delegation
  medicationDelegationDecision: string
  delegationInstructions: string
  // Nursing Service Plan
  nursingDiagnoses: string
  strategies: string
  goals: string
  plannedUnits: string
  // Signatures & Review
  rnSignature: string
  signedDate: string
  nextReviewDate: string
  reviewPeriodMonths: string
  supervisorReview: string
  additionalClinicalNotes: string
}

export interface StatusHistoryEntry {
  status: AssessmentStatus
  timestamp: string
  changedBy: string
  note?: string
}

export interface NursingRequest {
  id: string
  type: "request"
  patientId: string
  patientName: string
  patientMrn: string
  submittedAt: string
  status: AssessmentStatus
  assignedRn: string | null
  lastUpdatedAt: string
  intakeData: PatientIntakeData
  nurseNotes: string
  linkedAssessmentId: string | null
  statusHistory: StatusHistoryEntry[]
}

export interface NursingAssessment {
  id: string
  type: "assessment"
  source: AssessmentSource
  patientId: string
  patientName: string
  patientMrn: string
  createdAt: string
  status: AssessmentStatus
  assignedRn: string
  lastUpdatedAt: string
  sourceRequestId: string | null
  isDraft: boolean
  isSigned: boolean
  signedAt: string | null
  signedBy: string | null
  intakeData: PatientIntakeData
  clinicalData: ClinicalData
  statusHistory: StatusHistoryEntry[]
}

export type NursingEntry = NursingRequest | NursingAssessment

interface NursingContextType {
  entries: NursingEntry[]
  importRequest: (requestId: string, rnName: string) => NursingAssessment | null
  updateAssessment: (id: string, data: Partial<NursingAssessment>) => void
  signAssessment: (id: string, rnName: string) => void
  changeRequestStatus: (
    id: string,
    status: AssessmentStatus,
    message?: string
  ) => void
  createManualAssessment: (
    data: Partial<PatientIntakeData> & { fullName: string },
    clinicalData: Partial<ClinicalData>,
    rnName: string
  ) => NursingAssessment
  deleteEntry: (id: string) => void
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const EMPTY_INTAKE: PatientIntakeData = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  race: "",
  maritalStatus: "",
  address: "",
  phone: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  chiefComplaint: "",
  pastMedicalHistory: "",
  pastSurgicalHistory: "",
  familyHistory: "",
  currentMedications: "",
  allergies: "",
  rosConstitutional: "",
  rosCardiovascular: "",
  rosRespiratory: "",
  rosGastrointestinal: "",
  rosGenitourinary: "",
  rosMusculoskeletal: "",
  rosNeurological: "",
  rosPsychiatric: "",
  rosSkin: "",
  dietType: "",
  appetiteLevel: "",
  recentWeightChange: "",
  sleepQuality: "",
  sleepHoursPerNight: "",
  exerciseFrequency: "",
  mobilityLevel: "",
  smokingStatus: "",
  alcoholUse: "",
  substanceUse: "",
  livingArrangement: "",
  occupation: "",
  socialSupport: "",
  spiritualBeliefs: "",
  copingSkills: "",
  selfReportedMood: "",
  stressLevel: "",
  primaryLanguage: "",
  communicationPreferences: "",
  decisionMakingCapacity: "",
  advanceDirectives: "",
  suicidalIdeation: false,
  homicidalIdeation: false,
  fallRiskSelfReport: "",
  safetyNotes: "",
  additionalNotes: "",
}

export const EMPTY_CLINICAL: ClinicalData = {
  bloodPressure: "",
  pulse: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  painLevel: "",
  weight: "",
  height: "",
  bmi: "",
  labsReviewed: false,
  labNotes: "",
  fallRiskScore: "",
  fallRiskLevel: "",
  fallPrecautions: "",
  generalAppearance: "",
  pupils: "",
  skinCondition: "",
  edema: "",
  breathSounds: "",
  heartSounds: "",
  abdomen: "",
  extremities: "",
  neuroFindings: "",
  aimsScore: "",
  aimsNotes: "",
  orientation: "",
  memory: "",
  attention: "",
  thoughtContent: "",
  thoughtProcess: "",
  perceptions: "",
  judgment: "",
  insight: "",
  behavior: "",
  affect: "",
  speech: "",
  eyeContact: "",
  cooperation: "",
  decisionMakingAssessment: "",
  stabilityRating: "",
  stabilityNotes: "",
  medicationKnowledge: "",
  selfCareAbility: "",
  teachingNeeds: "",
  medicationDelegationDecision: "",
  delegationInstructions: "",
  nursingDiagnoses: "",
  strategies: "",
  goals: "",
  plannedUnits: "",
  rnSignature: "",
  signedDate: "",
  nextReviewDate: "",
  reviewPeriodMonths: "12",
  supervisorReview: "",
  additionalClinicalNotes: "",
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_ENTRIES: NursingEntry[] = [
  {
    id: "nr-001",
    type: "request",
    patientId: "patient-1",
    patientName: "John Patient",
    patientMrn: "MRN-10045",
    submittedAt: "2026-05-20T10:30:00Z",
    status: "completed",
    assignedRn: "Sarah Nurse",
    lastUpdatedAt: "2026-05-22T14:00:00Z",
    intakeData: {
      ...EMPTY_INTAKE,
      fullName: "John Patient",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      race: "Caucasian",
      maritalStatus: "Married",
      address: "123 Main St, Springfield, IL 62701",
      phone: "(555) 123-4567",
      emergencyContactName: "Jane Patient",
      emergencyContactPhone: "(555) 987-6543",
      emergencyContactRelation: "Spouse",
      chiefComplaint: "Persistent headaches for the past two weeks",
      pastMedicalHistory: "Hypertension (diagnosed 2020)",
      pastSurgicalHistory: "Appendectomy (2010)",
      familyHistory: "Father: Type 2 Diabetes; Mother: Breast cancer",
      currentMedications: "Ibuprofen 400mg PRN",
      allergies: "Penicillin",
      rosConstitutional: "Fatigue, occasional dizziness",
      rosNeurological: "Headaches – frontal/temporal, throbbing",
      sleepQuality: "Fair – occasional insomnia",
      sleepHoursPerNight: "5-6",
      smokingStatus: "Never",
      alcoholUse: "Social (1-2 drinks/week)",
      selfReportedMood: "Generally positive but stressed",
      stressLevel: "Moderate",
      primaryLanguage: "English",
    },
    nurseNotes: "Patient assessed. Tension headache diagnosis confirmed.",
    linkedAssessmentId: "na-001",
    statusHistory: [
      {
        status: "pending",
        timestamp: "2026-05-20T10:30:00Z",
        changedBy: "System",
      },
      {
        status: "in_review",
        timestamp: "2026-05-21T09:00:00Z",
        changedBy: "Sarah Nurse",
      },
      {
        status: "completed",
        timestamp: "2026-05-22T14:00:00Z",
        changedBy: "Sarah Nurse",
      },
    ],
  },
  {
    id: "na-001",
    type: "assessment",
    source: "request",
    patientId: "patient-1",
    patientName: "John Patient",
    patientMrn: "MRN-10045",
    createdAt: "2026-05-21T09:00:00Z",
    status: "completed",
    assignedRn: "Sarah Nurse",
    lastUpdatedAt: "2026-05-22T14:00:00Z",
    sourceRequestId: "nr-001",
    isDraft: false,
    isSigned: true,
    signedAt: "2026-05-22T14:00:00Z",
    signedBy: "Sarah Nurse, RN",
    intakeData: {
      ...EMPTY_INTAKE,
      fullName: "John Patient",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      race: "Caucasian",
      maritalStatus: "Married",
      address: "123 Main St, Springfield, IL 62701",
      phone: "(555) 123-4567",
      emergencyContactName: "Jane Patient",
      emergencyContactPhone: "(555) 987-6543",
      emergencyContactRelation: "Spouse",
      chiefComplaint: "Persistent headaches for the past two weeks",
      pastMedicalHistory: "Hypertension (diagnosed 2020)",
      pastSurgicalHistory: "Appendectomy (2010)",
      familyHistory: "Father: Type 2 Diabetes; Mother: Breast cancer",
      currentMedications: "Ibuprofen 400mg PRN",
      allergies: "Penicillin",
      rosConstitutional: "Fatigue, occasional dizziness",
      rosNeurological: "Headaches – frontal/temporal, throbbing",
      sleepQuality: "Fair – occasional insomnia",
      sleepHoursPerNight: "5-6",
      smokingStatus: "Never",
      alcoholUse: "Social (1-2 drinks/week)",
      selfReportedMood: "Generally positive but stressed",
      stressLevel: "Moderate",
      primaryLanguage: "English",
    },
    clinicalData: {
      ...EMPTY_CLINICAL,
      bloodPressure: "128/82",
      pulse: "76",
      temperature: "98.6",
      respiratoryRate: "16",
      oxygenSaturation: "98%",
      painLevel: "6/10",
      weight: "180",
      height: "70",
      bmi: "25.8",
      labsReviewed: true,
      labNotes: "CBC within normal limits. No anemia.",
      fallRiskScore: "2",
      fallRiskLevel: "Low",
      generalAppearance: "Alert and oriented x4. No acute distress.",
      pupils: "PERRLA",
      skinCondition: "Warm, dry, intact",
      breathSounds: "Clear bilaterally",
      heartSounds: "Regular rate and rhythm, no murmurs",
      neuroFindings: "CN II-XII intact. DTRs 2+ bilaterally.",
      orientation: "Person, place, time, situation",
      memory: "Intact – immediate, recent, and remote",
      thoughtContent: "Appropriate, goal-directed",
      behavior: "Cooperative, pleasant",
      affect: "Congruent with mood",
      speech: "Clear, normal rate and volume",
      nursingDiagnoses: "Chronic pain related to tension headaches",
      goals: "Reduce pain intensity to 3/10 within 4 weeks",
      strategies:
        "Medication review, stress management referral, headache diary",
      medicationDelegationDecision: "Continue current regimen",
      delegationInstructions:
        "Ibuprofen 400mg PRN (max 3x/day). Consider Sumatriptan referral to MD.",
      nextReviewDate: "2026-06-05",
      reviewPeriodMonths: "3",
      additionalClinicalNotes:
        "Patient educated on headache diary. Follow-up scheduled.",
    },
    statusHistory: [
      {
        status: "in_review",
        timestamp: "2026-05-21T09:00:00Z",
        changedBy: "Sarah Nurse",
      },
      {
        status: "completed",
        timestamp: "2026-05-22T14:00:00Z",
        changedBy: "Sarah Nurse",
      },
    ],
  },
  {
    id: "nr-003",
    type: "request",
    patientId: "patient-2",
    patientName: "Maria Garcia",
    patientMrn: "MRN-10078",
    submittedAt: "2026-05-28T07:00:00Z",
    status: "pending",
    assignedRn: null,
    lastUpdatedAt: "2026-05-28T07:00:00Z",
    intakeData: {
      ...EMPTY_INTAKE,
      fullName: "Maria Garcia",
      dateOfBirth: "1972-08-21",
      gender: "Female",
      race: "Hispanic",
      maritalStatus: "Divorced",
      address: "456 Oak Ave, Springfield, IL 62702",
      phone: "(555) 234-5678",
      emergencyContactName: "Carlos Garcia",
      emergencyContactPhone: "(555) 876-5432",
      emergencyContactRelation: "Son",
      chiefComplaint: "Annual wellness check – diabetes management",
      pastMedicalHistory: "Type 2 Diabetes (2015), Hyperlipidemia (2018)",
      currentMedications: "Metformin 500mg BID, Atorvastatin 20mg daily",
      allergies: "Sulfa drugs",
      dietType: "Diabetic diet – low carb",
      exerciseFrequency: "Walking 3x/week",
      smokingStatus: "Former (quit 2019)",
      alcoholUse: "None",
      selfReportedMood: "Good",
      primaryLanguage: "Spanish",
      communicationPreferences:
        "Prefers Spanish interpreter for clinical discussions",
    },
    nurseNotes: "",
    linkedAssessmentId: null,
    statusHistory: [
      {
        status: "pending",
        timestamp: "2026-05-28T07:00:00Z",
        changedBy: "System",
      },
    ],
  },
  {
    id: "nr-004",
    type: "request",
    patientId: "patient-3",
    patientName: "Robert Wilson",
    patientMrn: "MRN-10112",
    submittedAt: "2026-05-27T15:30:00Z",
    status: "action_needed",
    assignedRn: "Sarah Nurse",
    lastUpdatedAt: "2026-05-28T09:00:00Z",
    intakeData: {
      ...EMPTY_INTAKE,
      fullName: "Robert Wilson",
      dateOfBirth: "1958-11-02",
      gender: "Male",
      race: "African American",
      maritalStatus: "Widowed",
      address: "789 Elm Blvd, Springfield, IL 62703",
      phone: "(555) 345-6789",
      emergencyContactName: "Lisa Wilson",
      emergencyContactPhone: "(555) 765-4321",
      emergencyContactRelation: "Daughter",
      chiefComplaint: "Medication reconciliation after hospital discharge",
      pastMedicalHistory: "CHF, COPD, Afib, CKD Stage 3",
      pastSurgicalHistory: "CABG (2022), Knee replacement (2019)",
      currentMedications: "Multiple – see discharge summary",
      allergies: "None known",
      mobilityLevel: "Uses walker",
      fallRiskSelfReport: "I have fallen twice in the past 6 months",
      livingArrangement: "Lives alone, daughter checks in daily",
      primaryLanguage: "English",
    },
    nurseNotes:
      "Please provide the discharge summary document and updated medication list.",
    linkedAssessmentId: null,
    statusHistory: [
      {
        status: "pending",
        timestamp: "2026-05-27T15:30:00Z",
        changedBy: "System",
      },
      {
        status: "action_needed",
        timestamp: "2026-05-28T09:00:00Z",
        changedBy: "Sarah Nurse",
        note: "Need discharge summary",
      },
    ],
  },
  {
    id: "na-005",
    type: "assessment",
    source: "manual",
    patientId: "patient-4",
    patientName: "Emily Chen",
    patientMrn: "MRN-10203",
    createdAt: "2026-05-25T14:00:00Z",
    status: "in_review",
    assignedRn: "Sarah Nurse",
    lastUpdatedAt: "2026-05-26T10:30:00Z",
    sourceRequestId: null,
    isDraft: true,
    isSigned: false,
    signedAt: null,
    signedBy: null,
    intakeData: {
      ...EMPTY_INTAKE,
      fullName: "Emily Chen",
      dateOfBirth: "1995-06-12",
      gender: "Female",
      race: "Asian",
      maritalStatus: "Single",
      address: "321 Pine St, Apt 4B, Springfield, IL 62704",
      phone: "(555) 456-7890",
      emergencyContactName: "Wei Chen",
      emergencyContactPhone: "(555) 654-3210",
      emergencyContactRelation: "Mother",
      chiefComplaint: "Anxiety and panic attacks increasing in frequency",
      pastMedicalHistory: "Generalized Anxiety Disorder, GERD",
      currentMedications: "Sertraline 50mg daily, Omeprazole 20mg daily",
      allergies: "Shellfish (anaphylaxis)",
      rosPsychiatric: "Anxiety, panic attacks 3-4x/week, racing thoughts",
      sleepQuality: "Poor – difficulty falling asleep",
      sleepHoursPerNight: "4-5",
      selfReportedMood: "Anxious, overwhelmed",
      stressLevel: "High",
      copingSkills: "Deep breathing, journaling (inconsistent)",
      primaryLanguage: "English",
    },
    clinicalData: {
      ...EMPTY_CLINICAL,
      bloodPressure: "118/74",
      pulse: "88",
      temperature: "98.2",
      respiratoryRate: "20",
      oxygenSaturation: "99%",
      painLevel: "2/10",
      weight: "125",
      height: "64",
      bmi: "21.5",
      generalAppearance: "Appears anxious, fidgeting, appropriate dress",
      orientation: "Person, place, time, situation",
      affect: "Anxious, tearful at times",
      behavior: "Cooperative but restless",
      speech: "Rapid rate, normal volume",
      nursingDiagnoses:
        "Anxiety related to work stressors and life transitions",
      goals: "Reduce panic attacks to ≤1/week within 6 weeks",
    },
    statusHistory: [
      {
        status: "in_review",
        timestamp: "2026-05-25T14:00:00Z",
        changedBy: "Sarah Nurse",
      },
    ],
  },
]

const ENTRIES_KEY = "clinic_ims_nursing_entries_v2"

// ─── Context ─────────────────────────────────────────────────────────────────

const NursingContext = createContext<NursingContextType | null>(null)

export function NursingProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<NursingEntry[]>(() => {
    try {
      const stored = localStorage.getItem(ENTRIES_KEY)
      return stored ? JSON.parse(stored) : MOCK_ENTRIES
    } catch {
      return MOCK_ENTRIES
    }
  })

  const persist = (updated: NursingEntry[]) => {
    setEntries(updated)
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(updated))
  }

  const importRequest = (
    requestId: string,
    rnName: string
  ): NursingAssessment | null => {
    const request = entries.find(
      (e) => e.id === requestId && e.type === "request"
    ) as NursingRequest | undefined
    if (!request) return null

    const now = new Date().toISOString()
    const assessmentId = `na-${Date.now()}`

    const assessment: NursingAssessment = {
      id: assessmentId,
      type: "assessment",
      source: "request",
      patientId: request.patientId,
      patientName: request.patientName,
      patientMrn: request.patientMrn,
      createdAt: now,
      status: "in_review",
      assignedRn: rnName,
      lastUpdatedAt: now,
      sourceRequestId: requestId,
      isDraft: true,
      isSigned: false,
      signedAt: null,
      signedBy: null,
      intakeData: { ...request.intakeData },
      clinicalData: { ...EMPTY_CLINICAL },
      statusHistory: [
        { status: "in_review", timestamp: now, changedBy: rnName },
      ],
    }

    const updated = entries.map((e) => {
      if (e.id === requestId) {
        return {
          ...e,
          status: "in_review" as const,
          assignedRn: rnName,
          lastUpdatedAt: now,
          linkedAssessmentId: assessmentId,
          statusHistory: [
            ...(e as NursingRequest).statusHistory,
            { status: "in_review" as const, timestamp: now, changedBy: rnName },
          ],
        }
      }
      return e
    })
    updated.push(assessment)
    persist(updated)
    return assessment
  }

  const updateAssessment = (id: string, data: Partial<NursingAssessment>) => {
    const now = new Date().toISOString()
    const updated = entries.map((e) =>
      e.id === id ? ({ ...e, ...data, lastUpdatedAt: now } as NursingEntry) : e
    )
    persist(updated)
  }

  const signAssessment = (id: string, rnName: string) => {
    const now = new Date().toISOString()
    const assessment = entries.find((a) => a.id === id) as
      | NursingAssessment
      | undefined

    const updated = entries.map((e) => {
      if (e.id === id && e.type === "assessment") {
        return {
          ...e,
          isDraft: false,
          isSigned: true,
          signedAt: now,
          signedBy: rnName,
          status: "completed" as const,
          lastUpdatedAt: now,
          clinicalData: {
            ...(e as NursingAssessment).clinicalData,
            rnSignature: rnName,
            signedDate: now,
          },
          statusHistory: [
            ...(e as NursingAssessment).statusHistory,
            { status: "completed" as const, timestamp: now, changedBy: rnName },
          ],
        }
      }
      if (
        assessment &&
        e.type === "request" &&
        e.id === assessment.sourceRequestId
      ) {
        return {
          ...e,
          status: "completed" as const,
          lastUpdatedAt: now,
          statusHistory: [
            ...(e as NursingRequest).statusHistory,
            { status: "completed" as const, timestamp: now, changedBy: rnName },
          ],
        }
      }
      return e
    })
    persist(updated)
  }

  const changeRequestStatus = (
    id: string,
    status: AssessmentStatus,
    message?: string
  ) => {
    const now = new Date().toISOString()
    const updated = entries.map((e) => {
      if (e.id === id && e.type === "request") {
        return {
          ...e,
          status,
          lastUpdatedAt: now,
          nurseNotes: message ?? (e as NursingRequest).nurseNotes,
          statusHistory: [
            ...(e as NursingRequest).statusHistory,
            { status, timestamp: now, changedBy: "Sarah Nurse", note: message },
          ],
        }
      }
      return e
    })
    persist(updated)
  }

  const createManualAssessment = (
    data: Partial<PatientIntakeData> & { fullName: string },
    clinicalData: Partial<ClinicalData>,
    rnName: string
  ): NursingAssessment => {
    const now = new Date().toISOString()
    const assessment: NursingAssessment = {
      id: `na-${Date.now()}`,
      type: "assessment",
      source: "manual",
      patientId: `patient-manual-${Date.now()}`,
      patientName: data.fullName,
      patientMrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: now,
      status: "in_review",
      assignedRn: rnName,
      lastUpdatedAt: now,
      sourceRequestId: null,
      isDraft: true,
      isSigned: false,
      signedAt: null,
      signedBy: null,
      intakeData: { ...EMPTY_INTAKE, ...data },
      clinicalData: { ...EMPTY_CLINICAL, ...clinicalData },
      statusHistory: [
        { status: "in_review", timestamp: now, changedBy: rnName },
      ],
    }
    persist([assessment, ...entries])
    return assessment
  }

  const deleteEntry = (id: string) => {
    persist(entries.filter((e) => e.id !== id))
  }

  return (
    <NursingContext.Provider
      value={{
        entries,
        importRequest,
        updateAssessment,
        signAssessment,
        changeRequestStatus,
        createManualAssessment,
        deleteEntry,
      }}
    >
      {children}
    </NursingContext.Provider>
  )
}

export function useNursing() {
  const ctx = useContext(NursingContext)
  if (!ctx) throw new Error("useNursing must be used within <NursingProvider>")
  return ctx
}
