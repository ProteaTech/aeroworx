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
import { Users, DollarSign, TrendingUp, Calendar, MapPin } from 'lucide-react'
import mockData from '@/lib/mock-data.json'

export default function AnalyticsPage() {
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
  const groupMembers: (typeof mockData)['members'] = mockData.members.filter(
    (member) => member.partnerGroupId === partnerGroup.id
  )

  // Calculate metrics
  const totalMembers = groupMembers.length
  const activeMembers = groupMembers.filter((m) => m.isActive).length
  const totalCost = groupMembers.reduce(
    (sum, member) => sum + member.totalCost,
    0
  )
  const avgCostPerMember = totalCost / totalMembers || 0

  // Plan distribution
  const planDistribution = groupMembers.reduce(
    (acc, member) => {
      const plan = member.coverageType
      acc[plan] = {
        count: (acc[plan]?.count || 0) + 1,
        cost: (acc[plan]?.cost || 0) + member.totalCost,
      }
      return acc
    },
    {} as Record<string, { count: number; cost: number }>
  )

  // Destination analysis
  const destinationAnalysis = groupMembers.reduce(
    (acc, member) => {
      acc[member.destination] = (acc[member.destination] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  // Monthly trends (mock data)
  const monthlyTrends = [
    {
      month: 'Jan',
      members: Math.floor(totalMembers * 0.7),
      cost: Math.floor(totalCost * 0.7),
    },
    {
      month: 'Feb',
      members: Math.floor(totalMembers * 0.85),
      cost: Math.floor(totalCost * 0.85),
    },
    { month: 'Mar', members: totalMembers, cost: totalCost },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Detailed insights into your organization&apos;s member data and
          performance
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
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">
                +{Math.floor(totalMembers * 0.15)}
              </span>{' '}
              this month
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
                {Math.round((activeMembers / totalMembers) * 100)}%
              </span>{' '}
              active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalCost.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="">+15%</span> from last month
            </p>
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
              ${avgCostPerMember.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              Average cost per member
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            Member growth and cost trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyTrends.map((trend) => (
              <div
                key={trend.month}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">{trend.month} 2024</span>
                </div>
                <div className="flex space-x-8">
                  <div className="text-right">
                    <div className="text-muted-foreground text-sm">Members</div>
                    <div className="font-bold">{trend.members}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground text-sm">Cost</div>
                    <div className="font-bold">
                      ${trend.cost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Distribution and Destinations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Breakdown by coverage plan type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(planDistribution).map(([plan, data]) => (
              <div key={plan} className="space-y-2">
                <div className="flex items-center justify-between">
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
                      {data.count} members
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${data.cost.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {Math.round((data.count / totalMembers) * 100)}%
                    </div>
                  </div>
                </div>
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(data.count / totalMembers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>
              Most visited destinations by your members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(destinationAnalysis)
              .sort(([, a], [, b]) => b - a)
              .map(([destination, count]) => (
                <div key={destination} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">{destination}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{count} members</div>
                      <div className="text-muted-foreground text-xs">
                        {Math.round((count / totalMembers) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / totalMembers) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Member Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Member Demographics</CardTitle>
          <CardDescription>Breakdown of member characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-semibold">By Nationality</h4>
              <div className="space-y-2">
                {Object.entries(
                  groupMembers.reduce(
                    (acc, member) => {
                      acc[member.nationality] =
                        (acc[member.nationality] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>
                  )
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([nationality, count]) => (
                    <div
                      key={nationality}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{nationality}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="bg-muted h-2 w-16 rounded-full">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(count / totalMembers) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Travel Duration</h4>
              <div className="space-y-2">
                {Object.entries(
                  groupMembers.reduce(
                    (acc, member) => {
                      const duration = member.daysOfTravel
                      let category = ''
                      if (duration <= 7) category = '1 week or less'
                      else if (duration <= 14) category = '1-2 weeks'
                      else if (duration <= 30) category = '2-4 weeks'
                      else category = 'Over 1 month'

                      acc[category] = (acc[category] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>
                  )
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="bg-muted h-2 w-16 rounded-full">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(count / totalMembers) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
