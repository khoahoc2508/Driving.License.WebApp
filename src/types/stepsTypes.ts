import type { components } from '@/libs/api/client/schema'

export type GetStepsDto = components['schemas']['GetStepsDto']
export type StepStatusType = components['schemas']['StepStatusType']
export type StepsListType = components['schemas']['GetStepsDto'][]

// step actions
export type StepActionTemplateDto = components['schemas']['StepActionTemplateDto']
export type BaseResponseOfListOfStepActionTemplateDto =
  components['schemas']['BaseResponseOfListOfStepActionTemplateDto']
export type BaseResponseOfGetStepDto = components['schemas']['BaseResponseOfGetStepDto']

// tasks
export type GetTaskDto = components['schemas']['GetTaskDto']
export type UpdateTaskCommand = components['schemas']['UpdateTaskCommand']
export type TaskStatusType = components['schemas']['TaskStatusType']
export type TaskActionTemplateDto = components['schemas']['TaskActionTemplateDto']
export type BaseResponseOfListOfTaskActionTemplateDto =
  components['schemas']['BaseResponseOfListOfTaskActionTemplateDto']
export type BaseResponseOfGetTaskDto = components['schemas']['BaseResponseOfGetTaskDto']

export type StepOverviewDto = components['schemas']['StepOverviewDto']

export type GetStepByStepIdOverviewQueryParams = {
  id: string
}

export type GetStepsQueryParams = {
  registrationRecordId: string
}

export type GetTaskByStepIdQueryParams = {
  id: string
}
