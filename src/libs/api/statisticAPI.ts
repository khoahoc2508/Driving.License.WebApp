import type { GetStatisticByTimeRangeParams } from '@/types/statisticTypes'

import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'

// Statistic API calls
const getStatisticOverview = async (params: GetStatisticByTimeRangeParams) => {
  return await axiosInstance.get('/api/statistics/overview', {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate
    },
    paramsSerializer: customParamsSerializer
  })
}

const getExamPassFailPercentage = async (params: GetStatisticByTimeRangeParams) => {
  return await axiosInstance.get('/api/statistics/exam-pass-fail-percentage', {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate
    },
    paramsSerializer: customParamsSerializer
  })
}

const getVehicleTypePercentage = async (params: GetStatisticByTimeRangeParams) => {
  return await axiosInstance.get('/api/statistics/vehicle-type-percentage', {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate
    },
    paramsSerializer: customParamsSerializer
  })
}

const getVehicleTypeQuantity = async (params: GetStatisticByTimeRangeParams) => {
  return await axiosInstance.get('/api/statistics/vehicle-type-quantity', {
    params: {
      StartDate: params.startDate,
      EndDate: params.endDate
    },
    paramsSerializer: customParamsSerializer
  })
}

const StatisticAPI = {
  getStatisticOverview,
  getExamPassFailPercentage,
  getVehicleTypePercentage,
  getVehicleTypeQuantity
}

export default StatisticAPI
