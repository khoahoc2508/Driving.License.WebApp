import type { components } from '@/libs/api/client/schema'

export type GetRegistrationRecordsDto = components['schemas']['GetRegistrationRecordsDto']
export type GetRegistrationRecordsListType = components['schemas']['PaginatedListOfGetRegistrationRecordsDto']['data']
export type CreateRegistrationRecordCommand = components['schemas']['CreateRegistrationRecordCommand']
export type UpdateRegistrationRecordCommand = components['schemas']['UpdateRegistrationRecordCommand']
export type ApproveRegistrationRecordCommand = components['schemas']['ApproveRegistrationRecordCommand']
export type RegistrationRecordStatus = components['schemas']['RegistrationRecordStatus']
export type GenderType = components['schemas']['GenderType']
export type PaymentStatus = components['schemas']['PaymentStatus']
export type GetRegistrationRecordsQueryParams = {
  licenseTypeCode?: string[]
  status?: RegistrationRecordStatus[]
  paymentStatus?: PaymentStatus[]
  staffAssigneeId?: string[]
  collaboratorId?: string[] | null
  search?: string | null
  pageNumber?: number
  pageSize?: number
}

// view
export type RegistrationRecordBasicInfoDto = components['schemas']['RegistrationRecordBasicInfoDto']

// overview
export type RegistrationRecordOverviewDto = components['schemas']['RegistrationRecordOverviewDto']

// detail
export type GetRegistrationRecordDetailDto = components['schemas']['GetRegistrationRecordDetailDto']

// overview sub-types
export type ProcessingDto = components['schemas']['ProcessingDto']
export type ProcessingStepDto = components['schemas']['ProcessingStepDto']
export type StepStatusType = components['schemas']['StepStatusType']
export type ExamResultStatusType = components['schemas']['ExamResultStatusType']
export type PaymentSummaryDto = components['schemas']['PaymentSummaryDto']
export type GeneralInfoDto = components['schemas']['GeneralInfoDto']
export type CollaboratorDto = components['schemas']['CollaboratorDto']

// payments
export type GetPaymentDto = components['schemas']['GetPaymentDto']
export type GetPaymentListType = components['schemas']['BaseResponseOfListOfGetPaymentDto']['data']
export type GetPaymentDetailDto = components['schemas']['GetPaymentDetailDto']
export type CreatePaymentCommand = components['schemas']['CreatePaymentCommand']
export type UpdatePaymentCommand = components['schemas']['UpdatePaymentCommand']

// payment histories
export type GetPaymentHistoryDto = components['schemas']['GetPaymentHistoryDto']
export type GetPaymentHistoryDetailDto = components['schemas']['GetPaymentHistoryDetailDto']
export type CreatePaymentHistoryCommand = components['schemas']['CreatePaymentHistoryCommand']
export type UpdatePaymentHistoryCommand = components['schemas']['UpdatePaymentHistoryCommand']
