'use client'

import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Calendar,
  CreditCard,
  Download,
  FileText,
  AlertCircle,
} from 'lucide-react'
import mockData from '@/lib/mock-data.json'

export default function BillingPage() {
  const params = useParams()
  const groupName = params.groupName as string

  // Find the partner group
  const partnerGroup = mockData.partnerGroups.find(
    (group) => group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  )

  if (!partnerGroup) {
    return <div>Partner group not found</div>
  }

  // Get billing data for this partner group
  const billingData = mockData.billing.find(
    (billing) => billing.partnerGroupId === partnerGroup.id
  )

  // Get members for this partner group
  const groupMembers = mockData.members.filter(
    (member) => member.partnerGroupId === partnerGroup.id
  )

  const totalRevenue = groupMembers.reduce(
    (sum, member) => sum + member.totalCost,
    0
  )

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-2024-003',
      date: '2024-03-01',
      amount: totalRevenue,
      status: 'paid',
      dueDate: '2024-03-15',
      members: groupMembers.length,
    },
    {
      id: 'INV-2024-002',
      date: '2024-02-01',
      amount: Math.floor(totalRevenue * 0.85),
      status: 'paid',
      dueDate: '2024-02-15',
      members: Math.floor(groupMembers.length * 0.85),
    },
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: Math.floor(totalRevenue * 0.7),
      status: 'paid',
      dueDate: '2024-01-15',
      members: Math.floor(groupMembers.length * 0.7),
    },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'overdue':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your billing information, invoices, and payment history
        </p>
      </div>

      {/* Current Billing Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${billingData?.forecastedRevenue.toLocaleString() || '0'}
            </div>
            <p className="text-muted-foreground text-xs">
              For {billingData?.currentMembers || 0} members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billingData ? formatDate(billingData.nextBillingDate) : 'N/A'}
            </div>
            <p className="text-muted-foreground text-xs">
              Monthly billing cycle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Status
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                variant={getStatusBadgeVariant(
                  billingData?.status || 'current'
                )}
              >
                {billingData?.status || 'Current'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              All payments up to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">Total charges</p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Billing Period</CardTitle>
          <CardDescription>
            Billing period:{' '}
            {billingData ? formatDate(billingData.lastBillingDate) : 'N/A'} -{' '}
            {billingData ? formatDate(billingData.nextBillingDate) : 'N/A'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <h3 className="font-semibold">Base Plan</h3>
                <p className="text-primary text-2xl font-bold">
                  {
                    groupMembers.filter((m) => m.coverageType === 'Base Plan')
                      .length
                  }
                </p>
                <p className="text-muted-foreground text-sm">
                  @ ${partnerGroup.settings.basePlanPrice}/month
                </p>
                <p className="text-sm font-medium">
                  $
                  {groupMembers.filter((m) => m.coverageType === 'Base Plan')
                    .length * partnerGroup.settings.basePlanPrice}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <h3 className="font-semibold">Silver Plan</h3>
                <p className="text-primary text-2xl font-bold">
                  {
                    groupMembers.filter((m) => m.coverageType === 'Silver Plan')
                      .length
                  }
                </p>
                <p className="text-muted-foreground text-sm">
                  @ ${partnerGroup.settings.silverPlanPrice}/month
                </p>
                <p className="text-sm font-medium">
                  $
                  {groupMembers.filter((m) => m.coverageType === 'Silver Plan')
                    .length * partnerGroup.settings.silverPlanPrice}
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <h3 className="font-semibold">Gold Plan</h3>
                <p className="text-primary text-2xl font-bold">
                  {
                    groupMembers.filter((m) => m.coverageType === 'Gold Plan')
                      .length
                  }
                </p>
                <p className="text-muted-foreground text-sm">
                  @ ${partnerGroup.settings.goldPlanPrice}/month
                </p>
                <p className="text-sm font-medium">
                  $
                  {groupMembers.filter((m) => m.coverageType === 'Gold Plan')
                    .length * partnerGroup.settings.goldPlanPrice}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Total Monthly Charges:
                </span>
                <span className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{invoice.id}</h3>
                    <p className="text-muted-foreground text-sm">
                      Issued: {formatDate(invoice.date)} • Due:{' '}
                      {formatDate(invoice.dueDate)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {invoice.members} members covered
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold">
                      ${invoice.amount.toLocaleString()}
                    </div>
                    <Badge variant={getStatusBadgeVariant(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <CreditCard className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">•••• •••• •••• 4242</h3>
                <p className="text-muted-foreground text-sm">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline">Update Payment Method</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Alerts */}
      {billingData?.status === 'overdue' && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Payment Overdue</span>
            </CardTitle>
            <CardDescription>
              Your payment is overdue. Please update your payment method to
              avoid service interruption.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Pay Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
