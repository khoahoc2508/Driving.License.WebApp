'use client'

import { useState, useRef } from 'react'

import { Box, Grid } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import ProcessSteps, { type ProcessStepsRef } from './components/left/ProcessSteps'
import MainContent from './components/right/MainContent'

type ProcessingTabProps = {
    registrationRecordId: string | undefined
}

const ProcessingTab = ({ registrationRecordId }: ProcessingTabProps) => {
    const [selectedStep, setSelectedStep] = useState<GetStepsDto | null>(null)
    const [selectedStepIndex, setSelectedStepIndex] = useState<number>(-1)
    const processStepsRef = useRef<ProcessStepsRef>(null)

    const handleStepClick = (step: GetStepsDto, stepIndex: number) => {
        setSelectedStep(step)
        setSelectedStepIndex(stepIndex)
    }

    const handleRefreshSteps = (newStepsCount: number = 1) => {
        if (processStepsRef.current) {
            processStepsRef.current.refreshSteps()
            setSelectedStepIndex(prev => prev + newStepsCount)
        }
    }

    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <ProcessSteps
                        ref={processStepsRef}
                        registrationRecordId={registrationRecordId}
                        onStepClick={handleStepClick}
                        selectedStepIndex={selectedStepIndex}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <MainContent
                        selectedStep={selectedStep}
                        registrationRecordId={registrationRecordId}
                        onRefreshSteps={handleRefreshSteps}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProcessingTab


