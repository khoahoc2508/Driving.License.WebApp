import type { GetBrandSettingByOwnerIdQueryParams, UpsertBrandSettingCommand } from '@/types/brandSettingTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

const UpsertBrandSetting = async (data: UpsertBrandSettingCommand) => {
  return await axiosInstance.post('/api/brandsettings/upsert', data)
}

const GetBrandsetting = async () => {
  return await axiosInstance.get('/api/brandsettings/by-user')
}

const GetBrandsettingByOwnerId = async (params: GetBrandSettingByOwnerIdQueryParams) => {
  return await axiosInstance.get('/api/brandsettings/by-owner', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const brandSettingAPI = {
  UpsertBrandSetting,
  GetBrandsetting,
  GetBrandsettingByOwnerId
}

export default brandSettingAPI
