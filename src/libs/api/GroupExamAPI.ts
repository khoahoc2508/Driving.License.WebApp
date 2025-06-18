import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type { GetGroupExamsParams } from '@/types/groupExamTypes'

const getGroupExams = async (params: GetGroupExamsParams) => {
  return await axiosInstance.get('/api/group-exams', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const GroupExamAPI = {
  getGroupExams
}

export default GroupExamAPI
