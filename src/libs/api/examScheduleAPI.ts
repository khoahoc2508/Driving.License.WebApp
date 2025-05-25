import type { GetExamSchedulesWithPaginationQueryParams } from '@/types/examScheduleTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

// Exam Schedules API calls
const getExamSchedules = async (params: GetExamSchedulesWithPaginationQueryParams) => {
  return await axiosInstance.get('/api/exam/schedules', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const ExamScheduleAPI = {
  // Exam Schedules
  getExamSchedules
}

export default ExamScheduleAPI
