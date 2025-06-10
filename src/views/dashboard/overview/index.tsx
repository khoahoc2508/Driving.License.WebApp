
'use client'

import { useStatistics } from '@/hooks/useStatistics'
import StatisticAPI from '@/libs/api/statisticAPI'
import { ExamPassFailPercentageResponse, GetStatisticByTimeRangeParams, StatisticOverviewResponse } from '@/types/statisticTypes'
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
  const [params, setParams] = useState<GetStatisticByTimeRangeParams>({ startDate: undefined, endDate: undefined })

  // Use our custom hook
  const {
    loading,
    data,
    fetchAll
  } = useStatistics({
    params,
    autoFetch: true
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Filters setParams={setParams} params={params} />
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TotalListCards statistics={data.overview} />

        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <RechartsLineChart />

        </Grid>
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <PaymentPieChart statistics={data.overview} />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <LicenseRegistrationColumnChart />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OverViewTab
