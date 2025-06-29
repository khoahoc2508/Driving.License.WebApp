// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ExamScheduleDetails from './ExamScheduleDetails'

type Props = {
  examScheduleId: string
}

const ExamScheduleLeftOverview = ({ examScheduleId }: Props) => {
  return (
    <Grid container spacing={6} className='md:h-full'>
      <Grid size={{ xs: 12 }} className='md:h-full'>
        <ExamScheduleDetails examScheduleId={examScheduleId} />
      </Grid>
    </Grid>
  )
}

export default ExamScheduleLeftOverview
