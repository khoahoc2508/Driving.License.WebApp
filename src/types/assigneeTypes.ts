import type { components } from '@/libs/api/client/schema'

export type UpsertAssigneeCommand = components['schemas']['UpsertAssigneeCommand']
export type AssigneeListType = components['schemas']['PaginatedListOfAssigneeDto']['data']
export type AssigneeDto = components['schemas']['AssigneeDto']
export type AssigneeType = components['schemas']['AssigneeType']
export type GetAssigneesQueryParams = {
  assigneeType?: AssigneeType
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
