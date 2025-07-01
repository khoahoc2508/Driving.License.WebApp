// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ExamScheduleByIdType } from '@/types/examScheduleTypes'

// Component Imports
import ExamScheduleDetails from './ExamScheduleDetails'

type Props = {
  examScheduleId: string
  examSchedule?: ExamScheduleByIdType
}

const ExamScheduleLeftOverview = ({ examScheduleId, examSchedule }: Props) => {
  return (
    <Grid container spacing={6} className='md:h-full'>
      <Grid size={{ xs: 12 }} className='md:h-full'>
        <ExamScheduleDetails examScheduleId={examScheduleId} examSchedule={examSchedule} />
      </Grid>
    </Grid>
  )
}

export default ExamScheduleLeftOverview
