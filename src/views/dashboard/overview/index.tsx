
'use client'

import StatisticAPI from '@/libs/api/statisticAPI'
import { ExamPassFailPercentageResponse, StatisticOverviewResponse } from '@/types/statisticTypes'
import Filters from '@/views/dashboard/overview/Filters'
import LicenseRegistrationColumnChart from '@/views/dashboard/overview/LicenseRegistrationColumnChart'
// MUI Imports
import PaymentPieChart from '@/views/dashboard/overview/PaymentPieChart'
import RechartsLineChart from '@/views/dashboard/overview/RechartsLineChart'
import TotalListCards from '@/views/dashboard/overview/TotalListCards'
import Grid from '@mui/material/Grid2'
import { addDays } from 'date-fns'
import { useEffect, useState, useCallback } from 'react'

const OverViewTab = () => {
  // States
  const [loading, setLoading] = useState(true)

  // Filters
  const [startDate, setStartDate] = useState<Date | null | undefined>()
  const [endDate, setEndDate] = useState<Date | null | undefined>()

  // Data
  const [statistics, setStatistics] = useState<StatisticOverviewResponse | null>(null)

  // Fetch statistics data
  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      // Lấy dữ liệu thống kê cho 30 ngày gần nhất
      // const endDate = new Date().toISOString()
      // const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const response = await StatisticAPI.getStatisticOverview({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      })

      if (response.data?.success && response.data?.data) {
        setStatistics(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch exam pass/fail percentage data
  // const fetchExamPassFailData = async () => {
  //   try {
  //     setLoading(true)
  //     // Lấy dữ liệu thống kê cho 12 tháng gần nhất
  //     const endDate = new Date().toISOString()
  //     const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()

  //     const response = await StatisticAPI.getExamPassFailPercentage({
  //       startDate,
  //       endDate
  //     })

  //     if (response.data?.success && response.data?.data) {
  //       const data: ExamPassFailPercentageResponse = response.data.data

  //       // Chuyển đổi dữ liệu từ API thành định dạng cho biểu đồ
  //       if (data.dataFollowMonth && data.dataFollowMonth.length > 0) {
  //         const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  //         // Tạo bản sao của initialData
  //         const newChartData = [...initialData]

  //         // Cập nhật dữ liệu cho các tháng có trong response
  //         data.dataFollowMonth.forEach(item => {
  //           if (item.monthOfYear !== undefined && item.monthOfYear >= 1 && item.monthOfYear <= 12) {
  //             newChartData[item.monthOfYear - 1] = {
  //               pass: item.passPercentage || 0,
  //               fail: item.failPercentage || 0,
  //               name: monthNames[item.monthOfYear - 1]
  //             }
  //           }
  //         })

  //         // setChartData(newChartData)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching exam pass/fail data:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }


  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])


  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Filters startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TotalListCards statistics={statistics} />

        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <RechartsLineChart />

        </Grid>
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <PaymentPieChart statistics={statistics} />

        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <LicenseRegistrationColumnChart startDate={startDate} endDate={endDate} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OverViewTab
