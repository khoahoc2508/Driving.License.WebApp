'use client'

import { useState } from 'react'

import { Box, Grid } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import ProcessSteps from './components/left/ProcessSteps'
import MainContent from './components/right/MainContent'

type ProcessingTabProps = {
    registrationRecordId: string | undefined
}

const ProcessingTab = ({ registrationRecordId }: ProcessingTabProps) => {
    const [selectedStep, setSelectedStep] = useState<GetStepsDto | null>(null)
    const [selectedStepIndex, setSelectedStepIndex] = useState<number>(-1)

    const handleStepClick = (step: GetStepsDto, stepIndex: number) => {
        setSelectedStep(step)
        setSelectedStepIndex(stepIndex)
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <ProcessSteps
                        registrationRecordId={registrationRecordId}
                        onStepClick={handleStepClick}
                        selectedStepIndex={selectedStepIndex}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <MainContent
                        selectedStep={selectedStep}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProcessingTab


