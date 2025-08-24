'use client'

import { Box, Typography, Chip, Divider, Button } from '@mui/material'
import type { GetStepsDto } from '@/types/stepsTypes'

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
            case 0:
                return 'Chưa xử lý'
            case 1:
                return 'Đang xử lý'
            case 2:
                return 'Hoàn thành'
            default:
                return 'Không xác định'
        }
    }

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0:
                return 'default'
            case 1:
                return 'warning'
            case 2:
                return 'success'
            default:
                return 'default'
        }
    }

    const canUpdateStatus = (status: number) => {
        return status === 0 || status === 1
    }

    const getNextStatus = (currentStatus: number) => {
        switch (currentStatus) {
            case 0:
                return 1
            case 1:
                return 2
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
                            {selectedStep.status === 0 ? 'Bắt đầu xử lý' : 'Hoàn thành'}
                        </Button>
                    )}

                    {selectedStep.status === 0 && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStatusUpdate(1)}
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
