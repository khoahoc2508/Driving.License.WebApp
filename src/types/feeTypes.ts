import type { components } from '@/libs/api/client/schema'

export type UpsertFeeTypeCommand = components['schemas']['UpsertFeeTypeCommand']
export type FeeTypeListType = components['schemas']['PaginatedListOfFeeTypeDto']['data']
export type FeeTypeDto = components['schemas']['FeeTypeDto']
export type GetFeeTypesQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
