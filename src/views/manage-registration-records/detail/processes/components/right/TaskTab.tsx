'use client'

import { Box, Typography, Chip, Divider, Button } from '@mui/material'
import type { GetStepsDto } from '@/types/stepsTypes'
import CONFIG from '@/configs/config'

type TaskTabProps = {
    selectedStep: GetStepsDto | null
}

const TaskTab = ({ selectedStep }: TaskTabProps) => {
    if (!selectedStep) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    Vui lòng chọn một bước để xem thông tin công việc
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

    const canUpdateStatus = (status: number) => {
        return status === CONFIG.StepStatus.Pending || status === CONFIG.StepStatus.InProgress
    }

    const getNextStatus = (currentStatus: number) => {
        switch (currentStatus) {
            case CONFIG.StepStatus.Pending:
                return CONFIG.StepStatus.InProgress
            case CONFIG.StepStatus.InProgress:
                return CONFIG.StepStatus.Completed
            default:
                return currentStatus
        }
    }

    const handleStatusUpdate = (newStatus: number) => {
        // TODO: Implement status update logic
        console.log(`Updating step ${selectedStep.id} status to ${newStatus}`)
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
                Công việc - {selectedStep.name}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Trạng thái hiện tại:
                </Typography>
                <Chip
                    label={getStatusText(selectedStep.status || 0)}
                    color={getStatusColor(selectedStep.status || 0)}
                    size="small"
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Tên công việc:
                </Typography>
                <Typography variant="body1">
                    {selectedStep.name || 'Không có tên'}
                </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Thứ tự thực hiện:
                </Typography>
                <Typography variant="body1">
                    {selectedStep.order || 'Không có thứ tự'}
                </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Người thực hiện:
                </Typography>
                <Typography variant="body1">
                    {selectedStep.assigneeId || 'Chưa được giao'}
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Hành động:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {canUpdateStatus(selectedStep.status || 0) && (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStatusUpdate(getNextStatus(selectedStep.status || 0))}
                        >
                            {selectedStep.status === CONFIG.StepStatus.Pending ? 'Bắt đầu xử lý' : 'Hoàn thành'}
                        </Button>
                    )}

                    {selectedStep.status === CONFIG.StepStatus.Pending && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStatusUpdate(CONFIG.StepStatus.InProgress)}
                        >
                            Giao việc
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default TaskTab
