'use client'

import { Card, CardContent, Typography } from '@mui/material'
import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'

type PaymentsTabProps = {
    overview: RegistrationRecordOverviewDto | null
}

const PaymentsTab = ({ overview }: PaymentsTabProps) => {
    const currency = (value?: number | null) => {
        if (value === undefined || value === null) return 'Chưa có dữ liệu'
        return new Intl.NumberFormat('vi-VN').format(value)
    }

    return (
        <CardContent>
            <Typography variant='h5' sx={{ mb: 2 }}>Tổng quan thanh toán</Typography>
            <div className='grid grid-cols-2 gap-y-1'>
                <Typography variant='body2'>Tổng cần thanh toán:</Typography>
                <Typography variant='body2'>{currency(overview?.paymentSummary?.totalAmount)}</Typography>
                <Typography variant='body2'>Đã thanh toán:</Typography>
                <Typography variant='body2'>{currency(overview?.paymentSummary?.paidAmount)}</Typography>
                <Typography variant='body2'>Còn thiếu:</Typography>
                <Typography variant='body2' sx={{ color: 'error.main' }}>{currency(overview?.paymentSummary?.remainingAmount)}</Typography>
            </div>
        </CardContent>
    )
}

export default PaymentsTab


