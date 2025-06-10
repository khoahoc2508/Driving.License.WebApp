// MUI Imports
import type { ReactElement } from 'react'

import dynamic from 'next/dynamic'

import Grid from '@mui/material/Grid2'

// Next Imports

// Component Imports
import Dashboard from '@/views/dashboard'



// Data Imports

const OverViewTab = dynamic(() => import('@views/dashboard/overview'))
const RevenueTab = dynamic(() => import('@views/dashboard/revenue'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  overview: <OverViewTab />,
  revenue: <RevenueTab />
})

const dashboard = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        {/* <ExamSchedulesTable /> */}
        <Dashboard tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default dashboard
