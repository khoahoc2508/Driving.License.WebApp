// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports


// Component Imports


// Data Imports
import ExamScheduleLeftOverview from '@/views/exam-schedules/details/exam-schedule-left-overview'
import ExamScheduleRight from '@/views/exam-schedules/details/exam-schedule-right'

const AssignLicenseRegistrationsTab = dynamic(() => import('@views/exam-schedules/details/exam-schedule-right/assign-license-registrations'))
const UpdatelicenseResultTab = dynamic(() => import('@views/exam-schedules/details/exam-schedule-right/license-registrations-result'))

// Vars
const tabContentList = (examScheduleId: string): { [key: string]: ReactElement } => ({
  assign: <AssignLicenseRegistrationsTab examScheduleId={examScheduleId} />,
  result: <UpdatelicenseResultTab examScheduleId={examScheduleId} />
})

const ExamScheduleDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  // Vars
  const { id: examScheduleId } = await params

  return (
    <Grid container spacing={6} className='xs:w-[auto] md:h-full'>
      <Grid size={{ xs: 12, lg: 4, md: 5 }} className='md:h-full'>
        <ExamScheduleLeftOverview examScheduleId={examScheduleId} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }} className='md:h-full'>
        <ExamScheduleRight tabContentList={tabContentList(examScheduleId)} />
      </Grid>
    </Grid>
  )
}

export default ExamScheduleDetail
