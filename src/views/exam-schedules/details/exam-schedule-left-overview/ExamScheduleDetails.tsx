'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import type { ExamScheduleByIdType} from '@/types/examScheduleTypes';
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'

type Props = {
  examScheduleId: string
}

const ExamScheduleDetails = ({ examScheduleId }: Props) => {
  const [examSchedule, setExamSchedule] = useState<ExamScheduleByIdType>()

  // Fetch data
  const fetchExamScheduleById = async (id: string) => {
    try {

      const response = await ExamScheduleAPI.getExamScheduleById(id)

      const examScheduleRes = response.data.data as ExamScheduleByIdType

      if (examScheduleRes) {
        setExamSchedule(examScheduleRes)
      }
    } catch (error) {
      console.error('Error fetching exam schedule by id:', error)
    }
  }

  useEffect(() => {
    if (examScheduleId) {
      fetchExamScheduleById(examScheduleId)
    }
  }, [examScheduleId])

  return (
    <>
      <Card>
        <CardContent className='flex flex-col pbs-6 gap-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-center flex-col gap-4'>
              <div className='flex flex-col items-center gap-4'>
                <Typography variant='h3' className='uppercase'>Thông tin lịch thi</Typography>
              </div>
              <Chip label={examSchedule?.examAddress?.fullAddress} color='error' size='small' variant='tonal' />
            </div>
            <div className='flex items-center justify-around flex-wrap gap-4'>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-timer-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>{examSchedule?.dateTime
                    ? new Date(examSchedule.dateTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    : '-'
                  }</Typography>

                </div>
              </div>
              <div className='flex items-center gap-4'>
                <CustomAvatar variant='rounded' color='primary' skin='light'>
                  <i className='ri-calendar-todo-line' />
                </CustomAvatar>
                <div>
                  <Typography variant='h5'>{examSchedule?.dateTime
                    ? new Date(examSchedule.dateTime).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    : '-'
                  }</Typography>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Typography variant='h5'>Chi tiết</Typography>
            <Divider className='mlb-4' />
            <div className='flex flex-col gap-2'>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Giờ:
                </Typography>
                <Typography>
                  {examSchedule?.dateTime
                    ? new Date(examSchedule.dateTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    : '-'
                  }
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Ngày:
                </Typography>
                <Typography>
                  {examSchedule?.dateTime
                    ? new Date(examSchedule.dateTime).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                    : '-'
                  }
                </Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Địa chỉ:
                </Typography>
                <Typography color='text.primary'>{examSchedule?.examAddress?.fullAddress}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Hạng:
                </Typography>
                <Typography color='text.primary' className='uppercase'>{examSchedule?.licenseTypeCode}</Typography>
              </div>
              <div className='flex items-center flex-wrap gap-x-1.5'>
                <Typography className='font-medium' color='text.primary'>
                  Suất thi:
                </Typography>
                <Typography color='text.primary'>{examSchedule?.registrationLimit ? examSchedule?.registrationLimit : 'Không giới hạn'}</Typography>
              </div>

            </div>
          </div>

        </CardContent>
      </Card>
    </>
  )
}

export default ExamScheduleDetails
