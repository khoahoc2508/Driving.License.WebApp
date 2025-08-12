import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type { GetAssigneesQueryParams, UpsertAssigneeCommand } from '@/types/assigneeTypes'

const UpsertAssignee = async (data: UpsertAssigneeCommand) => {
  return await axiosInstance.put('/api/assignees', data)
}

const GetAssignees = async (params: GetAssigneesQueryParams) => {
  return await axiosInstance.get('/api/assignees', {
    params: {
      Search: params.search,
      AssigneeType: params.assigneeType,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      Active: params.active
    },
    paramsSerializer: customParamsSerializer
  })
}

const GetAssigneeById = async (id: string) => {
  return await axiosInstance.get('/api/assignees/' + id)
}

const DeleteAssigneeById = async (id: string) => {
  return await axiosInstance.delete('/api/assignees/' + id)
}

const assigneeAPI = {
  UpsertAssignee,
  GetAssignees,
  GetAssigneeById,
  DeleteAssigneeById
}

export default assigneeAPI
