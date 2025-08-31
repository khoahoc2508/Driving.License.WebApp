'use client'

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

import { Box, Paper, Typography, CircularProgress, Stepper, Step, StepLabel, useTheme } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import stepsAPI from '@/libs/api/stepsAPI'
import StepperWrapper from '@/@core/styles/stepper'
import styles from './ProcessSteps.module.css'
import CONFIG from '@/configs/config'

type ProcessStepsProps = {
    registrationRecordId: string | undefined
    onStepClick?: (step: GetStepsDto, stepIndex: number) => void
    selectedStepIndex?: number
}

export type ProcessStepsRef = {
    refreshSteps: () => void
}

const CustomStepIcon = ({ step }: { step: GetStepsDto; index: number }) => {
    const theme = useTheme()

    const getStepIcon = (status: number | undefined) => {
        switch (status) {
            case CONFIG.StepStatus.Completed: // Completed - Xanh lá
                return (
                    <Box
                        sx={{
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.success.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                )
            case CONFIG.StepStatus.InProgress: // In Progress - Cam
                return (
                    <Box
                        sx={{
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.warning.main,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                )
            case CONFIG.StepStatus.Pending: // Pending - Xám
                return (
                    <Box
                        sx={{
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.text.disabled,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                )
            default: // Pending - Xám
                return (
                    <Box
                        sx={{
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.text.disabled,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                )
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: 'transparent'
            }}
        >
            {getStepIcon(step.status)}
        </Box>
    )
}

const ProcessSteps = forwardRef<ProcessStepsRef, ProcessStepsProps>(({ registrationRecordId, onStepClick, selectedStepIndex }, ref) => {
    const [steps, setSteps] = useState<GetStepsDto[]>([])
    const [loading, setLoading] = useState(true)
    const theme = useTheme()

    const fetchSteps = async () => {
        if (!registrationRecordId) return

        try {
            setLoading(true)

            const response = await stepsAPI.GetStepsByRegistrationRecordId({
                registrationRecordId
            })

            if (response.data?.success && response.data?.data) {
                setSteps(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching steps:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (registrationRecordId) {
            fetchSteps()
        }
    }, [registrationRecordId])

    // Expose fetchSteps function to parent component
    useImperativeHandle(ref, () => ({
        refreshSteps: fetchSteps
    }), [registrationRecordId])

    const handleStepClick = (step: GetStepsDto, stepIndex: number) => {
        if (onStepClick) {
            onStepClick(step, stepIndex)
        }
    }

    useEffect(() => {
        if (steps.length > 0 && selectedStepIndex === undefined && onStepClick) {
            onStepClick(steps[0], 0)
        }
    }, [steps, selectedStepIndex, onStepClick])

    if (loading) {
        return (
            <Paper elevation={1} sx={{ p: 2, height: 'fit-content' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            </Paper>
        )
    }

    return (
        steps.length === 0 ? (
            <Typography variant='body2' color="text.secondary">
                Chưa có dữ liệu
            </Typography>
        ) : (
            <Box className={styles.processStepsContainer}>
                <StepperWrapper>
                    <Stepper activeStep={selectedStepIndex} orientation="vertical" className='p-4'>
                        {steps.map((step, index) => {
                            const labelProps: {
                                error?: boolean
                            } = {}

                            const getTextColor = (status: number | undefined) => {
                                switch (status) {
                                    case CONFIG.StepStatus.Completed: // Completed
                                        return theme.palette.success.main
                                    case CONFIG.StepStatus.InProgress: // In Progress
                                        return theme.palette.warning.main
                                    case CONFIG.StepStatus.Pending: // Pending
                                        return theme.palette.text.disabled
                                    default: // Pending
                                        return theme.palette.text.disabled
                                }
                            }

                            const isSelected = index === selectedStepIndex

                            //const isStepClickable = step.status !== CONFIG.StepStatus.Pending
                            const isStepClickable = true

                            return (
                                <Step
                                    key={index}
                                    completed={step.status === CONFIG.StepStatus.Completed}
                                    active={step.status === CONFIG.StepStatus.InProgress}
                                    data-active={isSelected}
                                    data-status={step.status}
                                >
                                    <StepLabel
                                        {...labelProps}
                                        slots={{
                                            stepIcon: () => <CustomStepIcon step={step} index={index} />
                                        }}
                                        sx={{
                                            '& .MuiStepLabel-labelContainer': {
                                                '& .step-label': {
                                                    color: getTextColor(step.status),
                                                    fontSize: '14px'
                                                }
                                            }
                                        }}
                                    >
                                        <div
                                            className='step-label'
                                            style={{
                                                color: getTextColor(step.status),
                                                cursor: isStepClickable ? 'pointer' : 'not-allowed',
                                                fontWeight: isSelected ? 600 : 400,
                                                opacity: isStepClickable ? 1 : 0.6
                                            }}
                                            onClick={() => {
                                                if (isStepClickable) {
                                                    handleStepClick(step, index)
                                                }
                                            }}
                                        >
                                            {step.name}
                                        </div>
                                    </StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                </StepperWrapper>
            </Box>
        )
    )
})

export default ProcessSteps
