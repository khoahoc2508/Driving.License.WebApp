'use client'

import { Box, Typography, Chip } from '@mui/material'
import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'

type OverviewTabProps = {
    overview: RegistrationRecordOverviewDto | null
}

const OverviewTab = ({ overview }: OverviewTabProps) => {
    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
                Thông tin xử lý
            </Typography>

            {/* Status */}
            <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color="text.secondary" sx={{ mb: 1 }}>
                    Trạng thái:
                </Typography>
                <Chip
                    label="Hoàn thành"
                    color="success"
                    size="small"
                    sx={{ borderRadius: 2 }}
                />
            </Box>

            {/* Health Check Date */}
            <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color="text.secondary" sx={{ mb: 1 }}>
                    Ngày khám sức khỏe:
                </Typography>
                <Typography variant='body2'>
                    {overview?.generalInfo?.healthCheckDate ?
                        new Date(overview.generalInfo.healthCheckDate).toLocaleDateString('vi-VN') :
                        'Chưa có dữ liệu'
                    }
                </Typography>
            </Box>
        </Box>
    )
}

export default OverviewTab
