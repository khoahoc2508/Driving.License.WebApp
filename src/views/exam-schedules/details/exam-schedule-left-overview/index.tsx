// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ExamScheduleDetails from './ExamScheduleDetails'

type Props = {
  examScheduleId: string
}

const ExamScheduleLeftOverview = ({ examScheduleId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ExamScheduleDetails examScheduleId={examScheduleId}  />
      </Grid>
    </Grid>
  )
}

export default ExamScheduleLeftOverview
