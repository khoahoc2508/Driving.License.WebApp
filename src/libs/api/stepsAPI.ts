import axiosInstance from '../axios'
import type { GetStepsQueryParams } from '@/types/stepsTypes'

const GetStepsByRegistrationRecordId = async (params: GetStepsQueryParams) => {
  return await axiosInstance.get('/api/steps', {
    params: {
      RegistrationRecordId: params.registrationRecordId
    }
  })
}

const stepsAPI = {
  GetStepsByRegistrationRecordId
}

export default stepsAPI
