import type { components } from '@/libs/api/client/schema'

export type GetExamSchedulesWithPaginationQueryParams = {
  pageNumber?: number
  pageSize?: number
  search?: string | null
  hasAvailableSlots?: boolean | null
  examAddressIds?: string[]
  fromDate?: string
  toDate?: string
  limitTypes?: components['schemas']['LimitType'][]
  licenseTypeCodes?: string[]
}

// Basic Exam Schedule Types
export type ExamScheduleType = components['schemas']['ExamScheduleVm']

// Paginated List Types
export type PaginatedListOfExamScheduleType = components['schemas']['PaginatedListOfExamScheduleVm']

// API Request Types for Exam Schedules
export type ExamScheduleByIdType = components["schemas"]["ExamScheduleById"]
export type CreateExamScheduleCommandType = components['schemas']['CreateExamScheduleCommand']
export type UpdateExamScheduleCommandType = components['schemas']['UpdateExamScheduleCommand']
export type DeleteExamScheduleCommandType = components['schemas']['DeleteExamScheduleCommand']

// API Request Types for Exam Schedule Registrations
export type SetExamScheduleForLicenseRegistrationCommandType = components['schemas']['SetExamScheduleForLicenseRegistrationCommand']
export type RemoveExamScheduleForLicenseRegistrationCommandType = components['schemas']['RemoveExamScheduleForLicenseRegistrationCommand']
export type SetExamScheduleForBulkLicenseRegistrationsCommandType = components['schemas']['SetExamScheduleForBulkLicenseRegistrationsCommand']

// API Response Base Type
export type BaseResponseType = components['schemas']['BaseResponse']
export type BaseResponseOfStringType = components['schemas']['BaseResponseOfString']
