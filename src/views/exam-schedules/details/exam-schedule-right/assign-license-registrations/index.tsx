import React from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ExamScheduleByIdType } from '@/types/examScheduleTypes'

import LicenseRegistrationCard from '@/views/exam-schedules/details/exam-schedule-right/assign-license-registrations/LicenseRegistrationCard'

type Props = {
  examScheduleId: string
  examSchedule?: ExamScheduleByIdType
}

const AssignLicenseRegistrationsTab = ({ examScheduleId, examSchedule }: Props) => {
  return (
    <Grid container spacing={6} className='md:h-full'>
      <Grid size={{ xs: 12 }} className='md:h-full'>
        <LicenseRegistrationCard examScheduleId={examScheduleId} examSchedule={examSchedule} />
      </Grid>
    </Grid>
  )
}

export default AssignLicenseRegistrationsTab
