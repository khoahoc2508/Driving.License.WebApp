import axiosInstance from '../axios'
import type {
  GetStepByStepIdOverviewQueryParams,
  GetStepsQueryParams,
  GetTaskByStepIdQueryParams,
  UpdateTaskCommand,
  BaseResponseOfListOfTaskActionTemplateDto,
  BaseResponseOfGetTaskDto,
  BaseResponseOfListOfStepActionTemplateDto,
  BaseResponseOfGetStepDto
} from '@/types/stepsTypes'

const GetStepsByRegistrationRecordId = async (params: GetStepsQueryParams) => {
  return await axiosInstance.get('/api/steps', {
    params: {
      RegistrationRecordId: params.registrationRecordId
    }
  })
}

const GetStepByStepIdOverview = async (params: GetStepByStepIdOverviewQueryParams) => {
  return await axiosInstance.get(`/api/steps/${params.id}/overview`)
}

const GetStepActionsByStepId = async (stepId: string) => {
  return await axiosInstance.get<BaseResponseOfListOfStepActionTemplateDto>(`/api/steps/${stepId}/actions`)
}

const CreateStepFromTemplate = async (data: { stepTemplateId: string; recordRegistrationId: string }) => {
  return await axiosInstance.post<BaseResponseOfGetStepDto>(`/api/steps/create-from-template`, data)
}

// task

const GetTaskByStepId = async (params: GetTaskByStepIdQueryParams) => {
  return await axiosInstance.get(`/api/tasks/all`, {
    params: {
      StepId: params.id
    }
  })
}

const UpdateStepFieldInline = async (data: {
  stepId: string
  stepFieldInstanceSubmissions: { stepFieldTemplateConfigId: string; value: string }[]
}) => {
  return await axiosInstance.put(`/api/steps/${data.stepId}`, {
    stepFieldInstanceSubmissions: data.stepFieldInstanceSubmissions
  })
}

const ForceCompleteStep = async (stepId: string, isForceCompleted: boolean) => {
  return await axiosInstance.put(`/api/steps/${stepId}/force-complete`, {
    isForceCompleted
  })
}

const GetTaskActionsByStepId = async (stepId: string) => {
  return await axiosInstance.get<BaseResponseOfListOfTaskActionTemplateDto>('/api/tasks/actions', {
    params: {
      StepId: stepId
    }
  })
}

const CreateTaskFromTemplate = async (data: { taskTemplateId: string; stepId: string }) => {
  return await axiosInstance.post<BaseResponseOfGetTaskDto>('/api/tasks/create-from-template', data)
}

const UpdateTask = async (id: string, data: UpdateTaskCommand) => {
  return await axiosInstance.put(`/api/tasks/${id}`, data)
}

const DeleteTask = async (id: string) => {
  return await axiosInstance.delete(`/api/tasks/${id}`)
}

const stepsAPI = {
  GetStepsByRegistrationRecordId,
  GetStepByStepIdOverview,
  GetStepActionsByStepId,
  CreateStepFromTemplate,
  GetTaskByStepId,
  GetTaskActionsByStepId,
  CreateTaskFromTemplate,
  UpdateTask,
  DeleteTask,
  UpdateStepFieldInline,
  ForceCompleteStep
}

export default stepsAPI
