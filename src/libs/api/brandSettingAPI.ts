import { BrandSettingDto, UpsertBrandSettingCommand } from '@/types/brandSettingTypes'
import axiosInstance from '../axios'

const UpsertBrandSetting = async (data: UpsertBrandSettingCommand) => {
  return await axiosInstance.post('/api/brandsettings/upsert', data)
}

const GetBrandsetting = async () => {
  return await axiosInstance.get('/api/brandsettings/by-user')
}

const brandSettingAPI = {
  UpsertBrandSetting,
  GetBrandsetting
}

export default brandSettingAPI
