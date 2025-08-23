import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type {
  GetExamCentersQueryParams,
  CreateExamCenterCommand,
  UpdateExamCenterCommand
} from '@/types/examCenterTypes'

const GetExamCenters = async (params: GetExamCentersQueryParams) => {
  return await axiosInstance.get('/api/exam-centers', {
    params: {
      Search: params.search,
      Active: params.active,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize
    },
    paramsSerializer: customParamsSerializer
  })
}

const CreateExamCenter = async (data: CreateExamCenterCommand) => {
  return await axiosInstance.post('/api/exam-centers', data)
}

const GetExamCenterById = async (id: string) => {
  return await axiosInstance.get('/api/exam-centers/' + id)
}

const UpdateExamCenter = async (data: UpdateExamCenterCommand) => {
  return await axiosInstance.put('/api/exam-centers/' + data.id, data)
}

const DeleteExamCenter = async (id: string) => {
  return await axiosInstance.delete('/api/exam-centers/' + id)
}

const examCentersAPI = {
  GetExamCenters,
  CreateExamCenter,
  GetExamCenterById,
  UpdateExamCenter,
  DeleteExamCenter
}

export default examCentersAPI
