'use client'

import { Box, Typography, Chip, Divider } from '@mui/material'
import type { GetStepsDto, StepOverviewDto } from '@/types/stepsTypes'
import CONFIG from '@/configs/config'
import { useEffect, useState } from 'react'
import stepsAPI from '@/libs/api/stepsAPI'

type OverviewTabProps = {
    selectedStep: GetStepsDto | null
}

const OverviewTab = ({ selectedStep }: OverviewTabProps) => {

    const [stepOverview, setStepOverview] = useState<StepOverviewDto | null>(null)

    useEffect(() => {
        if (selectedStep?.id) {
            fetchStepOverview(selectedStep.id)
        }
    }, [selectedStep])

    const fetchStepOverview = async (id: string) => {
        const response = await stepsAPI.GetStepByStepIdOverview({ id })
        setStepOverview(response?.data?.data)
    }

    if (!selectedStep) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    Vui lòng chọn một bước để xem thông tin tổng quan
                </Typography>
            </Box>
        )
    }

    const getStatusText = (status: number) => {
        switch (status) {
            case CONFIG.StepStatus.Pending:
                return 'Chưa xử lý'
            case CONFIG.StepStatus.InProgress:
                return 'Đang xử lý'
            case CONFIG.StepStatus.Completed:
                return 'Hoàn thành'
            default:
                return 'Không xác định'
        }
    }

    const getStatusColor = (status: number) => {
        switch (status) {
            case CONFIG.StepStatus.Pending:
                return 'default'
            case CONFIG.StepStatus.InProgress:
                return 'warning'
            case CONFIG.StepStatus.Completed:
                return 'success'
            default:
                return 'default'
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 2, p: 4, display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Trạng thái:
                </Typography>
                <Chip
                    label={getStatusText(stepOverview?.processing?.status || 0)}
                    color={getStatusColor(stepOverview?.processing?.status || 0)}
                    size="small"
                    sx={{ width: 'fit-content' }}
                />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ p: 4 }}>
                {
                    stepOverview?.generalInfo?.items?.map((item) => (
                        <Box key={item.label} sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                {item.label}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {item.value}
                            </Typography>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

export default OverviewTab
