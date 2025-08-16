import type { components } from '@/libs/api/client/schema'

export type GetRegistrationRecordsDto = components['schemas']['GetRegistrationRecordsDto']
export type GetRegistrationRecordsListType = components['schemas']['PaginatedListOfGetRegistrationRecordsDto']['data']
export type CreateRegistrationRecordCommand = components['schemas']['CreateRegistrationRecordCommand']
export type UpdateRegistrationRecordCommand = components['schemas']['UpdateRegistrationRecordCommand']
export type RegistrationRecordStatus = components['schemas']['RegistrationRecordStatus']
export type PaymentStatus = components['schemas']['PaymentStatus']
export type GetRegistrationRecordsQueryParams = {
  licenseTypeCode?: string[]
  registrationRecordStatus?: RegistrationRecordStatus[]
  paymentStatus?: PaymentStatus[]
  staffAssigneeId?: string[]
  collaboratorId?: string[] | null
  search?: string | null
  pageNumber?: number
  pageSize?: number
}
