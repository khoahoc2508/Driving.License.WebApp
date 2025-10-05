import type {
  GetRegistrationRecordsQueryParams,
  CreateRegistrationRecordCommand,
  UpdateRegistrationRecordCommand,
  CreatePaymentCommand,
  UpdatePaymentCommand,
  ApproveRegistrationRecordCommand,
  ExportRegistrationRecordsToExcelCommand
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

const GetRegistrationRecordBasicInfo = async (id: string) => {
  return await axiosInstance.get(`/api/registration-records/${id}/basic-infor`)
}

const GetRegistrationRecordOverview = async (id: string) => {
  return await axiosInstance.get(`/api/registration-records/${id}/overview`)
}

const ExportRegistrationRecordsToExcel = async (data: ExportRegistrationRecordsToExcelCommand) => {
  return await axiosInstance.post('/api/registration-records/export/excel', data)
}

// Payments
const GetAllPaymentsByRegistrationRecordId = async (registrationRecordId: string) => {
  return await axiosInstance.get('/api/payments/all', {
    params: { RegistrationRecordId: registrationRecordId }
  })
}

const CreatePayment = async (data: CreatePaymentCommand) => {
  return await axiosInstance.post('/api/payments', data)
}

const GetPaymentById = async (id: string) => {
  return await axiosInstance.get(`/api/payments/${id}`)
}

const UpdatePayment = async (id: string, data: UpdatePaymentCommand) => {
  return await axiosInstance.put(`/api/payments/${id}`, data)
}

const DeletePayment = async (id: string) => {
  return await axiosInstance.delete(`/api/payments/${id}`)
}

// Payment Histories
const GetAllPaymentHistoriesByRegistrationRecordId = async (registrationRecordId: string, search?: string | null) => {
  return await axiosInstance.get('/api/payment-histories/all', {
    params: { RegistrationRecordId: registrationRecordId, Search: search }
  })
}

const CreatePaymentHistory = async (data: any) => {
  return await axiosInstance.post('/api/payment-histories', data)
}

const GetPaymentHistoryById = async (id: string) => {
  return await axiosInstance.get(`/api/payment-histories/${id}`)
}

const UpdatePaymentHistory = async (id: string, data: any) => {
  return await axiosInstance.put(`/api/payment-histories/${id}`, data)
}

const DeletePaymentHistory = async (id: string) => {
  return await axiosInstance.delete(`/api/payment-histories/${id}`)
}

const CreateRegistrationRecord = async (data: CreateRegistrationRecordCommand) => {
  return await axiosInstance.post('/api/registration-records', data)
}

const UpdateRegistrationRecord = async (id: string, data: UpdateRegistrationRecordCommand) => {
  return await axiosInstance.put(`/api/registration-records/${id}`, data)
}

const UpdateRegistrationRecordIsApproved = async (data: ApproveRegistrationRecordCommand) => {
  return await axiosInstance.put(`/api/registration-records/${data.id}/approve`, {
    IsApproved: data.isApproved
  })
}

const DeleteRegistrationRecord = async (id: string) => {
  return await axiosInstance.delete(`/api/registration-records/${id}`)
}

const registrationRecordsAPI = {
  GetRegistrationRecords,
  GetRegistrationRecordById,
  GetRegistrationRecordBasicInfo,
  GetRegistrationRecordOverview,
  ExportRegistrationRecordsToExcel,
  GetAllPaymentsByRegistrationRecordId,
  CreatePayment,
  GetPaymentById,
  UpdatePayment,
  DeletePayment,
  GetAllPaymentHistoriesByRegistrationRecordId,
  CreatePaymentHistory,
  GetPaymentHistoryById,
  UpdatePaymentHistory,
  DeletePaymentHistory,
  CreateRegistrationRecord,
  UpdateRegistrationRecord,
  DeleteRegistrationRecord,
  UpdateRegistrationRecordIsApproved
}

export default registrationRecordsAPI
