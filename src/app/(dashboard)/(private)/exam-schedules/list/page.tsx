// MUI Imports
import Grid from '@mui/material/Grid2'

import ExamSchedulesTable from '@/views/exam-schedules/list/ExamSchedulesTable'


// Component Imports


// Data Imports

const eCommerceProductsList = async () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        {/* <ProductCard /> */}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ExamSchedulesTable />
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsList
