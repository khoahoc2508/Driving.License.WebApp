import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type { GetDATDevicesQueryParams, CreateDATDeviceCommand, UpdateDATDeviceCommand } from '@/types/datDeviceTypes'

const GetDATDevices = async (params: GetDATDevicesQueryParams) => {
  return await axiosInstance.get('/api/dat-devices', {
    params: {
      Search: params.search,
      Active: params.active,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize
    },
    paramsSerializer: customParamsSerializer
  })
}

const GetAllDATDevices = async (params?: { Active?: boolean | null; Search?: string | null }) => {
  return await axiosInstance.get('/api/dat-devices/all', {
    params: {
      Active: params?.Active,
      Search: params?.Search
    },
    paramsSerializer: customParamsSerializer
  })
}

const CreateDATDevice = async (data: CreateDATDeviceCommand) => {
  return await axiosInstance.post('/api/dat-devices', data)
}

const GetDATDeviceById = async (id: string) => {
  return await axiosInstance.get('/api/dat-devices/' + id)
}

const UpdateDATDevice = async (data: UpdateDATDeviceCommand) => {
  return await axiosInstance.put('/api/dat-devices/' + data.id, data)
}

const DeleteDATDevice = async (id: string) => {
  return await axiosInstance.delete('/api/dat-devices/' + id)
}

const datDevicesAPI = {
  GetDATDevices,
  GetAllDATDevices,
  CreateDATDevice,
  GetDATDeviceById,
  UpdateDATDevice,
  DeleteDATDevice
}

export default datDevicesAPI
