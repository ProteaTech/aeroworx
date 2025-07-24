'use client'

import type * as React from 'react'
import {
  BarChart3,
  Building2,
  CreditCard,
  Home,
  Settings,
  UserPlus,
  Shield,
  LogOut,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/firebase/auth'
import { toast } from 'sonner'

// Navigation items based on user role
const getNavigationItems = (userRole?: string) => {
  const baseItems = [
    {
      title: 'Overview',
      url: '/admin',
      icon: Home,
    },
    {
      title: 'Partners Groups',
      url: '/admin/partners',
      icon: Building2,
    },
    {
      title: 'Add Partner',
      url: '/admin/partners/add',
      icon: UserPlus,
    },
    {
      title: 'Analytics',
      url: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: UserPlus,
    },
    {
      title: 'Incidents',
      url: '/admin/incidents',
      icon: BarChart3,
    },
    {
      title: 'Billing',
      url: '/admin/billing',
      icon: CreditCard,
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings,
    },
  ]

  // Super admin gets additional items
  if (userRole === 'superAdmin') {
    return [...baseItems]
  }

  return baseItems
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user, userData } = useAuth()

  const navigationItems = getNavigationItems(userData?.role)

  const handleSignOut = async () => {
    try {
      await signOut({ redirectTo: '/login' })
      toast.success('Signed out successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to sign out')
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-18 border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="text-primary h-8 w-8" />
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-semibold">
              AeroWorx
            </span>
            <span className="text-sidebar-foreground/70 text-xs">
              Emergency Services
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <div className="space-y-2 p-4">
          <div className="text-sm">
            <p className="text-sidebar-foreground font-medium">
              {userData?.firstName} {userData?.lastName}
            </p>
            <p className="text-sidebar-foreground/70 text-xs">{user?.email}</p>
            <p className="text-sidebar-foreground/50 text-xs capitalize">
              {userData?.role || 'User'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start bg-transparent"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
