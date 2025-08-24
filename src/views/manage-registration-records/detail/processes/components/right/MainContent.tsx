'use client'

import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'
import type { GetStepsDto } from '@/types/stepsTypes'
import { Box, Tabs, Tab } from '@mui/material'
import { useState } from 'react'
import OverviewTab from './OverviewTab'
import TaskTab from './TaskTab'

type MainContentProps = {
    selectedStep: GetStepsDto | null
}

const MainContent = ({ selectedStep }: MainContentProps) => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    return (
        <Box sx={{
            p: 3,
            height: '100%',
            borderLeft: { xs: 'none', md: '1px solid' },
            borderColor: { md: 'divider' }
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab label="Tổng quan" />
                    <Tab label="Công việc" />
                </Tabs>
            </Box>

            <Box>
                {tabValue === 0 && (
                    <OverviewTab selectedStep={selectedStep} />
                )}
                {tabValue === 1 && (
                    <TaskTab selectedStep={selectedStep} />
                )}
            </Box>
        </Box>
    )
}

export default MainContent
