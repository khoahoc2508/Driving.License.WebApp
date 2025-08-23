import type { components } from '@/libs/api/client/schema'

export type GetStepsDto = components['schemas']['GetStepsDto']
export type StepStatusType = components['schemas']['StepStatusType']
export type StepsListType = components['schemas']['GetStepsDto'][]

export type GetStepsQueryParams = {
  registrationRecordId: string
}
