'use client'

import { useState, useRef, forwardRef, useImperativeHandle } from 'react'

import { Box, Grid } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import ProcessSteps, { type ProcessStepsRef } from './components/left/ProcessSteps'
import MainContent, { type MainContentRef } from './components/right/MainContent'

type ProcessingTabProps = {
    registrationRecordId: string | undefined,
    setIsApproved: (isApproved: boolean) => void,
    refreshBasicInfo: () => void
}

export type ProcessingTabRef = {
    refreshSteps: () => void
    refreshTasks: () => void
    refreshStepOverview: () => void,
}

const ProcessingTab = forwardRef<ProcessingTabRef, ProcessingTabProps>(({ registrationRecordId, setIsApproved, refreshBasicInfo }, ref) => {
    const [selectedStep, setSelectedStep] = useState<GetStepsDto | null>(null)
    const [selectedStepIndex, setSelectedStepIndex] = useState<number>(-1)
    const processStepsRef = useRef<ProcessStepsRef>(null)
    const mainContentRef = useRef<MainContentRef>(null)

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

    useImperativeHandle(ref, () => ({
        refreshSteps: () => {
            if (processStepsRef.current) {
                processStepsRef.current.refreshSteps()
            }
        },
        refreshTasks: () => {
            if (mainContentRef.current) {
                mainContentRef.current.refreshTasks()
            }
        },
        refreshStepOverview: () => {
            if (mainContentRef.current) {
                mainContentRef.current.refreshStepOverview()
            }
        }
    }), [])

    return (
        <Box sx={{ p: 2, py: 3, height: '100%', pr: 0 }}>
            <Grid container className='h-full'>
                <Grid item xs={12} md={4}>
                    <ProcessSteps
                        ref={processStepsRef}
                        registrationRecordId={registrationRecordId}
                        onStepClick={handleStepClick}
                        selectedStepIndex={selectedStepIndex}
                        setIsApproved={setIsApproved}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <MainContent
                        ref={mainContentRef}
                        selectedStep={selectedStep}
                        registrationRecordId={registrationRecordId}
                        onRefreshSteps={handleRefreshSteps}
                        refreshBasicInfo={refreshBasicInfo}
                    />
                </Grid>
            </Grid>
        </Box>
    )
})

ProcessingTab.displayName = 'ProcessingTab'

export default ProcessingTab


