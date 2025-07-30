import React, { } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

import LicenseRegistrationCard from './LicenseRegistrationCard'

type Props = {
  examScheduleId: string
}

const UpdatelicenseResultTab = ({ examScheduleId }: Props) => {
  return (
    <Grid container spacing={6} className='md:h-full'>
      <Grid size={{ xs: 12 }} className='md:h-full'>
        <LicenseRegistrationCard examScheduleId={examScheduleId} />
      </Grid>
    </Grid>
  )
}

export default UpdatelicenseResultTab
