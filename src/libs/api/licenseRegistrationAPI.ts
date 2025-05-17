import type {
    getLicensesRegistrationsPaidParams,
    GetLicensesRegistrationsParams,
    LicenseRegistrationCustomerResquest,
    LicenseRegistrationFormType
  } from '@/types/LicensesRegistrations'

  import client from './client'
  
  const getLicensesRegistrations = async ({
    pageNumber,
    pageSize,
    search,
    examScheduleId,
    isPaid,
    isExamScheduled,
    hasCompletedHealthCheck
  }: GetLicensesRegistrationsParams) => {
    
    return await client.GET('/api/licenses/registrations', {
      params: {
        query: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          Search: search,
          ExamScheduleId: examScheduleId,
          IsPaid: isPaid,
          IsExamScheduled: isExamScheduled,
          HasCompletedHealthCheck: hasCompletedHealthCheck
        }
      }
    })
  }
  
  const getLicensesRegistrationsPaid = async ({
    pageNumber,
    pageSize,
    search,
    examScheduleId
  }: getLicensesRegistrationsPaidParams) => {
    return await client.GET('/api/licenses/registrations/paid', {
      params: {
        query: {
          PageNumber: pageNumber,
          PageSize: pageSize,
          Search: search,
          ExamScheduleId: examScheduleId
        }
      }
    })
  }
  
  const getDetailLicensesRegistration = async (id: string) => {
    return await client.GET(`/api/licenses/registrations/{id}`, {
      params: {
        path: {
          id
        }
      }
    })
  }
  
  const createLicensesRegistrations = async (data: LicenseRegistrationFormType) => {
    return await client.POST('/api/licenses/registrations', {
      body: data
    })
  }
  
  const updateLicensesRegistrations = async (data: LicenseRegistrationFormType) => {
    return await client.PUT('/api/licenses/registrations', {
      body: data
    })
  }
  
  const deleteLicensesRegistrations = async (id: string) => {
    return await client.DELETE('/api/licenses/registrations/{id}', {
      params: {
        path: {
          id
        }
      }
    })
  }
  
  const createLicensesRegistrationsForCustomer = async (data: LicenseRegistrationCustomerResquest) => {
    return await client.POST('/api/licenses/registrations/customer', {
      body: data
    })
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
  