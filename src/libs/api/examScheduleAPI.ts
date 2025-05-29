import type { GetExamSchedulesWithPaginationQueryParams, CreateExamScheduleCommandType } from '@/types/examScheduleTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

// Exam Schedules API calls
const getExamSchedules = async (params: GetExamSchedulesWithPaginationQueryParams) => {
  return await axiosInstance.get('/api/exam/schedules', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const createExamSchedule = async (data: CreateExamScheduleCommandType) => {
  return await axiosInstance.post('/api/exam/schedules', data)
}

const ExamScheduleAPI = {
  // Exam Schedules
  getExamSchedules,
  createExamSchedule
}

export default ExamScheduleAPI
