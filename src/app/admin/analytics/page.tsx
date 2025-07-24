"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, Globe, Building2, Calendar } from "lucide-react"
import mockData from "@/lib/mock-data.json"

export default function AnalyticsPage() {
  const analytics = mockData.analytics.global
  const partners = mockData.partnerGroups
  const members = mockData.members

  // Calculate additional metrics
  const avgRevenuePerMember = analytics.totalRevenue / analytics.totalMembers
  const memberGrowthRate = 12 // Mock growth rate
  const topPerformingPlan = analytics.membersByPlan.reduce((prev, current) =>
    prev.revenue > current.revenue ? prev : current,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{memberGrowthRate}%</span> growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Member</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgRevenuePerMember.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Member Growth */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Month</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.revenueByMonth.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{month.month} 2024</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${month.revenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{month.members} members</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>New member acquisitions by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.memberGrowth.map((growth) => (
                <div key={growth.month} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{growth.month} 2024</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">+{growth.newMembers}</div>
                    <div className="text-sm text-muted-foreground">Total: {growth.totalMembers}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution and Regional Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Revenue and member breakdown by plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.membersByPlan.map((plan) => (
                <div key={plan.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          plan.plan === "Gold Plan" ? "default" : plan.plan === "Silver Plan" ? "secondary" : "outline"
                        }
                      >
                        {plan.plan}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{plan.count} members</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${plan.revenue.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{plan.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${plan.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>Member distribution by geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.membersByRegion.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{region.count}</div>
                      <div className="text-xs text-muted-foreground">{region.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${region.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Performance</CardTitle>
          <CardDescription>Top performing partner organizations by member count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partners.map((partner) => {
              const partnerMembers = members.filter((m) => m.partnerGroupId === partner.id)
              const partnerRevenue = partnerMembers.reduce((sum, member) => sum + member.totalCost, 0)

              return (
                <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.contactEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{partnerMembers.length} members</div>
                    <div className="text-sm text-muted-foreground">${partnerRevenue.toLocaleString()} revenue</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
