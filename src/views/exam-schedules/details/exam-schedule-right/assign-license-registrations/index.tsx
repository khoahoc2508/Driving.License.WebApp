import React from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

import LicenseRegistrationCard from '@/views/exam-schedules/details/exam-schedule-right/assign-license-registrations/LicenseRegistrationCard'

type Props = {
  examScheduleId: string
}

const AssignLicenseRegistrationsTab = ({ examScheduleId }: Props) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <LicenseRegistrationCard examScheduleId={examScheduleId} />
      </Grid>

    </Grid>
  )
}

export default AssignLicenseRegistrationsTab
