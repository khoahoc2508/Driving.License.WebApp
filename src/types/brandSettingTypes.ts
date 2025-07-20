import { components } from '@/libs/api/client/schema'

export type UpsertBrandSettingCommand = components['schemas']['UpsertBrandSettingCommand']
export type BrandSettingDto = components['schemas']['BrandSettingDto']
export type GetBrandSettingByOwnerIdQueryParams = {
  ownerId: string | null
}
