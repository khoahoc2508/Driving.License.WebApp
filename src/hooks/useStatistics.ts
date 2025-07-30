import { useState, useEffect, useCallback } from 'react'

import StatisticAPI from '@/libs/api/statisticAPI'
import type {
  StatisticOverviewResponse,
  ExamPassFailPercentageResponse,
  VehicleTypePercentageResponse,
  VehicleTypeQuantityResponse,
  GetStatisticByTimeRangeParams
} from '@/types/statisticTypes'

interface UseStatisticsProps {
  params: GetStatisticByTimeRangeParams
  autoFetch?: boolean
}

interface StatisticsData {
  overview: StatisticOverviewResponse | null
  examPassFail: ExamPassFailPercentageResponse | null
  vehicleTypePercentage: VehicleTypePercentageResponse | null
  vehicleTypeQuantity: VehicleTypeQuantityResponse | null
}

export const useStatistics = ({ params, autoFetch = true }: UseStatisticsProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [data, setData] = useState<StatisticsData>({
    overview: null,
    examPassFail: null,
    vehicleTypePercentage: null,
    vehicleTypeQuantity: null
  })

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await StatisticAPI.getStatisticOverview(params)

      if (response.data?.success && response.data?.data) {
        setData(prev => ({ ...prev, overview: response.data.data }))

        return response.data.data
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch overview statistics'))
      console.error('Error fetching overview statistics:', err)

      return null
    } finally {
      setLoading(false)
    }
  }, [params])

  const fetchExamPassFail = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await StatisticAPI.getExamPassFailPercentage(params)

      if (response.data?.success && response.data?.data) {
        setData(prev => ({ ...prev, examPassFail: response.data.data }))

        return response.data.data
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch exam pass/fail statistics'))
      console.error('Error fetching exam pass/fail statistics:', err)

      return null
    } finally {
      setLoading(false)
    }
  }, [params])

  const fetchVehicleTypePercentage = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await StatisticAPI.getVehicleTypePercentage(params)

      if (response.data?.success && response.data?.data) {
        setData(prev => ({ ...prev, vehicleTypePercentage: response.data.data }))

        return response.data.data
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vehicle type percentage'))
      console.error('Error fetching vehicle type percentage:', err)

      return null
    } finally {
      setLoading(false)
    }
  }, [params])

  const fetchVehicleTypeQuantity = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await StatisticAPI.getVehicleTypeQuantity(params)

      if (response.data?.success && response.data?.data) {
        setData(prev => ({ ...prev, vehicleTypeQuantity: response.data.data }))

        return response.data.data
      }

      return null
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vehicle type quantity'))
      console.error('Error fetching vehicle type quantity:', err)

      return null
    } finally {
      setLoading(false)
    }
  }, [params])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.all([
        fetchOverview(),
        fetchExamPassFail(),
        fetchVehicleTypePercentage(),
        fetchVehicleTypeQuantity()
      ])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch statistics'))
      console.error('Error fetching all statistics:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchOverview, fetchExamPassFail, fetchVehicleTypePercentage, fetchVehicleTypeQuantity])

  useEffect(() => {
    if (autoFetch) {
      fetchAll()
    }
  }, [autoFetch, fetchAll])

  return {
    loading,
    error,
    data,
    fetchOverview,
    fetchExamPassFail,
    fetchVehicleTypePercentage,
    fetchVehicleTypeQuantity,
    fetchAll
  }
}
