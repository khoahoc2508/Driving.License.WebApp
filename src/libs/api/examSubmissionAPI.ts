import type { CreateExamSubmissionCommand, SubmitExamPayload } from '@/types/examSubmissionTypes'
import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const GetExamsByGroups = async () => {
  return await axiosInstance.get(`/api/examsubmissions/start-exam`, {
    paramsSerializer: customParamsSerializer
  })
}

const startExam = async (examId: string) => {
  const payload: CreateExamSubmissionCommand = {
    examId: examId
  }

  return await axiosInstance.post('/api/examsubmissions/start-exam', payload)
}

const submitExam = async (payload: SubmitExamPayload) => {
  return await axiosInstance.post('/api/examsubmissions/submit', payload)
}

const ExamSubmissionAPI = {
  GetExamsByGroups,
  startExam,
  submitExam
}

export default ExamSubmissionAPI
