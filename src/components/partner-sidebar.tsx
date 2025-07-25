'use client'

import type * as React from 'react'
import {
  BarChart3,
  Users,
  CreditCard,
  Home,
  Settings,
  Shield,
  LogOut,
  CrownIcon,
  PlusSquareIcon,
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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/firebase/auth'
import { toast } from 'sonner'
import { useParams, usePathname } from 'next/navigation'
import mockData from '@/lib/mock-data.json'
import Image from 'next/image'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type Props = React.ComponentProps<typeof Sidebar> & {
  partnerGroup: (typeof mockData)['partnerGroups'][number]
}

export function PartnerSidebar({ partnerGroup, ...props }: Props) {
  const { user, userData } = useAuth()
  const params = useParams()
  const groupName = params.groupName as string
  const pathname = usePathname()

  // Find the partner group
  // const partnerGroup = mockData.partnerGroups.find(
  //   (group) =>
  //     group.id === partnerGroupId ||
  //     group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  // )

  const navigationItems = [
    {
      title: 'Overview',
      url: `/${groupName}`,
      icon: Home,
      isActive: pathname === `/${groupName}` || pathname === `/${groupName}/`,
    },
    {
      title: 'Members',
      url: `/${groupName}/members`,
      icon: Users,
      isActive: pathname.startsWith(`/${groupName}/members`),
    },
    {
      title: 'Analytics',
      url: `/${groupName}/analytics`,
      icon: BarChart3,
      isActive: pathname.startsWith(`/${groupName}/analytics`),
    },
    {
      title: 'Billing',
      url: `/${groupName}/billing`,
      icon: CreditCard,
      isActive: pathname.startsWith(`/${groupName}/billing`),
    },
    {
      title: 'Team',
      url: `/${groupName}/team`,
      icon: Shield,
      isActive: pathname.startsWith(`/${groupName}/team`),
    },
    {
      title: 'Settings',
      url: `/${groupName}/settings`,
      icon: Settings,
      isActive: pathname.startsWith(`/${groupName}/settings`),
    },
  ]

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
          <Image
            src={partnerGroup?.logoUrl}
            alt={`${partnerGroup?.name} Logo`}
            className="size-8 rounded-lg object-cover"
            height={32}
            width={32}
          />
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-semibold">
              {partnerGroup?.name || 'Partner Dashboard'}
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
                  <SidebarMenuButton asChild isActive={item.isActive}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.url === `/${groupName}/members` && (
                    <SidebarMenuAction asChild>
                      <Link href={`/${groupName}/members/add`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <PlusSquareIcon className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add new member</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="sr-only">Add Member</span>
                      </Link>
                    </SidebarMenuAction>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Access */}
        <SidebarGroup>
          <SidebarGroupLabel>Admin Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin">
                    <CrownIcon className="h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
