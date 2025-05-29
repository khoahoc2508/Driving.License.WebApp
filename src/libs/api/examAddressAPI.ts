import type { GetExamAddressesWithPaginationQueryParams, CreateExamAddressCommandType } from '@/types/examAddressTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

// Exam Addresses API calls
const getExamAddresses = async (params: GetExamAddressesWithPaginationQueryParams) => {
  return await axiosInstance.get('/api/exam/addresses', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const createExamAddress = async (fullAddress: string) => {
  return await axiosInstance.post('/api/exam/addresses', null, {
    params: { FullAddress: fullAddress }
  })
}

const ExamAddressAPI = {
  getExamAddresses,
  createExamAddress
}

export default ExamAddressAPI