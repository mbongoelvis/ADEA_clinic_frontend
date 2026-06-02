import { useState } from "react"
import { Save } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="w-full sm:w-64">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const [emailReminder, setEmailReminder] = useState(true)
  const [smsReminder, setSmsReminder] = useState(true)
  const [portalEnabled, setPortalEnabled] = useState(true)
  const [autoSubmitClaims, setAutoSubmitClaims] = useState(false)
  const [mfaEnforcement, setMfaEnforcement] = useState("optional")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage system-wide configuration
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="clinical">Clinical</TabsTrigger>
          <TabsTrigger value="portal">Patient Portal</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic clinic information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow label="Clinic Name">
                <Input defaultValue="Sunrise Family Clinic" />
              </SettingRow>
              <Separator />
              <SettingRow label="Clinic Address">
                <Textarea
                  defaultValue="123 Main Street&#10;New York, NY 10001"
                  rows={3}
                />
              </SettingRow>
              <Separator />
              <SettingRow label="NPI Number">
                <Input defaultValue="1234567890" />
              </SettingRow>
              <Separator />
              <SettingRow label="Tax ID">
                <Input defaultValue="12-3456789" />
              </SettingRow>
              <Separator />
              <SettingRow label="Time Zone">
                <Select defaultValue="america_new_york">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america_new_york">
                      America/New_York
                    </SelectItem>
                    <SelectItem value="america_chicago">
                      America/Chicago
                    </SelectItem>
                    <SelectItem value="america_denver">
                      America/Denver
                    </SelectItem>
                    <SelectItem value="america_los_angeles">
                      America/Los_Angeles
                    </SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow label="Date Format">
                <Select defaultValue="mdy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow label="Default Language">
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Settings</CardTitle>
              <CardDescription>Configure scheduling defaults</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow
                label="Default Duration"
                description="Default appointment length in minutes"
              >
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow label="Buffer Between Appointments">
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow label="Max Appointments Per Day (per provider)">
                <Input type="number" defaultValue="20" min="1" max="100" />
              </SettingRow>
              <Separator />
              <SettingRow label="Allow Overlapping Appointments">
                <div className="flex items-center gap-2">
                  <Switch id="overlap" />
                  <Label htmlFor="overlap">Enabled</Label>
                </div>
              </SettingRow>
              <Separator />
              <SettingRow
                label="Cancellation Policy"
                description="Minimum hours before appointment for cancellation"
              >
                <Input type="number" defaultValue="24" min="0" />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reminders */}
        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Reminders & Notifications</CardTitle>
              <CardDescription>
                Configure automated patient reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow
                label="Email Reminders"
                description="Send appointment reminders via email"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    id="email-rem"
                    checked={emailReminder}
                    onCheckedChange={setEmailReminder}
                  />
                  <Label htmlFor="email-rem">
                    {emailReminder ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </SettingRow>
              <Separator />
              <SettingRow
                label="SMS Reminders"
                description="Send appointment reminders via SMS"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    id="sms-rem"
                    checked={smsReminder}
                    onCheckedChange={setSmsReminder}
                  />
                  <Label htmlFor="sms-rem">
                    {smsReminder ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </SettingRow>
              <Separator />
              <SettingRow
                label="Reminder Timing"
                description="Hours before appointment to send reminder"
              >
                <Select defaultValue="24">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour before</SelectItem>
                    <SelectItem value="2">2 hours before</SelectItem>
                    <SelectItem value="24">24 hours before</SelectItem>
                    <SelectItem value="48">48 hours before</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow
                label="Email Template"
                description="Use {patient_name}, {date}, {time} as placeholders"
              >
                <Textarea
                  defaultValue={
                    "Hi {patient_name},\n\nThis is a reminder for your appointment on {date} at {time}.\n\nThank you,\nSunrise Family Clinic"
                  }
                  rows={5}
                />
              </SettingRow>
              <Separator />
              <SettingRow label="SMS Template">
                <Textarea
                  defaultValue={
                    "Reminder: Appt on {date} at {time}. Reply STOP to opt out."
                  }
                  rows={2}
                />
              </SettingRow>
              <Separator />
              <SettingRow label="Notify Staff on Cancellation">
                <Select defaultValue="provider">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="provider">Provider only</SelectItem>
                    <SelectItem value="all">All staff</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Financial</CardTitle>
              <CardDescription>
                Configure billing defaults and payer settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow label="Default Payment Terms">
                <Select defaultValue="net30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow label="Auto-Submit Claims">
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-claims"
                    checked={autoSubmitClaims}
                    onCheckedChange={setAutoSubmitClaims}
                  />
                  <Label htmlFor="auto-claims">
                    {autoSubmitClaims ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </SettingRow>
              {autoSubmitClaims && (
                <>
                  <Separator />
                  <SettingRow label="Auto-Submit Schedule">
                    <Select defaultValue="daily17">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily17">
                          Daily at 5:00 PM
                        </SelectItem>
                        <SelectItem value="daily8">Daily at 8:00 AM</SelectItem>
                        <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                </>
              )}
              <Separator />
              <SettingRow
                label="Self-Pay Discount %"
                description="Discount applied to self-pay patients"
              >
                <Input type="number" defaultValue="10" min="0" max="100" />
              </SettingRow>
              <Separator />
              <SettingRow
                label="Late Fee Amount ($)"
                description="Fee charged for overdue balances"
              >
                <Input type="number" defaultValue="25" min="0" />
              </SettingRow>
              <Separator />
              <SettingRow
                label="Days Until Late Fee"
                description="Days overdue before fee is applied"
              >
                <Input type="number" defaultValue="30" min="1" />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                Configure document types and retention policy
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow
                label="Retention Period"
                description="Auto-delete documents older than"
              >
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 3, 5, 7, 10].map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y} year{y > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Document Types</p>
                <p className="text-xs text-muted-foreground">
                  Define document labels and whether they are required before
                  appointments
                </p>
                {[
                  "Government ID",
                  "Insurance Card",
                  "Referral Letter",
                  "Consent Form",
                  "Lab Results",
                ].map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <span className="text-sm">{type}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Switch
                        id={`doctype-${type}`}
                        defaultChecked={[
                          "Government ID",
                          "Consent Form",
                        ].includes(type)}
                      />
                      <Label htmlFor={`doctype-${type}`} className="text-xs">
                        Required
                      </Label>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-fit">
                  + Add Document Type
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portal */}
        <TabsContent value="portal">
          <Card>
            <CardHeader>
              <CardTitle>Patient Portal</CardTitle>
              <CardDescription>
                Configure what patients can access through the portal
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow label="Portal Enabled">
                <div className="flex items-center gap-2">
                  <Switch
                    id="portal-en"
                    checked={portalEnabled}
                    onCheckedChange={setPortalEnabled}
                  />
                  <Label htmlFor="portal-en">
                    {portalEnabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </SettingRow>
              <Separator />
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Portal Features</p>
                {[
                  ["Online Booking", true],
                  ["Bill Payment", true],
                  ["Messaging", false],
                  ["Forms", true],
                  ["View Visit Summaries", false],
                ].map(([feature, def]) => (
                  <div
                    key={String(feature)}
                    className="flex items-center gap-2"
                  >
                    <Switch
                      id={`pf-${feature}`}
                      defaultChecked={!!def}
                      disabled={!portalEnabled}
                    />
                    <Label htmlFor={`pf-${feature}`} className="font-normal">
                      {String(feature)}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator />
              <SettingRow label="Min Booking Lead Time (hours)">
                <Input
                  type="number"
                  defaultValue="2"
                  min="0"
                  disabled={!portalEnabled}
                />
              </SettingRow>
              <Separator />
              <SettingRow label="Max Booking Horizon (days)">
                <Input
                  type="number"
                  defaultValue="90"
                  min="1"
                  disabled={!portalEnabled}
                />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="flex flex-col gap-4">
            {[
              {
                title: "EMR Integration",
                fields: [
                  ["API Endpoint", "text", "https://emr.example.com/api"],
                  ["API Key", "password", ""],
                  [
                    "Sync Direction",
                    "select",
                    ["One-way (IMS → EMR)", "One-way (EMR → IMS)", "Two-way"],
                  ],
                  [
                    "Sync Schedule",
                    "select",
                    ["Every hour", "Every 4 hours", "Daily"],
                  ],
                ],
              },
              {
                title: "Lab Interface (LIS)",
                fields: [
                  ["HL7 Host", "text", "lis.example.com"],
                  ["HL7 Port", "number", "2575"],
                ],
              },
              {
                title: "Accounting (QuickBooks)",
                fields: [
                  ["Client ID", "text", ""],
                  ["Client Secret", "password", ""],
                  ["Sync Frequency", "select", ["Daily", "Weekly", "Manual"]],
                ],
              },
              {
                title: "SMS Gateway (Twilio)",
                fields: [
                  ["Account SID", "text", ""],
                  ["Auth Token", "password", ""],
                  ["From Number", "text", "+1 (555) 000-0000"],
                ],
              },
            ].map(({ title, fields }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {fields.map(([label, type, def]) => (
                    <div key={String(label)} className="flex flex-col gap-1.5">
                      <Label>{String(label)}</Label>
                      {type === "select" ? (
                        <Select defaultValue={String((def as string[])[0])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(def as string[]).map((o) => (
                              <SelectItem key={o} value={o}>
                                {o}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={String(type)}
                          defaultValue={String(def)}
                          placeholder={type === "password" ? "••••••••" : ""}
                        />
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-fit">
                    Test Connection
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Authentication and access control configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow
                label="Session Timeout (minutes)"
                description="Idle time before automatic logout"
              >
                <Input type="number" defaultValue="15" min="5" max="480" />
              </SettingRow>
              <Separator />
              <SettingRow label="Min Password Length">
                <Select defaultValue="8">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[8, 10, 12].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} characters
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium">Password Requirements</p>
                {[
                  ["Require uppercase letter", true],
                  ["Require number", true],
                  ["Require special character", false],
                ].map(([label, def]) => (
                  <div key={String(label)} className="flex items-center gap-2">
                    <Switch id={`pw-${label}`} defaultChecked={!!def} />
                    <Label htmlFor={`pw-${label}`} className="font-normal">
                      {String(label)}
                    </Label>
                  </div>
                ))}
              </div>
              <Separator />
              <SettingRow
                label="Password Expiry (days)"
                description="0 = never expires"
              >
                <Input type="number" defaultValue="90" min="0" />
              </SettingRow>
              <Separator />
              <SettingRow label="MFA Enforcement">
                <Select
                  value={mfaEnforcement}
                  onValueChange={setMfaEnforcement}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="forced">Forced for all staff</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow
                label="Admin IP Whitelist"
                description="Comma-separated IPs or CIDR ranges (leave blank to allow all)"
              >
                <Textarea placeholder="192.168.1.0/24, 10.0.0.1" rows={3} />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical */}
        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Clinical / Nursing Settings</CardTitle>
              <CardDescription>
                Configure nursing assessment behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <SettingRow
                label="Auto-notify patient on assessment completion"
                description="Automatically send email/SMS to patient when RN signs an assessment"
              >
                <Switch defaultChecked />
              </SettingRow>
              <Separator />
              <SettingRow
                label="Require RN signature for all assessments"
                description="Assessments cannot be marked complete without an RN signature"
              >
                <Switch defaultChecked />
              </SettingRow>
              <Separator />
              <SettingRow
                label="Default review period"
                description="How often signed assessments should be reviewed"
              >
                <Select defaultValue="12">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </SettingRow>
              <Separator />
              <SettingRow
                label="Allow LVN to edit signed assessments"
                description="If enabled, LVNs can modify assessments after they've been signed"
              >
                <Switch />
              </SettingRow>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
