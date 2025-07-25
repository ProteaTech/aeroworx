'use client'

import React from 'react'

import { useAuth } from '@/contexts/auth-context'
import { PartnerSidebar } from '@/components/partner-sidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ThemeToggle } from '@/components/theme-toggle'
import { useParams, usePathname } from 'next/navigation'
import mockData from '@/lib/mock-data.json'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PartnerGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { loading } = useAuth()
  const params = useParams()
  const pathname = usePathname()
  const groupName = params.groupName as string

  // Find the partner group
  const partnerGroup = mockData.partnerGroups.find(
    (group) => group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  )

  // Generate breadcrumbs
  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1

    let title = segment
    if (index === 0) {
      title = partnerGroup?.name || segment
    } else {
      title = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    return {
      href,
      title,
      isLast,
    }
  })

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  if (!partnerGroup) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Partner Group Not Found</h1>
          <p className="text-muted-foreground">
            The requested partner group does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <PartnerSidebar variant="inset" partnerGroup={partnerGroup} />
      <SidebarInset>
        <header className="flex h-18 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.href}>
                  <BreadcrumbItem>
                    {breadcrumb.isLast ? (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!breadcrumb.isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <span className="ml-auto flex space-x-2">
            <Button asChild variant={'outline'}>
              <Link href={'/admin'}>Admin</Link>
            </Button>
            <ThemeToggle />
          </span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
