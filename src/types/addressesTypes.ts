import type { components } from '@/libs/api/client/schema'

// Address DTOs from API schema (only available ones)
export type ProvinceDto = components['schemas']['ProvinceDto']
export type OldProvinceDto = components['schemas']['OldProvinceDto']

// Command types
export type UpsertUserWardMappingCommand = components['schemas']['UpsertUserWardMappingCommand']

// Custom types for missing DTOs (based on API structure)
export interface DistrictDto {
  id: number
  name: string
  code: string
  provinceId: number
}

export interface WardDto {
  id: number
  name: string
  code: string
  districtId: number
  provinceId: number
}

export interface OldDistrictDto {
  id: number
  name: string
  code: string
  oldProvinceId: number
}

export interface OldWardDto {
  id: number
  name: string
  code: string
  oldDistrictId: number
  oldProvinceId: number
}

export interface UserWardMappingDto {
  oldProvinceId: string
  oldDistrictId: string
  oldWardId: string
  newProvinceId: string
  newWardId: string
}

// Dropdown option type for UI
export interface DropdownOption {
  label: string
  value: string
}
