'use client'

import { Box, Paper } from '@mui/material'
import SubTabs from './SubTabs'
import OverviewTab from './OverviewTab'
import TasksTab from './TasksTab'
import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'

type SubTab = 'overview' | 'tasks'

type MainContentProps = {
    activeTab: SubTab
    onTabChange: (tab: SubTab) => void
    overview: RegistrationRecordOverviewDto | null
}

const MainContent = ({ activeTab, onTabChange, overview }: MainContentProps) => {
    return (
        <Paper elevation={1} sx={{ p: 2 }}>
            {/* Sub-tabs */}
            <SubTabs activeTab={activeTab} onTabChange={onTabChange} />

            {/* Content based on active sub-tab */}
            {activeTab === 'overview' ? (
                <OverviewTab overview={overview} />
            ) : (
                <TasksTab />
            )}
        </Paper>
    )
}

export default MainContent
