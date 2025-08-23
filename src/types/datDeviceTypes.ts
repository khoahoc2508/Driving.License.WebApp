import type { components } from '@/libs/api/client/schema'

export type CreateDATDeviceCommand = components['schemas']['CreateDATDeviceCommand']
export type UpdateDATDeviceCommand = components['schemas']['UpdateDATDeviceCommand']
export type GetDATDevicesDto = components['schemas']['GetDATDevicesDto']
export type GetDATDeviceDetailDto = components['schemas']['GetDATDeviceDetailDto']
export type DATDeviceListType = components['schemas']['PaginatedListOfGetDATDevicesDto']['data']
export type GetAllDATDevicesDto = components['schemas']['GetAllDATDevicesDto']

export type GetDATDevicesQueryParams = {
  search?: string
  pageNumber?: number
  pageSize?: number
  active?: boolean | null
}
