'use client'

import { Box, Grid } from '@mui/material'
import { useState } from 'react'

import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'
import { ProcessSteps, MainContent } from './components'

type ProcessingTabProps = {
    overview: RegistrationRecordOverviewDto | null
    registrationRecordId: string | undefined
}

const ProcessingTab = ({ overview, registrationRecordId }: ProcessingTabProps) => {
    const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tasks'>('overview')

    return (
        <Box sx={{ p: 2 }}>
            {/* Main Layout */}
            <Grid container spacing={3}>
                {/* Left Sidebar - Process Steps */}
                <Grid item xs={12} md={4}>
                    <ProcessSteps registrationRecordId={registrationRecordId} />
                </Grid>

                {/* Right Main Panel */}
                <Grid item xs={12} md={8}>
                    <MainContent
                        activeTab={activeSubTab}
                        onTabChange={setActiveSubTab}
                        overview={overview}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProcessingTab


