// MUI Imports
import Grid from '@mui/material/Grid2'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Dashboard from '@/views/dashboard'


// Data Imports

const OverViewTab = dynamic(() => import('@views/dashboard/overview'))
const RevenueTab = dynamic(() => import('@views/dashboard/revenue'))

// Vars
const tabContentList = () => ({
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
