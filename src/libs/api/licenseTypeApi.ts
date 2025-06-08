import { GetAllLicenseTypesParams } from '@/types/licenseTypes'
import axiosInstance from '../axios'

import { customParamsSerializer } from './commonAPI'

const getAllLicenseTypes = async (params: GetAllLicenseTypesParams) => {
  return await axiosInstance.get('/api/license-types', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const LicenseTypeAPI = {
  getAllLicenseTypes
}

export default LicenseTypeAPI
