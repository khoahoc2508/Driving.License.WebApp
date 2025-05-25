// import { components } from '@/libs/api/client/schema'

// // Basic Exam Schedule Types
// export type ExamScheduleType = components['schemas']['ExamScheduleVm']
// export type ExamScheduleByIdType = components['schemas']['ExamScheduleById']
// export type ExamAddressType = components['schemas']['ExamAddressVm']

// // Paginated List Types
// export type PaginatedListOfExamScheduleType = components['schemas']['PaginatedListOfExamScheduleVm']
// export type PaginatedListOfExamAddressType = components['schemas']['PaginatedListOfExamAddressVm']

// // Command Types for API Requests
// export type CreateExamScheduleCommandType = components['schemas']['CreateExamScheduleCommand']
// export type UpdateExamScheduleCommandType = components['schemas']['UpdateExamScheduleCommand']
// export type DeleteExamScheduleCommandType = components['schemas']['DeleteExamScheduleCommand']
// export type UpdateResultsForExamScheduleCommandType = components['schemas']['UpdateResultsForExamScheduleCommand']
// export type UpdateLicenseRegistrationResultsType = components['schemas']['UpdateLicenseRegistrationResults']

// // Registration Related Types
// export type SetExamScheduleForBulkLicenseRegistrationsCommandType = components['schemas']['SetExamScheduleForBulkLicenseRegistrationsCommand']
// export type SetExamScheduleForLicenseRegistrationCommandType = components['schemas']['SetExamScheduleForLicenseRegistrationCommand']
// export type RemoveExamScheduleForLicenseRegistrationCommandType = components['schemas']['RemoveExamScheduleForLicenseRegistrationCommand']

// // Simplified Exam Schedule Type (used in other contexts)
// export type ExamScheduleSimpleType = components['schemas']['ExamScheduleHasPaidForAllVm']

// // Enum Types
// export type LimitType = components['schemas']['LimitType']

// // Response Types
// export type BaseResponseType = components['schemas']['BaseResponse']
// export type BaseResponseOfExamScheduleByIdType = components['schemas']['BaseResponseOfExamScheduleById']
// export type BaseResponseOfStringType = components['schemas']['BaseResponseOfString']

// // Query Parameter Types
// export type GetExamSchedulesQueryParams = {
//   pageNumber?: number
//   pageSize?: number
//   search?: string | null
//   hasAvailableSlots?: boolean | null
// }

// export type GetExamAddressesQueryParams = {
//   pageNumber?: number
//   pageSize?: number
// }

// // Exam Registration Type
// export type ExamRegistrationType = components['schemas']['ExamRegistrationHasPaidForAllVm']

// // Exam Status Types (for UI display)
// export enum ExamStatus {
//   Upcoming = 'upcoming',
//   InProgress = 'inProgress',
//   Completed = 'completed',
//   Cancelled = 'cancelled'
// }

// // Exam Result Types
// export enum ExamResultStatus {
//   Passed = 'passed',
//   Failed = 'failed',
//   NotTaken = 'notTaken',
//   Pending = 'pending'
// }

// // Helper type for exam schedule with additional UI properties
// export type ExamScheduleWithUIProps = ExamScheduleType & {
//   status?: ExamStatus
//   availableSlots?: number
//   isFull?: boolean
// }
