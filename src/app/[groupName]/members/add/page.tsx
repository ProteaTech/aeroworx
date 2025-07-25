'use client'

import type React from 'react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ArrowLeft, Save, Upload, CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import mockData from '@/lib/mock-data.json'

export default function AddMemberPage() {
  const params = useParams()
  const router = useRouter()
  const groupName = params.groupName as string
  const [loading, setLoading] = useState(false)

  // Find the partner group
  const partnerGroup = mockData.partnerGroups.find(
    (group) => group.name.toLowerCase().replace(/\s+/g, '-') === groupName
  )

  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: undefined as Date | undefined,
    nationality: '',
    countryOfResidence: '',
    destination: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    coverageType: 'Base Plan' as 'Base Plan' | 'Silver Plan' | 'Gold Plan',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getPlanRate = (plan: string) => {
    if (!partnerGroup) return 0
    switch (plan) {
      case 'Base Plan':
        return partnerGroup.settings.basePlanPrice
      case 'Silver Plan':
        return partnerGroup.settings.silverPlanPrice
      case 'Gold Plan':
        return partnerGroup.settings.goldPlanPrice
      default:
        return 0
    }
  }

  const calculateMonthsOfCoverage = () => {
    if (!formData.startDate || !formData.endDate) return 0

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)

    // Calculate the number of months the coverage spans
    const startMonth = start.getMonth()
    const startYear = start.getFullYear()
    const endMonth = end.getMonth()
    const endYear = end.getFullYear()

    // Calculate total months covered
    const monthsSpanned =
      (endYear - startYear) * 12 + (endMonth - startMonth) + 1

    return monthsSpanned > 0 ? monthsSpanned : 0
  }

  const calculateCost = () => {
    const monthsOfCoverage = calculateMonthsOfCoverage()
    const monthlyRate = getPlanRate(formData.coverageType)
    return monthsOfCoverage * monthlyRate
  }

  const getDaysOfTravel = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days > 0 ? days : 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Member added successfully!')
      router.push(`/${groupName}/members`)
    } catch (error) {
      console.error('Error adding member:', error)
      toast.error('Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  if (!partnerGroup) {
    return <div>Partner group not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href={`/${groupName}/members`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Member</h1>
          <p className="text-muted-foreground">
            Add a new member to your organization
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic member details and identification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full cursor-pointer justify-start text-left font-normal',
                        !formData.dateOfBirth && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? (
                        format(formData.dateOfBirth, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) =>
                        handleInputChange('dateOfBirth', date)
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      captionLayout="dropdown"
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange('nationality', e.target.value)
                  }
                  placeholder="e.g., American, British"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="countryOfResidence">Country of Residence</Label>
                <Input
                  id="countryOfResidence"
                  value={formData.countryOfResidence}
                  onChange={(e) =>
                    handleInputChange('countryOfResidence', e.target.value)
                  }
                  placeholder="e.g., United States, United Kingdom"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Travel Information */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Information</CardTitle>
              <CardDescription>
                Travel details and coverage requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) =>
                    handleInputChange('destination', e.target.value)
                  }
                  placeholder="e.g., Thailand, Japan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          <>
                            <span className="hidden md:block">
                              {format(formData.startDate, 'PPP')}
                            </span>
                            <span className="md:hidden">
                              {format(formData.startDate, 'dd MMM yyyy')}
                            </span>
                          </>
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={formData.startDate}
                        onSelect={(date) =>
                          handleInputChange('startDate', date)
                        }
                        disabled={(date) => date < new Date()}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formData.endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="size-4 md:mr-2" />
                        {formData.endDate ? (
                          <>
                            <span className="hidden md:block">
                              {format(formData.endDate, 'PPP')}
                            </span>
                            <span className="md:hidden">
                              {format(formData.endDate, 'dd MMM yyyy')}
                            </span>
                          </>
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        selected={formData.endDate}
                        onSelect={(date) => handleInputChange('endDate', date)}
                        disabled={(date) => {
                          if (date < new Date()) {
                            return true
                          }

                          if (formData?.startDate) {
                            return date < formData?.startDate
                          }
                          return false
                        }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverageType">Coverage Plan</Label>
                <Select
                  value={formData.coverageType}
                  onValueChange={(value) =>
                    handleInputChange('coverageType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Base Plan">
                      Base Plan - ${partnerGroup.settings.basePlanPrice}/month
                    </SelectItem>
                    <SelectItem value="Silver Plan">
                      Silver Plan - ${partnerGroup.settings.silverPlanPrice}
                      /month
                    </SelectItem>
                    <SelectItem value="Gold Plan">
                      Gold Plan - ${partnerGroup.settings.goldPlanPrice}/month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cost Summary */}
              {formData.startDate && formData.endDate && (
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="mb-2 font-semibold">Cost Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Days of travel:</span>
                      <span>{getDaysOfTravel()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Months of coverage:</span>
                      <span>{calculateMonthsOfCoverage()} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly rate:</span>
                      <span>${getPlanRate(formData.coverageType)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total cost:</span>
                      <span>${calculateCost()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bulk Upload Option */}
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload</CardTitle>
            <CardDescription>
              Need to add multiple members? Upload a CSV file instead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" type="button">
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV File
            </Button>
            <p className="text-muted-foreground mt-2 text-xs">
              Download our CSV template to ensure proper formatting.
            </p>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end space-x-4">
          <Link href={`/${groupName}/members`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                Adding...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Add Member
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
