'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import mockData from '@/lib/mock-data.json'

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const partners = mockData.partnerGroups

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalPartners = partners.length
  const activePartners = partners.filter((p) => p.isActive).length
  const totalMembers = mockData.members.length
  const totalRevenue = mockData.analytics.global.totalRevenue

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Partners
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPartners}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Partners
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePartners}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">100%</span> active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMembers.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+12%</span> from last month
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
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">+15%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Partners Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Partner Organizations</CardTitle>
              <CardDescription>
                Manage partner organizations and their configurations
              </CardDescription>
            </div>
            <Link href="/admin/partners/add">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Partners List */}
            <div className="space-y-4">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                      <Building2 className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {partner.contactEmail}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {partner.contactPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {
                          mockData.members.filter(
                            (m) => m.partnerGroupId === partner.id
                          ).length
                        }{' '}
                        members
                      </p>
                      <Badge
                        variant={partner.isActive ? 'default' : 'secondary'}
                      >
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Partner
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Members
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Partner
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
