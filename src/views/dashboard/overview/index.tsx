
// MUI Imports
import PaymentPieChart from '@/views/dashboard/overview/PaymentPieChart'
import RechartsLineChart from '@/views/dashboard/overview/RechartsLineChart'
import TotalListCards from '@/views/dashboard/overview/TotalListCards'
import Grid from '@mui/material/Grid2'

const OverViewTab = async () => {
  // Vars


  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 12 }}>
        Filter
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TotalListCards />

        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <RechartsLineChart />

        </Grid>
      </Grid>
      <Grid container spacing={6} size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12, md: 12 }}>
          <PaymentPieChart />

        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <h1>Phải dưới</h1>

        </Grid>
      </Grid>
    </Grid>
  )
}

export default OverViewTab
