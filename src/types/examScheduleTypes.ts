
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
  licenseTypes?: components['schemas']['LicenseType'][]
}

// Basic Exam Schedule Types
export type ExamScheduleType = components['schemas']['ExamScheduleVm']

// Paginated List Types
export type PaginatedListOfExamScheduleType = components['schemas']['PaginatedListOfExamScheduleVm']

// API Response Types
export type ExamSchedulesWithPaginationResponse = {
  data?: ExamScheduleType[]
  pageNumber?: number
  totalPages?: number
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

// API Request Types for Exam Schedules
export type CreateExamScheduleCommandType = components['schemas']['CreateExamScheduleCommand']
export type UpdateExamScheduleCommandType = components['schemas']['UpdateExamScheduleCommand']
export type DeleteExamScheduleCommandType = components['schemas']['DeleteExamScheduleCommand']

// API Response Base Type
export type BaseResponseType = components['schemas']['BaseResponse']
export type BaseResponseOfStringType = components['schemas']['BaseResponseOfString']
