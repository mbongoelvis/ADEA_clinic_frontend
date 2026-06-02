import { useState } from "react"
import { Copy, Eye, EyeOff, LogOut, Save, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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

export default function ProfilePage() {
  const [showToken, setShowToken] = useState(false)
  const [tokenGenerated, setTokenGenerated] = useState(false)
  const [token] = useState("sk_live_••••••••••••••••••••••••••••••••")
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and security preferences
        </p>
      </div>

      {saved && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
          <AlertDescription>Changes saved successfully.</AlertDescription>
        </Alert>
      )}

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-fname">First Name</Label>
              <Input id="p-fname" defaultValue="Admin" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="p-lname">Last Name</Label>
              <Input id="p-lname" defaultValue="User" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="p-email">Email Address</Label>
              <Input
                id="p-email"
                type="email"
                defaultValue="admin@clinic.com"
              />
              <p className="text-xs text-muted-foreground">
                Changing your email requires verification via the current
                address.
              </p>
            </div>
          </div>
          <Button className="w-fit" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-oldpw">Current Password</Label>
            <Input id="p-oldpw" type="password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-newpw">New Password</Label>
            <Input id="p-newpw" type="password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-confirmpw">Confirm New Password</Label>
            <Input id="p-confirmpw" type="password" />
          </div>
          <Button variant="outline" className="w-fit">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* MFA */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Two-Factor Authentication (MFA)</CardTitle>
              <CardDescription>
                Protect your account with an authenticator app (TOTP)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">MFA Status</p>
              <p className="text-xs text-muted-foreground">
                Currently not enrolled
              </p>
            </div>
            <Button variant="outline" size="sm">
              Set Up MFA
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Scan the QR code with an authenticator app (e.g. Google
            Authenticator, Authy) after clicking "Set Up MFA".
          </p>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">System Alerts by Email</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications for downtime, license expiry, and security
                events
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Active Sessions</p>
              <p className="text-xs text-muted-foreground">
                You are logged in on 2 device(s)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log Out All Other Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Token (admin only) */}
      <Card>
        <CardHeader>
          <CardTitle>API Token</CardTitle>
          <CardDescription>
            Personal API token for automation and integrations (Admin only)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {tokenGenerated ? (
            <>
              <Alert>
                <AlertDescription className="text-xs">
                  Store this token securely. It will not be shown again after
                  you leave this page.
                </AlertDescription>
              </Alert>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={showToken ? token : token.replace(/./g, "•")}
                  className="font-mono text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowToken((v) => !v)}
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(token)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTokenGenerated(false)}
                  className="text-destructive hover:text-destructive"
                >
                  Revoke Token
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                No API token generated yet.
              </p>
              <Button
                variant="outline"
                className="w-fit"
                onClick={() => setTokenGenerated(true)}
              >
                Generate API Token
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
