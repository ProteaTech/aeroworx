'use client'

import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import mockData from '@/lib/mock-data.json'

export default function PartnerGroupOverview() {
  const params = useParams()
  const groupName = params.groupName as string

  // Find the partner group
  const partnerGroup = mockData.partnerGroups.find(
    (group) => group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  )

  if (!partnerGroup) {
    return <div>Partner group not found</div>
  }

  // Get members for this partner group
  const groupMembers = mockData.members.filter(
    (member) => member.partnerGroupId === partnerGroup.id
  )

  // Calculate metrics
  const totalMembers = groupMembers.length
  const activeMembers = groupMembers.filter((m) => m.isActive).length
  const totalRevenue = groupMembers.reduce(
    (sum, member) => sum + member.totalCost,
    0
  )
  const avgRevenuePerMember = totalRevenue / totalMembers || 0

  // Plan distribution
  const planDistribution = groupMembers.reduce(
    (acc, member) => {
      acc[member.coverageType] = (acc[member.coverageType] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {partnerGroup.name}
        </h1>
        <p className="text-muted-foreground">
          Welcome to your partner dashboard. Manage your members and view
          analytics.
        </p>
      </div>

      {/* Partner Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Your organization details and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">{partnerGroup.contactEmail}</span>
              </div>
              {partnerGroup.contactPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{partnerGroup.contactPhone}</span>
                </div>
              )}
              {partnerGroup.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{partnerGroup.address}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium">Status: </span>
                <Badge
                  variant={partnerGroup.isActive ? 'default' : 'secondary'}
                >
                  {partnerGroup.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Currency: </span>
                <span className="text-sm">
                  {partnerGroup.settings.defaultCurrency}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Timezone: </span>
                <span className="text-sm">
                  {partnerGroup.settings.timezone}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">{activeMembers}</span> active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">
                {Math.round((activeMembers / totalMembers) * 100) || 0}%
              </span>{' '}
              active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg per Member
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgRevenuePerMember.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">Average cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution and Recent Members */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>
              Breakdown of members by coverage plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(planDistribution).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      plan === 'Gold Plan'
                        ? 'default'
                        : plan === 'Silver Plan'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {plan}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {count} members
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {Math.round((count / totalMembers) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>Latest member registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {member.destination} •{' '}
                      {new Date(member.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{member.coverageType}</Badge>
                    <p className="text-muted-foreground mt-1 text-xs">
                      ${member.totalCost}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle>Your Pricing Plans</CardTitle>
          <CardDescription>
            Current pricing structure for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-semibold">Base Plan</h3>
              <p className="text-primary text-2xl font-bold">
                ${partnerGroup.settings.basePlanPrice}
              </p>
              <p className="text-muted-foreground text-sm">
                per person per month
              </p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-semibold">Silver Plan</h3>
              <p className="text-primary text-2xl font-bold">
                ${partnerGroup.settings.silverPlanPrice}
              </p>
              <p className="text-muted-foreground text-sm">
                per person per month
              </p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-semibold">Gold Plan</h3>
              <p className="text-primary text-2xl font-bold">
                ${partnerGroup.settings.goldPlanPrice}
              </p>
              <p className="text-muted-foreground text-sm">
                per person per month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
