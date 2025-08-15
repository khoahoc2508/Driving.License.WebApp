import type { GetFeeTypesQueryParams, UpsertFeeTypeCommand } from '@/types/feeTypes'
import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

const UpsertFeeType = async (data: UpsertFeeTypeCommand) => {
  return await axiosInstance.put('/api/feetypes', data)
}

const GetFeeTypes = async (params: GetFeeTypesQueryParams) => {
  return await axiosInstance.get('/api/feetypes', {
    params: {
      Search: params.search,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      Active: params.active
    },
    paramsSerializer: customParamsSerializer
  })
}

const GetFeeTypeById = async (id: string) => {
  return await axiosInstance.get('/api/feetypes/' + id)
}

const DeleteFeeTypeById = async (id: string) => {
  return await axiosInstance.delete('/api/feetypes/' + id)
}

const feeTypeAPI = {
  UpsertFeeType,
  GetFeeTypes,
  GetFeeTypeById,
  DeleteFeeTypeById
}

export default feeTypeAPI
