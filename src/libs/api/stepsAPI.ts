import axiosInstance from '../axios'
import type {
  GetStepByStepIdOverviewQueryParams,
  GetStepsQueryParams,
  GetTaskByStepIdQueryParams,
  UpdateTaskCommand
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

const GetTaskByStepId = async (params: GetTaskByStepIdQueryParams) => {
  return await axiosInstance.get(`/api/tasks/all`, {
    params: {
      StepId: params.id
    }
  })
}

const UpdateTask = async (id: string, data: UpdateTaskCommand) => {
  return await axiosInstance.put(`/api/tasks/${id}`, data)
}

const stepsAPI = {
  GetStepsByRegistrationRecordId,
  GetStepByStepIdOverview,
  GetTaskByStepId,
  UpdateTask
}

export default stepsAPI
