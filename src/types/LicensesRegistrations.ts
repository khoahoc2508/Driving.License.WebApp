import type { components } from '@/libs/api/client/schema'

export type LicenseRegistrationType = components['schemas']['PaginatedListOfLicenseRegistrationVm']['data']
export type LicenseRegistrationTypeVm = components['schemas']['LicenseRegistrationVm']
export type LicenseTypeDto = components['schemas']['LicenseTypeDto']
export type VehicleTypeDto = components['schemas']['VehicleTypeDto']
export type LicenseRegistrationStatus = components['schemas']['LicenseRegistrationStatus']

export type LicenseRegistrationFormType = components['schemas']['LicenseRegistrationVm']

export type LicenseRegistrationPaidType =
  components['schemas']['PaginatedListOfLicenseRegistrationHasPaidForAllVm']['data']

export type GetLicensesRegistrationsParams = {
  pageNumber?: number
  pageSize?: number
  examScheduleId?: string
  isPaid?: boolean
  isExamScheduled?: boolean
  search?: string
  licenseTypeCodes?: string[]
  hasCompletedHealthCheck?: boolean[] | null
  hasApproved?: boolean[] | null
}

export type getLicensesRegistrationsPaidParams = {
  pageNumber?: number
  pageSize?: number
  search?: string
  examScheduleId?: string
}

export type LicenseRegistrationCreateResquest = components['schemas']['CreateLicenseRegistrationCommand']
export type LicenseRegistrationUpdateResquest = components['schemas']['UpdateLicenseRegistrationCommand']
export type LicenseRegistrationCustomerResquest = components['schemas']['CreateLicenseRegistrationCommand']
