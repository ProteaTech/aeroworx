'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  Download,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react'
import mockData from '@/lib/mock-data.json'

type HistoryicalDataEntry = {
  id: string
  partnerGroupId: string
  partnerGroupName: string
  year: number
  month: string
  memberCount: number
  revenue: number
  invoiceNumber: string
  status: 'paid' | 'pending'
  dueDate: string
  paidDate: string | null
}

// Generate historical billing data
const generateHistoricalBilling = () => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const years = [2023, 2024]
  const historicalData: HistoryicalDataEntry[] = []

  years.forEach((year) => {
    months.forEach((month, index) => {
      if (year === 2024 && index > 2) return // Only show up to March 2024

      mockData.partnerGroups.forEach((partner) => {
        const baseMembers =
          partner.id === 'pg1' ? 20 : partner.id === 'pg2' ? 15 : 12
        const memberCount = Math.floor(baseMembers + Math.random() * 10)
        const avgRate =
          (partner.settings.basePlanPrice +
            partner.settings.silverPlanPrice +
            partner.settings.goldPlanPrice) /
          3
        const revenue = memberCount * avgRate * (0.8 + Math.random() * 0.4) // Add some variance

        historicalData.push({
          id: `${partner.id}-${year}-${index}`,
          partnerGroupId: partner.id,
          partnerGroupName: partner.name,
          year,
          month,
          memberCount,
          revenue: Math.round(revenue),
          invoiceNumber: `INV-${year}-${String(index + 1).padStart(2, '0')}-${partner.id.toUpperCase()}`,
          status: year === 2024 && index === 2 ? 'pending' : 'paid',
          dueDate: `${year}-${String(index + 2).padStart(2, '0')}-01`,
          paidDate:
            year === 2024 && index === 2
              ? null
              : `${year}-${String(index + 2).padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}`,
        })
      })
    })
  })

  return historicalData
}

const historicalBilling = generateHistoricalBilling()

// Generate next billing cycle data
const nextBillingCycle = mockData.partnerGroups.map((partner) => {
  const currentMembers = mockData.members.filter(
    (m) => m.partnerGroupId === partner.id
  ).length
  const avgRate =
    (partner.settings.basePlanPrice +
      partner.settings.silverPlanPrice +
      partner.settings.goldPlanPrice) /
    3
  const projectedRevenue = currentMembers * avgRate

  return {
    partnerGroupId: partner.id,
    partnerGroupName: partner.name,
    currentMembers,
    projectedRevenue: Math.round(projectedRevenue),
    billingDate: '2024-04-01',
    status: 'upcoming',
  }
})

export default function AdminBillingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [yearFilter, setYearFilter] = useState('2024')
  const [partnerFilter, setPartnerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredHistorical = historicalBilling.filter((bill) => {
    const matchesSearch =
      bill.partnerGroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear =
      yearFilter === 'all' || bill.year.toString() === yearFilter
    const matchesPartner =
      partnerFilter === 'all' || bill.partnerGroupId === partnerFilter
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter

    return matchesSearch && matchesYear && matchesPartner && matchesStatus
  })

  // Calculate stats
  const currentYearBilling = historicalBilling.filter((b) => b.year === 2024)
  const totalRevenue2024 = currentYearBilling.reduce(
    (sum, b) => sum + b.revenue,
    0
  )
  const totalRevenue2023 = historicalBilling
    .filter((b) => b.year === 2023)
    .reduce((sum, b) => sum + b.revenue, 0)
  const pendingAmount = historicalBilling
    .filter((b) => b.status === 'pending')
    .reduce((sum, b) => sum + b.revenue, 0)
  const nextCycleTotal = nextBillingCycle.reduce(
    (sum, b) => sum + b.projectedRevenue,
    0
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing Management
          </h1>
          <p className="text-muted-foreground">
            Monitor billing across all partner groups and manage invoices
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2024 Revenue</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue2024.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {totalRevenue2024 > totalRevenue2023 ? '+' : ''}
              {(
                ((totalRevenue2024 - totalRevenue2023) / totalRevenue2023) *
                100
              ).toFixed(1)}
              % from 2023
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${pendingAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {historicalBilling.filter((b) => b.status === 'pending').length}{' '}
              invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Cycle</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${nextCycleTotal.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Due April 1, 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Partners
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.partnerGroups.length}
            </div>
            <p className="text-muted-foreground text-xs">All partners active</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="historical" className="space-y-4">
        <TabsList>
          <TabsTrigger value="historical">Historical Billing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="historical" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Historical Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Partners</SelectItem>
                    <SelectItem value="pg1">Magnus</SelectItem>
                    <SelectItem value="pg2">Discovery</SelectItem>
                    <SelectItem value="pg3">Asia Pacific Coverage</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Historical Billing Table */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Historical billing data for all partner groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistorical.map((bill) => (
                  <div
                    key={bill.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p className="font-medium">{bill.invoiceNumber}</p>
                          <p className="text-muted-foreground text-sm">
                            {bill.partnerGroupName}
                          </p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        <p>
                          {bill.month} {bill.year}
                        </p>
                        <p>{bill.memberCount} members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">
                          ${bill.revenue.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {bill.status === 'paid'
                            ? `Paid ${bill.paidDate}`
                            : `Due ${bill.dueDate}`}
                        </p>
                      </div>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Next Billing Cycle - April 2024</CardTitle>
              <CardDescription>
                Projected billing amounts for the upcoming cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextBillingCycle.map((bill) => (
                  <div
                    key={bill.partnerGroupId}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div>
                          <p className="font-medium">{bill.partnerGroupName}</p>
                          <p className="text-muted-foreground text-sm">
                            Due: {bill.billingDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        <p>{bill.currentMembers} active members</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-blue-600">
                          ${bill.projectedRevenue.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Projected
                        </p>
                      </div>
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Generate Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Total Projected Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${nextCycleTotal.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
