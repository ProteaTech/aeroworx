'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Save, Building2, DollarSign, Globe, Shield } from 'lucide-react'
import { toast } from 'sonner'
import mockData from '@/lib/mock-data.json'

export default function SettingsPage() {
  const params = useParams()
  const groupName = params.groupName as string

  const [loading, setLoading] = useState(false)

  const [settings, setSettings] = useState({
    // Organization Settings
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',

    // Plan Pricing
    basePlanPrice: 0,
    silverPlanPrice: 0,
    goldPlanPrice: 0,
    defaultCurrency: '',

    // Operational Settings
    timezone: '',
    allowSelfRegistration: false,
    isActive: false,

    // Notification Settings
    emailNotifications: true,
    memberAlerts: true,
    billingReminders: true,
  })

  const partnerGroup = mockData.partnerGroups.find(
    (group) => group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  )

  useEffect(() => {
    if (!partnerGroup) return

    setSettings({
      // Organization Settings
      name: partnerGroup.name,
      contactEmail: partnerGroup.contactEmail || '',
      contactPhone: partnerGroup.contactPhone || '',
      address: partnerGroup.address || '',

      // Plan Pricing
      basePlanPrice: partnerGroup.settings.basePlanPrice,
      silverPlanPrice: partnerGroup.settings.silverPlanPrice,
      goldPlanPrice: partnerGroup.settings.goldPlanPrice,
      defaultCurrency: partnerGroup.settings.defaultCurrency,

      // Operational Settings
      timezone: partnerGroup.settings.timezone,
      allowSelfRegistration: partnerGroup.settings.allowSelfRegistration,
      isActive: partnerGroup.isActive,

      // leave notifications at their initial defaults
      emailNotifications: settings.emailNotifications,
      memberAlerts: settings.memberAlerts,
      billingReminders: settings.billingReminders,
    })
    // only run when partnerGroup changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerGroup])

  if (!partnerGroup) {
    return <div>Partner group not found</div>
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Organization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Organization Details</span>
            </CardTitle>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  handleSettingChange('contactEmail', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) =>
                  handleSettingChange('contactPhone', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Plan Pricing</span>
            </CardTitle>
            <CardDescription>
              Configure your coverage plan pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePlanPrice">Base Plan ($)</Label>
                <Input
                  id="basePlanPrice"
                  type="number"
                  value={settings.basePlanPrice}
                  onChange={(e) =>
                    handleSettingChange('basePlanPrice', Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="silverPlanPrice">Silver Plan ($)</Label>
                <Input
                  id="silverPlanPrice"
                  type="number"
                  value={settings.silverPlanPrice}
                  onChange={(e) =>
                    handleSettingChange(
                      'silverPlanPrice',
                      Number(e.target.value)
                    )
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goldPlanPrice">Gold Plan ($)</Label>
                <Input
                  id="goldPlanPrice"
                  type="number"
                  value={settings.goldPlanPrice}
                  onChange={(e) =>
                    handleSettingChange('goldPlanPrice', Number(e.target.value))
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) =>
                  handleSettingChange('defaultCurrency', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Operational Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Operational Settings</span>
            </CardTitle>
            <CardDescription>Configure operational preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  handleSettingChange('timezone', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time
                  </SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Self Registration</Label>
                <p className="text-muted-foreground text-sm">
                  Allow members to register themselves
                </p>
              </div>
              <Switch
                checked={settings.allowSelfRegistration}
                onCheckedChange={(checked) =>
                  handleSettingChange('allowSelfRegistration', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Organization Status</Label>
                <p className="text-muted-foreground text-sm">
                  Enable or disable your organization
                </p>
              </div>
              <Switch
                checked={settings.isActive}
                onCheckedChange={(checked) =>
                  handleSettingChange('isActive', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-muted-foreground text-sm">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange('emailNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Member Alerts</Label>
                <p className="text-muted-foreground text-sm">
                  Get notified when members join or leave
                </p>
              </div>
              <Switch
                checked={settings.memberAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange('memberAlerts', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Billing Reminders</Label>
                <p className="text-muted-foreground text-sm">
                  Receive reminders about upcoming payments
                </p>
              </div>
              <Switch
                checked={settings.billingReminders}
                onCheckedChange={(checked) =>
                  handleSettingChange('billingReminders', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
