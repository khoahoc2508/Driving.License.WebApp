'use client'

// React Imports
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { ExamScheduleByIdType } from '@/types/examScheduleTypes'

// Component Imports
import ExamScheduleLeftOverview from '@/views/exam-schedules/details/exam-schedule-left-overview'
import ExamScheduleRight from '@/views/exam-schedules/details/exam-schedule-right'

// API Imports
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'

const AssignLicenseRegistrationsTab = dynamic(() => import('@views/exam-schedules/details/exam-schedule-right/assign-license-registrations'))
const UpdatelicenseResultTab = dynamic(() => import('@views/exam-schedules/details/exam-schedule-right/license-registrations-result'))

// Vars
const tabContentList = (examScheduleId: string, examSchedule?: ExamScheduleByIdType): { [key: string]: ReactElement } => ({
  assign: <AssignLicenseRegistrationsTab examScheduleId={examScheduleId} examSchedule={examSchedule} />,
  result: <UpdatelicenseResultTab examScheduleId={examScheduleId} />
})

const ExamScheduleDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  // States
  const [examScheduleId, setExamScheduleId] = useState<string>('')
  const [examSchedule, setExamSchedule] = useState<ExamScheduleByIdType>()
  const [loading, setLoading] = useState(true)

  // Fetch exam schedule data
  const fetchExamScheduleById = async (id: string) => {
    try {
      setLoading(true)
      const response = await ExamScheduleAPI.getExamScheduleById(id)
      const examScheduleRes = response.data.data as ExamScheduleByIdType

      if (examScheduleRes) {
        setExamSchedule(examScheduleRes)
      }
    } catch (error) {
      console.error('Error fetching exam schedule by id:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get params and fetch data
  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setExamScheduleId(id)
      fetchExamScheduleById(id)
    }

    getParams()
  }, [params])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Grid container spacing={6} className='xs:w-[auto] md:h-full'>
      <Grid size={{ xs: 12, lg: 4, md: 5 }} className='md:h-full'>
        <ExamScheduleLeftOverview examScheduleId={examScheduleId} examSchedule={examSchedule} />
      </Grid>
      <Grid size={{ xs: 12, lg: 8, md: 7 }} className='md:h-full'>
        <ExamScheduleRight tabContentList={tabContentList(examScheduleId, examSchedule)} />
      </Grid>
    </Grid>
  )
}

export default ExamScheduleDetail
