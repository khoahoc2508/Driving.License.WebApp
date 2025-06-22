import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const GetExamsByGroups = async (groupId: string) => {
  return await axiosInstance.get(`/api/exams/by-group/${groupId}`, {
    paramsSerializer: customParamsSerializer
  })
}

const getQuestionsByExam = async (examId: string) => {
  return await axiosInstance.get(`/api/questions/by-exam/${examId}`)
}

const ExamAPI = {
  GetExamsByGroups,
  getQuestionsByExam
}

export default ExamAPI
