import CONFIG from '@/configs/config'
import { components } from '@/libs/api/client/schema'

export type LicenseRegistrationType = components['schemas']['PaginatedListOfLicenseRegistrationVm']['data']
export type LicenseRegistrationTypeVm = components['schemas']['LicenseRegistrationVm']
export type LicenseType = components['schemas']['LicenseType']
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
  licenseType?: (keyof typeof CONFIG.LicenseType)[]
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
export type LicenseRegistrationUpdateResquest = components['schemas']['UpdateExamScheduleCommand']
export type LicenseRegistrationCustomerResquest = components['schemas']['CreateLicenseRegistrationCommand']
