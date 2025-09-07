'use client'

import { useEffect, useState, useMemo } from 'react'

import { Avatar, Box, CardContent, Chip, Divider, Typography } from '@mui/material'

import type { RegistrationRecordOverviewDto } from '@/types/registrationRecords'
import { formatCurrency, formatDate } from '@/utils/helpers'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'

type OverviewTabProps = {
    registrationRecordId?: string
}

const OverviewTab = ({ registrationRecordId }: OverviewTabProps) => {
    const [overview, setOverview] = useState<RegistrationRecordOverviewDto | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchOverview = async (id: string) => {
        try {
            setIsLoading(true)
            const overviewRes = await registrationRecordsAPI.GetRegistrationRecordOverview(id)
            setOverview(overviewRes?.data?.data || null)
        } catch (error) {
            setOverview(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (registrationRecordId) {
            fetchOverview(registrationRecordId)
        }
    }, [registrationRecordId])

    const processingStepChips = useMemo(() => {
        const steps = overview?.processing?.steps || []


        return steps.map((step, index) => (
            <Chip
                key={`${step?.name}-${index}`}
                label={step?.name || 'Không xác định'}
                color='warning'
                variant='tonal'
                size='small'
                sx={{ mr: 1, mb: 1 }}
            />
        ))
    }, [overview])

    if (isLoading) {
        return (
            <CardContent>
                <Box sx={{ width: 150, height: 28, bgcolor: 'action.hover', borderRadius: 1, mb: 4 }} />

                {/* Xử lý hồ sơ skeleton */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, alignItems: 'center', mb: 5 }}>
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ width: 80, height: 24, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 100, height: 24, bgcolor: 'action.hover', borderRadius: 1 }} />
                    </Box>
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 200, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 60, height: 24, bgcolor: 'action.hover', borderRadius: 1 }} />
                </Box>

                <Divider sx={{ my: 5 }} />

                {/* Thanh toán skeleton */}
                <Box sx={{ width: 150, height: 28, bgcolor: 'action.hover', borderRadius: 1, mb: 4 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, alignItems: 'center', mb: 5 }}>
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                </Box>

                <Divider sx={{ my: 5 }} />

                {/* Thông tin chung skeleton */}
                <Box sx={{ width: 150, height: 28, bgcolor: 'action.hover', borderRadius: 1, mb: 4 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 6, mb: 5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                        <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 150, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                        <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 200, height: 40, bgcolor: 'action.hover', borderRadius: 1 }} />
                    </Box>
                </Box>

                <Divider sx={{ my: 5 }} />

                {/* Cộng tác viên skeleton */}
                <Box sx={{ width: 150, height: 28, bgcolor: 'action.hover', borderRadius: 1, mb: 4 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'action.hover', borderRadius: '50%' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                        <Box sx={{ width: 100, height: 16, bgcolor: 'action.hover', borderRadius: 1 }} />
                    </Box>
                </Box>
            </CardContent>
        )
    }

    return (
        <CardContent>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>Xử lý hồ sơ</Typography>
            <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Tình trạng xử lý:</Typography>
                    <Box>{processingStepChips}</Box>

                    <Typography variant="body2" color="text.secondary">Nhân viên:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {overview?.processing?.steps?.filter(s => s?.assignee?.name).map((s) => `${s?.assignee?.name} (${s?.assignee?.phone})`).join(', ') || 'Chưa có dữ liệu'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Kết quả thi:</Typography>
                    <Box>
                        {(() => {
                            const status = overview?.processing?.examResultStatus

                            if (!status) return <Chip label="Chưa có dữ liệu" size='small' variant='tonal' />

                            let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default'
                            let label = ''

                            switch (status) {
                                case 1: // Passed
                                    color = 'success'
                                    label = 'Đỗ'
                                    break
                                case 2: // Failed
                                    color = 'error'
                                    label = 'Trượt'
                                    break
                                case 3: // Not yet taken
                                    color = 'default'
                                    label = 'Chưa thi'
                                    break
                                default:
                                    color = 'default'
                                    label = 'Không xác định'
                            }

                            return <Chip label={label} color={color} size='small' variant='filled' />
                        })()}
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* Thanh toán */}
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>Thanh toán</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Còn thiếu:</Typography>
                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>{formatCurrency(overview?.paymentSummary?.remainingAmount)}</Typography>
                <Typography variant="body2" color="text.secondary">Đã thanh toán:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(overview?.paymentSummary?.paidAmount)}</Typography>
                <Typography variant="body2" color="text.secondary">Tổng cần thanh toán:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(overview?.paymentSummary?.totalAmount)}</Typography>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* Thông tin chung */}
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>Thông tin chung</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 6 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                    <Typography variant="body2" color="text.secondary">Số điện thoại:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{overview?.generalInfo?.phone || 'Chưa có dữ liệu'}</Typography>
                    <Typography variant="body2" color="text.secondary">Ngày khám sức khỏe:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(overview?.generalInfo?.healthCheckDate)}</Typography>
                    <Typography variant="body2" color="text.secondary">Ngày nhận hồ sơ:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(overview?.generalInfo?.receivedDate)}</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Ghi chú:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{overview?.generalInfo?.note || 'Chưa có dữ liệu'}</Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 5 }} />

            {/* Cộng tác viên */}
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>Cộng tác viên</Typography>
            {overview?.collaborator ? (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={overview?.collaborator?.avatarUrl ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${overview.collaborator.avatarUrl}` : undefined}
                        sx={{ width: 40, height: 40 }}
                    />
                    <div className="flex flex-col">
                        <Typography>{overview?.collaborator?.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>{overview?.collaborator?.phone}</Typography>
                    </div>
                </div>
            ) : (
                <Typography variant="body2">Chưa có dữ liệu</Typography>
            )}
        </CardContent>
    )
}

export default OverviewTab


