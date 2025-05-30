import type { components } from '@/libs/api/client/schema'

export type GetExamAddressesWithPaginationQueryParams = {
  pageNumber?: number
  pageSize?: number
}

// Basic Exam Address Types
export type ExamAddressType = components['schemas']['ExamAddressVm']

// Paginated List Types
export type PaginatedListOfExamAddressType = components['schemas']['PaginatedListOfExamAddressVm']

// API Response Types
export type ExamAddressesWithPaginationResponse = {
  data?: ExamAddressType[]
  pageNumber?: number
  totalPages?: number
  totalCount?: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

// API Request Types for Exam Addresses
export type CreateExamAddressCommandType = {
  fullAddress: string
}

// API Response Base Type
export type BaseResponseType = components['schemas']['BaseResponse']
export type BaseResponseOfStringType = components['schemas']['BaseResponseOfString']