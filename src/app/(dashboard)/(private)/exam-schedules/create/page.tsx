// MUI Imports
import Grid from '@mui/material/Grid2'

import ExamScheduleAddHeader from '@/views/exam-schedules/create/ExamScheduleAddHeader'
import ExamScheduleForm from '@/views/exam-schedules/create/ExamScheduleForm'

const examScheduleAddAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 8 }}>
        <ExamScheduleAddHeader />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <ExamScheduleForm />
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* <ProductImage /> */}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* <ProductVariants /> */}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* <ProductInventory /> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            {/* <ProductPricing /> */}
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* <ProductOrganize /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default examScheduleAddAdd
