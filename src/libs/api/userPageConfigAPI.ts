import axiosInstance from '../axios'
import type { GetColumnConfigQueryParams, UpsertUserPageConfigCommand } from '@/types/userPageConfigTypes'
import { customParamsSerializer } from './commonAPI'

const UpsertUserPageConfig = async (data: UpsertUserPageConfigCommand) => {
  return await axiosInstance.post('/api/user-page-config/upsert', data)
}

const GetUserPageConfig = async (params: GetColumnConfigQueryParams) => {
  return await axiosInstance.get(`/api/user-page-config/${params.pageKey}`, {
    paramsSerializer: customParamsSerializer
  })
}

const UserPageConfigAPI = {
  UpsertUserPageConfig,
  GetUserPageConfig
}

export default UserPageConfigAPI
