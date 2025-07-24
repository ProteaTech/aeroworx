import type { Timestamp } from 'firebase/firestore'

/** Admin user */
export interface User {
  uid: string
  firstName: string
  lastName: string
  email: string
  role?: 'admin' | 'superAdmin' | 'partnerAdmin'
  partnerGroupId?: string // Only for partnerAdmin users
  createdAt?: Timestamp
  lastLogin?: Timestamp
}

/** Partner Group/Organization */
export interface PartnerGroup {
  id: string
  name: string
  contactEmail: string
  contactPhone?: string
  address?: string
  logoUrl?: string
  isActive: boolean
  createdAt: Timestamp
  adminIds: string[] // UIDs of partner admins
  settings: PartnerGroupSettings
}

export interface PartnerGroupSettings {
  basePlanPrice: number // per person per month
  silverPlanPrice: number
  goldPlanPrice: number
  defaultCurrency: string
  timezone: string
  allowSelfRegistration: boolean
}

/** Member of a partner group */
export interface Member {
  id: string
  partnerGroupId: string
  name: string
  dateOfBirth: Date
  nationality: string
  countryOfResidence: string
  destination: string
  startDate: Date
  endDate: Date
  daysOfTravel: number
  coverageType: 'Base Plan' | 'Silver Plan' | 'Gold Plan'
  monthlyRate: number
  totalCost: number
  isActive: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

/** Analytics data structures */
export interface DashboardAnalytics {
  totalMembers: number
  activeMembers: number
  totalRevenue: number
  monthlyRevenue: number
  membersByRegion: RegionData[]
  membersByPlan: PlanData[]
  revenueByMonth: MonthlyRevenue[]
  memberGrowth: MemberGrowthData[]
}

export interface RegionData {
  region: string
  count: number
  percentage: number
}

export interface PlanData {
  plan: 'Base Plan' | 'Silver Plan' | 'Gold Plan'
  count: number
  revenue: number
  percentage: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  members: number
}

export interface MemberGrowthData {
  month: string
  newMembers: number
  totalMembers: number
}

/** Billing and Invoice data */
export interface BillingData {
  partnerGroupId: string
  partnerGroupName: string
  currentMembers: number
  forecastedRevenue: number
  lastBillingDate: Date
  nextBillingDate: Date
  status: 'current' | 'overdue' | 'pending'
}

/** Post and related interfaces (keeping existing) */
export interface Post {
  id: string
  title: string
  content: string
  imageUrls: string[]
  videos: Video[]
  links: PostLink[]
  postedAt: Timestamp
  authorName: string
  authorImageUrl: string
  likes?: number
}

export interface Video {
  url: string
  title?: string
  thumbnail?: string
}

export interface PostLink {
  url: string
  title: string
  description?: string
  imageUrl?: string
}

/** CSV Upload structure */
export interface CSVMemberData {
  name: string
  dateOfBirth: string
  nationality: string
  countryOfResidence: string
  destination: string
  startDate: string
  endDate: string
  coverageType: 'Base Plan' | 'Silver Plan' | 'Gold Plan'
}
