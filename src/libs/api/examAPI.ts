import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const GetExamsByGroups = async (groupId: string) => {
  return await axiosInstance.get(`/api/exams/by-group/${groupId}`, {
    paramsSerializer: customParamsSerializer
  })
}

const ExamAPI = {
  GetExamsByGroups
}

export default ExamAPI
