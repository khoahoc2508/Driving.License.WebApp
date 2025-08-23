'use client'

import { Box, Paper, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { IconCircleCheck, IconCircle, IconRadio } from '@tabler/icons-react'

import type { GetStepsDto } from '@/types/stepsTypes'
import stepsAPI from '@/libs/api/stepsAPI'

type ProcessStepsProps = {
    registrationRecordId: string | undefined
}

const ProcessSteps = ({ registrationRecordId }: ProcessStepsProps) => {
    const [steps, setSteps] = useState<GetStepsDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

        if (registrationRecordId) {
            fetchSteps()
        }
    }, [registrationRecordId])

    const getStepIcon = (status: number | undefined) => {
        switch (status) {
            case 0: // Completed
                return <IconCircleCheck size={20} color="#2E7D32" />
            case 1: // In Progress
                return <IconRadio size={20} color="#ED6C02" />
            case 2: // Next
                return <IconCircle size={20} color="#2E7D32" />
            default:
                return <IconCircle size={20} color="#9E9E9E" />
        }
    }

    const getStepColor = (status: number | undefined) => {
        switch (status) {
            case 0: // Completed
                return '#2E7D32'
            case 1: // In Progress
                return '#ED6C02'
            case 2: // Next
                return '#2E7D32'
            default:
                return '#9E9E9E'
        }
    }

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
        <Paper elevation={1} sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                Quy trình xử lý
            </Typography>

            {/* Steps List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {steps.length === 0 ? (
                    <Typography variant='body2' color="text.secondary">
                        Chưa có dữ liệu
                    </Typography>
                ) : (
                    steps.map((step, idx) => (
                        <Box key={`${step?.id || step?.name}-${idx}`}>
                            {/* Step Item */}
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                py: 1.5,
                                px: 1,
                                position: 'relative'
                            }}>
                                {/* Step Icon */}
                                <Box sx={{ flexShrink: 0 }}>
                                    {getStepIcon(step?.status)}
                                </Box>

                                {/* Step Name */}
                                <Typography
                                    variant='body2'
                                    sx={{
                                        fontSize: 13,
                                        color: getStepColor(step?.status),
                                        fontWeight: step?.status === 1 ? 600 : 400,
                                        flex: 1
                                    }}
                                >
                                    {step?.name || 'Không xác định'}
                                </Typography>
                            </Box>

                            {/* Connecting Line (except for last item) */}
                            {idx < steps.length - 1 && (
                                <Box sx={{
                                    width: 2,
                                    height: 20,
                                    backgroundColor: 'grey.300',
                                    marginLeft: '9px', // Center the line with the icon
                                    marginTop: '-8px',
                                    marginBottom: '-8px'
                                }} />
                            )}
                        </Box>
                    ))
                )}
            </Box>
        </Paper>
    )
}

export default ProcessSteps
