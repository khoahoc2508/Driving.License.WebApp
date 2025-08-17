import type {
  GetRegistrationRecordsQueryParams,
  CreateRegistrationRecordCommand,
  UpdateRegistrationRecordCommand
} from '@/types/registrationRecords'
import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

const GetRegistrationRecords = async (params: GetRegistrationRecordsQueryParams) => {
  return await axiosInstance.get('/api/registration-records', {
    params: {
      LicenseTypeCode: params.licenseTypeCode,
      PaymentStatus: params.paymentStatus,
      Status: params.status,
      StaffAssigneeId: params.staffAssigneeId,
      CollaboratorId: params.collaboratorId,
      Search: params.search,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize
    },
    paramsSerializer: customParamsSerializer
  })
}

const GetRegistrationRecordById = async (id: string) => {
  return await axiosInstance.get(`/api/registration-records/${id}`)
}

const CreateRegistrationRecord = async (data: CreateRegistrationRecordCommand) => {
  return await axiosInstance.post('/api/registration-records', data)
}

const UpdateRegistrationRecord = async (id: string, data: UpdateRegistrationRecordCommand) => {
  return await axiosInstance.put(`/api/registration-records/${id}`, data)
}

const DeleteRegistrationRecord = async (id: string) => {
  return await axiosInstance.delete(`/api/registration-records/${id}`)
}

const registrationRecordsAPI = {
  GetRegistrationRecords,
  GetRegistrationRecordById,
  CreateRegistrationRecord,
  UpdateRegistrationRecord,
  DeleteRegistrationRecord
}

export default registrationRecordsAPI
