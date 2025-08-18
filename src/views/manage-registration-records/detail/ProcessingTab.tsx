'use client'

import { Box, Card, CardContent, Typography } from '@mui/material'
import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'

type ProcessingTabProps = {
    overview: RegistrationRecordOverviewDto | null
}

const ProcessingTab = ({ overview }: ProcessingTabProps) => {
    const steps = overview?.processing?.steps || []

    return (
        <CardContent>
            <Typography variant='h5' sx={{ mb: 2 }}>Quy trình xử lý</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {steps.length === 0 ? (
                    <Typography variant='body2'>Chưa có dữ liệu</Typography>
                ) : (
                    steps.map((step, idx) => (
                        <Box key={`${step?.name}-${idx}`} sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: 'action.hover',
                            fontSize: 12
                        }}>
                            {step?.name || 'Không xác định'}
                        </Box>
                    ))
                )}
            </Box>

            <div className='mt-4'>
                <Typography variant='body2' color='text.secondary'>Người phụ trách</Typography>
                <Typography variant='body2'>
                    {steps.filter(s => s?.assignee?.name).map(s => `${s?.assignee?.name} (${s?.assignee?.phone})`).join(', ') || 'Chưa có dữ liệu'}
                </Typography>
            </div>

            <div className='mt-4'>
                <Typography variant='body2' color='text.secondary'>Kết quả thi</Typography>
                <Typography variant='body2'>{overview?.processing?.examResultStatus ? 'Đã có' : 'Chưa có'}</Typography>
            </div>
        </CardContent>
    )
}

export default ProcessingTab


