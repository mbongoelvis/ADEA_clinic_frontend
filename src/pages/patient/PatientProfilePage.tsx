import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePatientRequests } from "@/contexts/PatientRequestsContext"
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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function PatientProfilePage() {
  const { user } = useAuth()
  const { notificationPrefs, updateNotificationPrefs } = usePatientRequests()

  const [emailNotif, setEmailNotif] = useState(notificationPrefs.email)
  const [smsNotif, setSmsNotif] = useState(notificationPrefs.sms)
  const [onComplete, setOnComplete] = useState(
    notificationPrefs.onAssessmentComplete
  )
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateNotificationPrefs({
      email: emailNotif,
      sms: smsNotif,
      onAssessmentComplete: onComplete,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and notification preferences
        </p>
      </div>

      {saved && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Settings saved successfully.</AlertDescription>
        </Alert>
      )}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={user?.name ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Contact the clinic to update your personal information.
          </p>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences for Requests</CardTitle>
          <CardDescription>
            Control how you receive updates about your nursing assessment
            requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email when your request status changes
              </p>
            </div>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">SMS notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive text messages when your request status changes (requires
                verified phone)
              </p>
            </div>
            <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Notify when RN completes assessment
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified specifically when your assessment is marked as
                completed
              </p>
            </div>
            <Switch checked={onComplete} onCheckedChange={setOnComplete} />
          </div>

          <div className="pt-2">
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
