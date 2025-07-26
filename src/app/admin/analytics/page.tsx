'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Building2,
  Calendar,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import mockData from '@/lib/mock-data.json'
import MotionChart from '@/components/ui/motion-chart'
import { useIsMobile } from '@/hooks/use-mobile'

export default function AnalyticsPage() {
  const analytics = mockData.analytics.global
  const partners = mockData.partnerGroups
  const members = mockData.members
  const isMobile = useIsMobile()

  const parentRef = useRef(null)
  const [parentWidth, setParentWidth] = useState(0)

  useEffect(() => {
    if (!parentRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setParentWidth(entry.contentRect.width)
      }
    })

    observer.observe(parentRef.current)

    return () => observer.disconnect() // Clean up the observer
  }, []) // Empty dependency array means this runs once on mount

  const [selectedMetric, setSelectedMetric] = useState<string>('revenue')

  // Calculate additional metrics
  const avgRevenuePerMember = analytics.totalRevenue / analytics.totalMembers
  const memberGrowthRate = 12 // Mock growth rate
  const topPerformingPlan = analytics.membersByPlan.reduce((prev, current) =>
    prev.revenue > current.revenue ? prev : current
  )

  // Prepare chart data based on selected metric
  const getChartData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          data: analytics.revenueByMonth.map((item) => ({
            label: item.month,
            value: item.revenue,
          })),
          title: 'Revenue Over Time',
          valuePrefix: '$',
          color: 'hsl(142, 76%, 36%)', // Green for revenue
        }
      case 'members':
        return {
          data: analytics.memberGrowth.map((item) => ({
            label: item.month,
            value: item.totalMembers,
          })),
          title: 'Member Growth Over Time',
          valueSuffix: ' members',
          color: 'hsl(221, 83%, 53%)', // Blue for members
        }
      case 'partners':
        return {
          data: [
            { label: 'Jan', value: partners.length - 2 },
            { label: 'Feb', value: partners.length - 1 },
            { label: 'Mar', value: partners.length },
            { label: 'Apr', value: partners.length + 2 },
          ],
          title: 'Partner Growth Over Time',
          valueSuffix: ' partners',
          color: 'hsl(262, 83%, 58%)', // Purple for partners
        }
      case 'newMembers':
        return {
          data: analytics.memberGrowth.map((item) => ({
            label: item.month,
            value: item.newMembers,
          })),
          title: 'New Member Acquisitions',
          valueSuffix: ' new members',
          color: 'hsl(25, 95%, 53%)', // Orange for new members
        }
      default:
        return {
          data: analytics.revenueByMonth.map((item) => ({
            label: item.month,
            value: item.revenue,
          })),
          title: 'Revenue Over Time',
          valuePrefix: '$',
          color: 'hsl(142, 76%, 36%)',
        }
    }
  }

  const chartConfig = getChartData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your platform performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.activeMembers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+{memberGrowthRate}%</span>{' '}
              growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Revenue/Member
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${avgRevenuePerMember.toFixed(2)}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Partner Organizations
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+2</span> new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Interactive analytics with trend visualization
              </CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue Over Time</SelectItem>
                <SelectItem value="members">Total Members</SelectItem>
                <SelectItem value="newMembers">New Members</SelectItem>
                <SelectItem value="partners">Partner Growth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent ref={parentRef} className="px-0 md:px-4 lg:px-6">
          <MotionChart
            data={chartConfig.data}
            title={chartConfig.title}
            valuePrefix={chartConfig.valuePrefix}
            valueSuffix={chartConfig.valueSuffix}
            color={chartConfig.color}
            width={isMobile ? parentWidth : parentWidth * 0.95}
            height={400}
          />
        </CardContent>
      </Card>

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
                <div
                  key={month.month}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{month.month} 2024</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      ${month.revenue.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {month.members} members
                    </div>
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
                <div
                  key={growth.month}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{growth.month} 2024</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      +{growth.newMembers}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Total: {growth.totalMembers}
                    </div>
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
            <CardDescription>
              Revenue and member breakdown by plan type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.membersByPlan.map((plan) => (
                <div key={plan.plan} className="space-y-2">
                  <div className="flex items-center justify-between">
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
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${plan.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
            <CardDescription>
              Member distribution by geographic region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.membersByRegion.map((region) => (
                <div key={region.region} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="text-muted-foreground h-4 w-4" />
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{region.count}</div>
                      <div className="text-muted-foreground text-xs">
                        {region.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${region.percentage}%` }}
                    />
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
          <CardDescription>
            Top performing partner organizations by member count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partners.map((partner) => {
              const partnerMembers = members.filter(
                (m) => m.partnerGroupId === partner.id
              )
              const partnerRevenue = partnerMembers.reduce(
                (sum, member) => sum + member.totalCost,
                0
              )

              return (
                <div
                  key={partner.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <Building2 className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {partner.contactEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      {partnerMembers.length} members
                    </div>
                    <div className="text-muted-foreground text-sm">
                      ${partnerRevenue.toLocaleString()} revenue
                    </div>
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
