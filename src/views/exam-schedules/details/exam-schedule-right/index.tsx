'use client'

// React Imports
import { useState, useEffect } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// Next Imports
import { useSearchParams } from 'next/navigation'

// MUI Imports
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'

const ExamScheduleRight = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('assign')

  // Hooks
  const searchParams = useSearchParams()

  // Effect to handle tab from URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab')
    if (tabFromUrl && (tabFromUrl === 'assign' || tabFromUrl === 'result')) {
      setActiveTab(tabFromUrl)
    }
  }, [searchParams])

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <TabContext value={activeTab}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
              <Tab icon={<i className='ri-calendar-check-line' />} value='assign' label='Xếp Thi' iconPosition='start' />
              <Tab icon={<i className='ri-repeat-line' />} value='result' label='Cập Nhật Kết Quả' iconPosition='start' />
            </CustomTabList>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TabPanel value={activeTab} className='p-0'>
              {tabContentList[activeTab]}
            </TabPanel>
          </Grid>
        </Grid>
      </TabContext>
    </>
  )
}

export default ExamScheduleRight
