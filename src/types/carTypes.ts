import type { components } from '@/libs/api/client/schema'

export type CreateCarCommand = components['schemas']['CreateCarCommand']
export type UpdateCarCommand = components['schemas']['UpdateCarCommand']
export type GetCarsDto = components['schemas']['GetCarsDto']
export type GetCarDetailDto = components['schemas']['GetCarDetailDto']
export type CarListType = components['schemas']['PaginatedListOfGetCarsDto']['data']

export type GetCarsQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
