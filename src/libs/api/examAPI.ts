import type { GenerateRandomExamsCommand, GenerateRandomExamByCategoryCommand } from '@/types/exam'
import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const GetExamsByGroups = async (groupId: string) => {
  return await axiosInstance.get(`/api/exams/by-group/${groupId}`, {
    paramsSerializer: customParamsSerializer
  })
}

const GenerateRandomExam = async (data: GenerateRandomExamsCommand) => {
  return await axiosInstance.post('/api/exams/generate-random-exam', data)
}

const GenerateRandomExamByCategory = async (data: GenerateRandomExamByCategoryCommand) => {
  return await axiosInstance.post('/api/exams/generate-random-exam-by-category', data)
}

const ExamAPI = {
  GetExamsByGroups,
  GenerateRandomExam,
  GenerateRandomExamByCategory
}

export default ExamAPI
