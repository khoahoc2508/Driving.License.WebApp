'use client'

import { useEffect, useState, forwardRef, useImperativeHandle, memo } from 'react'

import { Box, Typography, Stepper, Step, StepLabel, useTheme } from '@mui/material'

import type { GetStepsDto, StepStatusType } from '@/types/stepsTypes'
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
    updateStepStatus: (stepId: string, status: StepStatusType) => void
    updateStepStatusByIndex: (stepIndex: number, status: StepStatusType) => void
}

const StepItem = memo(({ step, index, isSelected, onStepClick, getTextColor }: {
    step: GetStepsDto
    index: number
    isSelected: boolean
    onStepClick: (step: GetStepsDto, stepIndex: number) => void
    getTextColor: (status: number | undefined) => string
}) => {
    const isStepClickable = true
    const labelProps: {
        error?: boolean
    } = {}

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
                        opacity: isStepClickable ? 1 : 0.6
                    }}
                    onClick={() => {
                        if (isStepClickable) {
                            onStepClick(step, index)
                        }
                    }}
                >
                    {step.name}
                </div>
            </StepLabel>
        </Step>
    )
})

StepItem.displayName = 'StepItem'

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
            setLoading(false)

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
        refreshSteps: fetchSteps,
        updateStepStatus: (stepId: string, status: StepStatusType) => {
            setSteps(prevSteps => {
                const newSteps = [...prevSteps]
                // Tìm step theo ID và cập nhật status
                const targetIndex = newSteps.findIndex(step => step.id === stepId)
                if (targetIndex >= 0 && newSteps[targetIndex]) {
                    newSteps[targetIndex] = { ...newSteps[targetIndex], status }
                }
                return newSteps
            })
        },
        updateStepStatusByIndex: (stepIndex: number, status: StepStatusType) => {
            setSteps(prevSteps => {
                const newSteps = [...prevSteps]
                // Nếu stepIndex = -1, cập nhật step cuối cùng
                const targetIndex = stepIndex === -1 ? newSteps.length - 1 : stepIndex
                if (newSteps[targetIndex]) {
                    newSteps[targetIndex] = { ...newSteps[targetIndex], status }
                }
                return newSteps
            })
        }
    }), [registrationRecordId])

    const handleStepClick = (step: GetStepsDto, stepIndex: number) => {
        if (onStepClick) {
            onStepClick(step, stepIndex)
        }
    }

    useEffect(() => {
        if (steps.length > 0 && (selectedStepIndex === undefined || selectedStepIndex < 0) && onStepClick) {
            const lastInProgressIndex = steps
                .map((s, i) => (s.status === CONFIG.StepStatus.InProgress ? i : -1))
                .filter(i => i >= 0)
                .pop()

            const defaultIndex = lastInProgressIndex !== undefined ? lastInProgressIndex : 0

            onStepClick(steps[defaultIndex], defaultIndex)
        }
    }, [steps, selectedStepIndex, onStepClick])


    return (
        steps.length === 0 ? (
            <Box>
                <Typography variant='body2' color="text.secondary" className='text-center'>
                    Chưa có dữ liệu
                </Typography>
            </Box>
        ) : (
            <Box className={styles.processStepsContainer}>
                <StepperWrapper>
                    <Stepper activeStep={selectedStepIndex} orientation="vertical" className='p-4'>
                        {steps.map((step, index) => {
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

                            return (
                                <StepItem
                                    key={`${step.id}-${index}`}
                                    step={step}
                                    index={index}
                                    isSelected={isSelected}
                                    onStepClick={handleStepClick}
                                    getTextColor={getTextColor}
                                />
                            )
                        })}
                    </Stepper>
                </StepperWrapper>
            </Box>
        )
    )
})

export default ProcessSteps
