import axiosInstance from '../axios'
import type {
  GetStepByStepIdOverviewQueryParams,
  GetStepsQueryParams,
  GetTaskByStepIdQueryParams
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

const stepsAPI = {
  GetStepsByRegistrationRecordId,
  GetStepByStepIdOverview,
  GetTaskByStepId
}

export default stepsAPI
