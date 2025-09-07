import type { components } from '@/libs/api/client/schema'

export type CreateExamCenterCommand = components['schemas']['CreateExamCenterCommand']
export type UpdateExamCenterCommand = components['schemas']['UpdateExamCenterCommand']
export type GetExamCentersDto = components['schemas']['GetExamCentersDto']
export type GetExamCenterDetailDto = components['schemas']['GetExamCenterDetailDto']
export type ExamCenterListType = components['schemas']['PaginatedListOfGetExamCentersDto']['data']

export type GetExamCentersQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
