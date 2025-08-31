'use client'

import { useState } from 'react'

import { Box, Tabs, Tab } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'

import OverviewTab from './overview/OverviewTab'
import TaskTab from './task/TaskTab'

type MainContentProps = {
    selectedStep: GetStepsDto | null
    registrationRecordId: string | undefined
    onRefreshSteps: (newStepsCount?: number) => void
}

const MainContent = ({ selectedStep, registrationRecordId, onRefreshSteps }: MainContentProps) => {
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
                    <OverviewTab selectedStep={selectedStep} registrationRecordId={registrationRecordId} onRefreshSteps={onRefreshSteps} />
                )}
                {tabValue === 1 && (
                    <TaskTab selectedStep={selectedStep} onRefreshSteps={onRefreshSteps} />
                )}
            </Box>
        </Box>
    )
}

export default MainContent
