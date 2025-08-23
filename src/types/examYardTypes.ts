import type { components } from '@/libs/api/client/schema'

export type CreateExamYardCommand = components['schemas']['CreateExamYardCommand']
export type UpdateExamYardCommand = components['schemas']['UpdateExamYardCommand']
export type GetExamYardsDto = components['schemas']['GetExamYardsDto']
export type GetExamYardDetailDto = components['schemas']['GetExamYardDetailDto']
export type ExamYardListType = components['schemas']['PaginatedListOfGetExamYardsDto']['data']

export type GetExamYardsQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
