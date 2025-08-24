'use client'

import { Box, Grid } from '@mui/material'
import { useState } from 'react'

import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'
import type { GetStepsDto } from '@/types/stepsTypes'
import ProcessSteps from './components/left/ProcessSteps'
import MainContent from './components/right/MainContent'

type ProcessingTabProps = {
    overview: RegistrationRecordOverviewDto | null
    registrationRecordId: string | undefined
}

const ProcessingTab = ({ overview, registrationRecordId }: ProcessingTabProps) => {
    const [selectedStep, setSelectedStep] = useState<GetStepsDto | null>(null)
    const [selectedStepIndex, setSelectedStepIndex] = useState<number>(-1)

    const handleStepClick = (step: GetStepsDto, stepIndex: number) => {
        setSelectedStep(step)
        setSelectedStepIndex(stepIndex)
    }

    return (
        <Box sx={{ p: 2 }}>
            {/* Main Layout */}
            <Grid container spacing={3}>
                {/* Left Sidebar - Process Steps */}
                <Grid item xs={12} md={4}>
                    <ProcessSteps
                        registrationRecordId={registrationRecordId}
                        onStepClick={handleStepClick}
                        selectedStepIndex={selectedStepIndex}
                    />
                </Grid>

                {/* Right Main Panel */}
                <Grid item xs={12} md={8}>
                    <MainContent
                        overview={overview}
                        selectedStep={selectedStep}
                        selectedStepIndex={selectedStepIndex >= 0 ? selectedStepIndex : 0}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProcessingTab


