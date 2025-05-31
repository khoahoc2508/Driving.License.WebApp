import type {
  GetExamSchedulesWithPaginationQueryParams,
  CreateExamScheduleCommandType,
  DeleteExamScheduleCommandType,
  UpdateExamScheduleCommandType
} from '@/types/examScheduleTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

// Exam Schedules API calls
const getExamSchedules = async (params: GetExamSchedulesWithPaginationQueryParams) => {
  return await axiosInstance.get('/api/exam/schedules', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const getExamScheduleById = async (id: string) => {
  return await axiosInstance.get(`/api/exam/schedules/${id}`)
}

const createExamSchedule = async (data: CreateExamScheduleCommandType) => {
  return await axiosInstance.post('/api/exam/schedules', data)
}

const updateExamSchedule = async (data: UpdateExamScheduleCommandType) => {
  return await axiosInstance.put('/api/exam/schedules', data)
}

const deleteExamSchedule = async (id: string) => {
  const data: DeleteExamScheduleCommandType = { id }

  return await axiosInstance.delete('/api/exam/schedules', {
    data
  })
}

const ExamScheduleAPI = {
  // Exam Schedules
  getExamSchedules,
  getExamScheduleById,
  createExamSchedule,
  updateExamSchedule,
  deleteExamSchedule
}

export default ExamScheduleAPI
