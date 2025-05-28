import type {
  getLicensesRegistrationsPaidParams,
  GetLicensesRegistrationsParams,
  LicenseRegistrationCreateResquest,
  LicenseRegistrationCustomerResquest,
  LicenseRegistrationUpdateResquest
} from '@/types/LicensesRegistrations'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

const getLicensesRegistrations = async (params: GetLicensesRegistrationsParams) => {
  return await axiosInstance.get('/api/licenses/registrations', {
    params,
    paramsSerializer: customParamsSerializer
  })
}

const getLicensesRegistrationsPaid = async ({
  pageNumber,
  pageSize,
  search,
  examScheduleId
}: getLicensesRegistrationsPaidParams) => {
  return await axiosInstance.get('/api/licenses/registrations/paid', {
    params: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      Search: search,
      ExamScheduleId: examScheduleId
    },
    paramsSerializer: customParamsSerializer
  })
}

const getDetailLicensesRegistration = async (id: string) => {
  return await axiosInstance.get(`/api/licenses/registrations/${id}`)
}

const createLicensesRegistrations = async (data: LicenseRegistrationCreateResquest) => {
  return await axiosInstance.post('/api/licenses/registrations', data)
}

const updateLicensesRegistrations = async (data: LicenseRegistrationUpdateResquest) => {
  return await axiosInstance.put('/api/licenses/registrations', data)
}

const deleteLicensesRegistrations = async (id: string) => {
  return await axiosInstance.delete(`/api/licenses/registrations/${id}`)
}

const createLicensesRegistrationsForCustomer = async (data: LicenseRegistrationCustomerResquest) => {
  return await axiosInstance.post('/api/licenses/registrations/customer', data)
}

const LicenseRegistrationAPI = {
  getLicensesRegistrations,
  getDetailLicensesRegistration,
  createLicensesRegistrations,
  updateLicensesRegistrations,
  deleteLicensesRegistrations,
  getLicensesRegistrationsPaid,
  createLicensesRegistrationsForCustomer
}

export default LicenseRegistrationAPI
