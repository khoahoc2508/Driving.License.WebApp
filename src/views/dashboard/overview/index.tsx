
'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'


import { useStatistics } from '@/hooks/useStatistics'
import type { GetStatisticByTimeRangeParams } from '@/types/statisticTypes';
import Filters from '@/views/dashboard/overview/Filters'
import LicenseRegistrationColumnChart from '@/views/dashboard/overview/LicenseRegistrationColumnChart'

// MUI Imports
import PaymentPieChart from '@/views/dashboard/overview/PaymentPieChart'
import RechartsLineChart from '@/views/dashboard/overview/RechartsLineChart'
import TotalListCards from '@/views/dashboard/overview/TotalListCards'


const OverViewTab = () => {
  // States
  const [params, setParams] = useState<GetStatisticByTimeRangeParams>({ startDate: undefined, endDate: undefined })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reloadFlag, setReloadFlag] = useState(false)

  // Use our custom hook
  const { data } = useStatistics({
    params,
    autoFetch: true
  })

  const handleRefresh = () => {
    setReloadFlag(prev => !prev)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 12 }}>
        <Filters setParams={setParams} params={params} onRefresh={handleRefresh} />
      </Grid>


      <Grid size={{ xs: 12, md: 12 }}>
        <TotalListCards statistics={data.overview} />
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 12 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PaymentPieChart statistics={data.overview} />

        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <LicenseRegistrationColumnChart statistics={data.vehicleTypeQuantity} />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <RechartsLineChart data={data.examPassFail} />
      </Grid>
    </Grid>
  )
}

export default OverViewTab
