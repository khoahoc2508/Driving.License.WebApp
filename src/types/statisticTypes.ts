import type { components } from '@/libs/api/client/schema'

// Query Params Types
export type GetStatisticByTimeRangeParams = {
  startDate?: string
  endDate?: string
}

// Response Types
export type StatisticOverviewResponse = components['schemas']['GetStatisticOverviewByTimeRangeResponse']
export type ExamPassFailPercentageResponse = components['schemas']['GetExamPassFailPercentageByTimeRangeResponse']
export type VehicleTypePercentageResponse = components['schemas']['GetVehicleTypePercentageByTimeRangeResponse']
export type VehicleTypeQuantityResponse = components['schemas']['GetVehicleTypeQuantityByTimeRangeResponse']

// Base Response Types
export type BaseResponseOfStatisticOverview =
  components['schemas']['BaseResponseOfGetStatisticOverviewByTimeRangeResponse']
export type BaseResponseOfExamPassFailPercentage =
  components['schemas']['BaseResponseOfGetExamPassFailPercentageByTimeRangeResponse']
export type BaseResponseOfVehicleTypePercentage =
  components['schemas']['BaseResponseOfGetVehicleTypePercentageByTimeRangeResponse']
export type BaseResponseOfVehicleTypeQuantity =
  components['schemas']['BaseResponseOfGetVehicleTypeQuantityByTimeRangeResponse']

// Data Types
export type DataFollowExamScheduleResponse = components['schemas']['DataFollowExamScheduleResponse']
export type DataFollowMonthResponse = components['schemas']['DataFollowMonthResponse']
export type DataFollowExamScheduleResponse2 = components['schemas']['DataFollowExamScheduleResponse2']
export type DataFollowMonthResponse2 = components['schemas']['DataFollowMonthResponse2']
export type DataFollowMonthResponse3 = components['schemas']['DataFollowMonthResponse3']

// Enum Types
export type MonthOfYearType = components['schemas']['MonthOfYearType']
