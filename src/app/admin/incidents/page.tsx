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
import {
  AlertTriangle,
  Search,
  Eye,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
} from 'lucide-react'
import mockData from '@/lib/mock-data.json'

const incidents = mockData.incidents || []

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'in progress':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'under review':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [partnerFilter, setPartnerFilter] = useState('all')

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.partnerGroupName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      incident.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity =
      severityFilter === 'all' ||
      incident.severity.toLowerCase() === severityFilter
    const matchesStatus =
      statusFilter === 'all' ||
      incident.status.toLowerCase() === statusFilter.replace('_', ' ')
    const matchesPartner =
      partnerFilter === 'all' || incident.partnerGroupId === partnerFilter

    return matchesSearch && matchesSeverity && matchesStatus && matchesPartner
  })

  const stats = {
    total: incidents.length,
    critical: incidents.filter((i) => i.severity === 'Critical').length,
    inProgress: incidents.filter((i) => i.status === 'In Progress').length,
    resolved: incidents.filter((i) => i.status === 'Resolved').length,
    totalClaimAmount: incidents.reduce((sum, i) => sum + i.claimAmount, 0),
    totalApprovedAmount: incidents.reduce(
      (sum, i) => sum + (i.approvedAmount || 0),
      0
    ),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Incidents Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage incidents across all partner groups
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {/* Total Incidents */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Incidents
            </CardTitle>
            <AlertTriangle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        {/* Critical */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.critical}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>

        {/* Resolved */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
          </CardContent>
        </Card>

        {/* Total Claims */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-2xl font-bold">
              ${stats.totalClaimAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="flex h-full flex-col">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="flex flex-1 items-end justify-center">
            <div className="text-foreground text-2xl font-bold">
              ${stats.totalApprovedAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
              </SelectContent>
            </Select>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                <SelectItem value="pg1">Magnus</SelectItem>
                <SelectItem value="pg2">Discovery</SelectItem>
                <SelectItem value="pg3">Asia Pacific Coverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {incident.incidentType}
                    </CardTitle>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="font-medium">{incident.memberName}</span>
                    <span>•</span>
                    <span>{incident.partnerGroupName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {incident.location}
                    </span>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {incident.description}
                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">
                      REPORTED
                    </p>
                    <p className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(incident.dateReported).toLocaleDateString()}
                    </p>
                  </div>

                  {incident.dateResolved && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        RESOLVED
                      </p>
                      <p className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(incident.dateResolved).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium">
                      CLAIM AMOUNT
                    </p>
                    <p className="text-sm font-medium">
                      ${incident.claimAmount.toLocaleString()}
                    </p>
                  </div>

                  {incident.approvedAmount && (
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        APPROVED
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        ${incident.approvedAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-2">
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span className="font-medium">
                      Assigned to: {incident.assignedTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {incident.contactInfo}
                    </span>
                  </div>
                  {incident.notes && (
                    <div className="text-muted-foreground max-w-md truncate text-xs">
                      Note: {incident.notes}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No incidents found</h3>
            <p className="text-muted-foreground text-center">
              No incidents match your current filters. Try adjusting your search
              criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
