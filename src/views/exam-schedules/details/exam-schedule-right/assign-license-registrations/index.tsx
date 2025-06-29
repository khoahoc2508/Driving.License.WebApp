import React from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

import LicenseRegistrationCard from '@/views/exam-schedules/details/exam-schedule-right/assign-license-registrations/LicenseRegistrationCard'

type Props = {
  examScheduleId: string
}

const AssignLicenseRegistrationsTab = ({ examScheduleId }: Props) => {
  return (
    <Grid container spacing={6} className='md:h-full'>
      <Grid size={{ xs: 12 }} className='md:h-full'>
        <LicenseRegistrationCard examScheduleId={examScheduleId} />
      </Grid>
    </Grid>
  )
}

export default AssignLicenseRegistrationsTab
