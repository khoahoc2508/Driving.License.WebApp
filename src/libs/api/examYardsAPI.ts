import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type { GetExamYardsQueryParams, CreateExamYardCommand, UpdateExamYardCommand } from '@/types/examYardTypes'

const GetExamYards = async (params: GetExamYardsQueryParams) => {
  return await axiosInstance.get('/api/exam-yards', {
    params: {
      Search: params.search,
      Active: params.active,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize
    },
    paramsSerializer: customParamsSerializer
  })
}

const CreateExamYard = async (data: CreateExamYardCommand) => {
  return await axiosInstance.post('/api/exam-yards', data)
}

const GetExamYardById = async (id: string) => {
  return await axiosInstance.get('/api/exam-yards/' + id)
}

const UpdateExamYard = async (data: UpdateExamYardCommand) => {
  return await axiosInstance.put('/api/exam-yards/' + data.id, data)
}

const DeleteExamYard = async (id: string) => {
  return await axiosInstance.delete('/api/exam-yards/' + id)
}

const examYardsAPI = {
  GetExamYards,
  CreateExamYard,
  GetExamYardById,
  UpdateExamYard,
  DeleteExamYard
}

export default examYardsAPI
