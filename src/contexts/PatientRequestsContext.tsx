import { createContext, useContext, useState, type ReactNode } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export type RequestStatus =
  | "pending"
  | "in_review"
  | "completed"
  | "action_needed"

export interface NursingIntakeData {
  // Demographics
  fullName: string
  dateOfBirth: string
  gender: string
  address: string
  phone: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  // Medical History
  chiefComplaint: string
  currentMedications: string
  allergies: string
  pastMedicalHistory: string
  pastSurgicalHistory: string
  familyHistory: string
  // Lifestyle
  smokingStatus: string
  alcoholUse: string
  exerciseFrequency: string
  diet: string
  // Mental Health
  moodDescription: string
  sleepQuality: string
  stressLevel: string
  // Functional Status
  mobilityLevel: string
  adlIndependence: string
  fallRisk: string
  // Pain Assessment
  painPresent: boolean
  painLocation: string
  painIntensity: number
  painDescription: string
  // Additional
  additionalNotes: string
}

export interface PatientRequest {
  id: string
  submittedAt: string
  status: RequestStatus
  lastUpdatedAt: string
  intakeData: NursingIntakeData
  nurseMessage?: string
  completedSummary?: string
  statusHistory: { status: RequestStatus; timestamp: string }[]
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  onAssessmentComplete: boolean
}

interface PatientRequestsContextType {
  requests: PatientRequest[]
  draftData: Partial<NursingIntakeData> | null
  notificationPrefs: NotificationPreferences
  saveDraft: (data: Partial<NursingIntakeData>) => void
  clearDraft: () => void
  submitIntake: (data: NursingIntakeData) => PatientRequest
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_REQUESTS: PatientRequest[] = [
  {
    id: "req-001",
    submittedAt: "2026-05-20T10:30:00Z",
    status: "completed",
    lastUpdatedAt: "2026-05-22T14:00:00Z",
    intakeData: {
      fullName: "John Patient",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      address: "123 Main St, Springfield",
      phone: "(555) 123-4567",
      emergencyContactName: "Jane Patient",
      emergencyContactPhone: "(555) 987-6543",
      emergencyContactRelation: "Spouse",
      chiefComplaint: "Persistent headaches for the past two weeks",
      currentMedications: "Ibuprofen 400mg PRN",
      allergies: "Penicillin",
      pastMedicalHistory: "Hypertension (diagnosed 2020)",
      pastSurgicalHistory: "Appendectomy (2010)",
      familyHistory: "Father: Type 2 Diabetes; Mother: Breast cancer",
      smokingStatus: "Never",
      alcoholUse: "Social (1-2 drinks/week)",
      exerciseFrequency: "3-4 times per week",
      diet: "Balanced diet, low sodium",
      moodDescription: "Generally positive",
      sleepQuality: "Fair – occasional insomnia",
      stressLevel: "Moderate",
      mobilityLevel: "Independent",
      adlIndependence: "Fully independent",
      fallRisk: "Low",
      painPresent: true,
      painLocation: "Frontal/temporal headache",
      painIntensity: 6,
      painDescription: "Throbbing, worse in the morning",
      additionalNotes: "",
    },
    nurseMessage:
      "Assessment completed. Please schedule a follow-up in 2 weeks.",
    completedSummary:
      "Nursing Diagnosis: Chronic pain related to tension headaches. Goals: Reduce pain intensity to 3/10 within 4 weeks. Plan: Medication review, stress management referral, follow-up in 2 weeks.",
    statusHistory: [
      { status: "pending", timestamp: "2026-05-20T10:30:00Z" },
      { status: "in_review", timestamp: "2026-05-21T09:00:00Z" },
      { status: "completed", timestamp: "2026-05-22T14:00:00Z" },
    ],
  },
  {
    id: "req-002",
    submittedAt: "2026-05-26T08:15:00Z",
    status: "in_review",
    lastUpdatedAt: "2026-05-27T11:00:00Z",
    intakeData: {
      fullName: "John Patient",
      dateOfBirth: "1985-03-15",
      gender: "Male",
      address: "123 Main St, Springfield",
      phone: "(555) 123-4567",
      emergencyContactName: "Jane Patient",
      emergencyContactPhone: "(555) 987-6543",
      emergencyContactRelation: "Spouse",
      chiefComplaint: "Follow-up for blood pressure management",
      currentMedications: "Lisinopril 10mg daily, Ibuprofen PRN",
      allergies: "Penicillin",
      pastMedicalHistory: "Hypertension (diagnosed 2020)",
      pastSurgicalHistory: "Appendectomy (2010)",
      familyHistory: "Father: Type 2 Diabetes; Mother: Breast cancer",
      smokingStatus: "Never",
      alcoholUse: "Social (1-2 drinks/week)",
      exerciseFrequency: "3-4 times per week",
      diet: "Balanced diet, low sodium",
      moodDescription: "Slightly anxious about BP readings",
      sleepQuality: "Good",
      stressLevel: "Low to moderate",
      mobilityLevel: "Independent",
      adlIndependence: "Fully independent",
      fallRisk: "Low",
      painPresent: false,
      painLocation: "",
      painIntensity: 0,
      painDescription: "",
      additionalNotes: "Recent home BP readings averaging 145/92",
    },
    nurseMessage:
      "A nurse is reviewing your information and may contact you if needed.",
    statusHistory: [
      { status: "pending", timestamp: "2026-05-26T08:15:00Z" },
      { status: "in_review", timestamp: "2026-05-27T11:00:00Z" },
    ],
  },
]

const DRAFT_KEY = "clinic_ims_intake_draft"
const REQUESTS_KEY = "clinic_ims_patient_requests"
const PREFS_KEY = "clinic_ims_notification_prefs"

// ─── Context ─────────────────────────────────────────────────────────────────

const PatientRequestsContext = createContext<PatientRequestsContextType | null>(
  null
)

export function PatientRequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PatientRequest[]>(() => {
    try {
      const stored = localStorage.getItem(REQUESTS_KEY)
      return stored ? JSON.parse(stored) : MOCK_REQUESTS
    } catch {
      return MOCK_REQUESTS
    }
  })

  const [draftData, setDraftData] = useState<Partial<NursingIntakeData> | null>(
    () => {
      try {
        const stored = localStorage.getItem(DRAFT_KEY)
        return stored ? JSON.parse(stored) : null
      } catch {
        return null
      }
    }
  )

  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreferences>(() => {
      try {
        const stored = localStorage.getItem(PREFS_KEY)
        return stored
          ? JSON.parse(stored)
          : { email: true, sms: false, onAssessmentComplete: true }
      } catch {
        return { email: true, sms: false, onAssessmentComplete: true }
      }
    })

  const saveDraft = (data: Partial<NursingIntakeData>) => {
    setDraftData(data)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  }

  const clearDraft = () => {
    setDraftData(null)
    localStorage.removeItem(DRAFT_KEY)
  }

  const submitIntake = (data: NursingIntakeData): PatientRequest => {
    const now = new Date().toISOString()
    const newRequest: PatientRequest = {
      id: `req-${Date.now()}`,
      submittedAt: now,
      status: "pending",
      lastUpdatedAt: now,
      intakeData: data,
      statusHistory: [{ status: "pending", timestamp: now }],
    }
    const updated = [newRequest, ...requests]
    setRequests(updated)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated))
    clearDraft()
    return newRequest
  }

  const updateNotificationPrefs = (prefs: Partial<NotificationPreferences>) => {
    const updated = { ...notificationPrefs, ...prefs }
    setNotificationPrefs(updated)
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated))
  }

  return (
    <PatientRequestsContext.Provider
      value={{
        requests,
        draftData,
        notificationPrefs,
        saveDraft,
        clearDraft,
        submitIntake,
        updateNotificationPrefs,
      }}
    >
      {children}
    </PatientRequestsContext.Provider>
  )
}

export function usePatientRequests() {
  const ctx = useContext(PatientRequestsContext)
  if (!ctx)
    throw new Error(
      "usePatientRequests must be used within <PatientRequestsProvider>"
    )
  return ctx
}
