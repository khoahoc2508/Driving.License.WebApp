import axiosInstance from '../axios'
import type { GetStepByStepIdOverviewQueryParams, GetStepsQueryParams } from '@/types/stepsTypes'

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

const stepsAPI = {
  GetStepsByRegistrationRecordId,
  GetStepByStepIdOverview
}

export default stepsAPI
