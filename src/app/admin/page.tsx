'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, Globe } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import mockData from '@/lib/mock-data.json'

export default function DashboardPage() {
  const { userData } = useAuth()
  const isSuperAdmin = userData?.role === 'superAdmin'

  // For demo purposes, using mock data
  const analytics = mockData.analytics.global

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your{' '}
          {isSuperAdmin ? 'global' : 'organization'} metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalMembers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+12%</span> from last month
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
            <div className="text-2xl font-bold">
              {analytics.activeMembers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Globe className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+22%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coverage Plans Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coverage Plans Distribution</CardTitle>
            <CardDescription>Breakdown of members by plan type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.membersByPlan.map((plan) => (
              <div
                key={plan.plan}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      plan.plan === 'Gold Plan'
                        ? 'default'
                        : plan.plan === 'Silver Plan'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {plan.plan}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    {plan.count} members
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${plan.revenue.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {plan.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Members by geographic region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.membersByRegion.map((region) => (
              <div
                key={region.region}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="bg-primary h-2 w-2 rounded-full"></div>
                  <span className="text-sm font-medium">{region.region}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{region.count}</div>
                  <div className="text-muted-foreground text-xs">
                    {region.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest member registrations and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {member.destination} • {member.coverageType}
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
  )
}
