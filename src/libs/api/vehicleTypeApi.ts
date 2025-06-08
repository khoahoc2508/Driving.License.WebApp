import { GetAllVehicleTypesParams } from '@/types/vehicleTypes'
import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const getAllVehicleTypes = async (params: GetAllVehicleTypesParams) => {
  return await axiosInstance.get('/api/vehicle-types', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const LicenseTypeAPI = {
  getAllVehicleTypes
}

export default LicenseTypeAPI
