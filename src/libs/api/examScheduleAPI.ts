import type {
  GetExamSchedulesWithPaginationQueryParams,
  CreateExamScheduleCommandType,
  DeleteExamScheduleCommandType,
  UpdateExamScheduleCommandType,
  SetExamScheduleForLicenseRegistrationCommandType,
  RemoveExamScheduleForLicenseRegistrationCommandType,
  SetExamScheduleForBulkLicenseRegistrationsCommandType
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

// Exam Schedule Registration API calls
const setExamScheduleForLicenseRegistration = async (data: SetExamScheduleForLicenseRegistrationCommandType) => {
  return await axiosInstance.put('/api/exam/schedules/registrations', data)
}

const removeExamScheduleForLicenseRegistration = async (data: RemoveExamScheduleForLicenseRegistrationCommandType) => {
  return await axiosInstance.delete('/api/exam/schedules/registrations', {
    data
  })
}

const setExamScheduleForBulkLicenseRegistrations = async (data: SetExamScheduleForBulkLicenseRegistrationsCommandType) => {
  return await axiosInstance.put('/api/exam/schedules/registrations/bulk', data)
}

const ExamScheduleAPI = {
  // Exam Schedules
  getExamSchedules,
  getExamScheduleById,
  createExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
  
  // Exam Schedule Registrations
  setExamScheduleForLicenseRegistration,
  removeExamScheduleForLicenseRegistration,
  setExamScheduleForBulkLicenseRegistrations
}

export default ExamScheduleAPI
