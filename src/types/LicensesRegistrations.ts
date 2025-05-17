import CONFIG from "@/configs/config"
import { components } from "@/libs/api/client/schema"


export type LicenseRegistrationType = components['schemas']['PaginatedListOfLicenseRegistrationVm']['data']
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
  hasApproved?: boolean,
}

export type getLicensesRegistrationsPaidParams = {
  pageNumber?: number
  pageSize?: number
  search?: string
  examScheduleId?: string
}

export type LicenseRegistrationCustomerResquest = components['schemas']['CreateLicenseRegistrationCommand']
