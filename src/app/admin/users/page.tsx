'use client'

import { useState } from 'react'
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
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

// Mock admin users data
const mockAdminUsers = [
  {
    id: 'admin1',
    firstName: 'Graham',
    lastName: 'Lambert',
    email: 'graham@aeroworx.co',
    role: 'superAdmin',
    partnerGroupId: null,
    isActive: true,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    profilePhoto:
      'https://aeroworx-1d7a9.kxcdn.com/wp-content/uploads/2022/08/graham-lambert.jpg',
  },
  {
    id: 'admin2',
    firstName: 'Gravens',
    lastName: 'Lambert',
    email: 'gravens@aeroworx.co',
    role: 'admin',
    partnerGroupId: 'pg1',
    isActive: true,
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-05T00:00:00Z',
    profilePhoto:
      'https://aeroworx-1d7a9.kxcdn.com/wp-content/uploads/2022/08/gravans-lambert.jpg',
  },
  {
    id: 'admin3',
    firstName: 'John',
    lastName: 'Soap',
    email: 'john.soap@aeroworx.co',
    role: 'support',
    partnerGroupId: 'pg2',
    isActive: true,
    lastLogin: '2024-01-13T09:20:00Z',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'admin4',
    firstName: 'Lisa',
    lastName: 'McTavish',
    email: 'lisa.mctavish@aeroworx.co',
    role: 'viewer',
    partnerGroupId: 'pg3',
    isActive: false,
    lastLogin: '2024-01-10T14:15:00Z',
    createdAt: '2024-01-12T00:00:00Z',
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const users = mockAdminUsers

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.isActive).length
  const inactiveUsers = users.filter((u) => !u.isActive).length
  const superAdmins = users.filter((u) => u.role === 'superAdmin').length

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superAdmin':
        return 'default'
      case 'partnerAdmin':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage admin users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              Admin and partner users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-green-600">
                {Math.round((activeUsers / totalUsers) * 100)}%
              </span>{' '}
              of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Users
            </CardTitle>
            <UserX className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers}</div>
            <p className="text-muted-foreground text-xs">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{superAdmins}</div>
            <p className="text-muted-foreground text-xs">Full system access</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>
                Manage system administrators and partner admins
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      {user.profilePhoto ? (
                        <Image
                          src={user.profilePhoto}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="rounded-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <Users className="text-primary h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {user.email}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Last login: {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="space-y-1 text-right">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === 'superAdmin'
                          ? 'Super Admin'
                          : user.role === 'partnerAdmin'
                            ? 'Partner Admin'
                            : 'Admin'}
                      </Badge>
                      {/*
                      <div>
                        <Badge
                          variant={user.isActive ? 'default' : 'secondary'}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      */}
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
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {user.isActive ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
