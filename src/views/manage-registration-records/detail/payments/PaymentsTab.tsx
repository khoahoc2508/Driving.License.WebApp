'use client'

import { useState, useEffect } from 'react'
import { Box, CardContent, Tab, Tabs, Button } from '@mui/material'
import type { RegistrationRecordOverviewDto, GetPaymentDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import FeeTab from './FeeTab'
import PaymentHistoryTab from './PaymentHistoryTab'

type PaymentsTabProps = {
    overview: RegistrationRecordOverviewDto | null
    registrationRecordId?: string
}

const PaymentsTab = ({ overview, registrationRecordId }: PaymentsTabProps) => {
    const [activeSubTab, setActiveSubTab] = useState(0)
    const [payments, setPayments] = useState<GetPaymentDto[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (registrationRecordId && activeSubTab === 0) {
            fetchPayments()
        }
    }, [registrationRecordId, activeSubTab])

    const fetchPayments = async () => {
        if (!registrationRecordId) return

        try {
            setIsLoading(true)
            const response = await registrationRecordsAPI.GetPaymentsByRegistrationRecordId(registrationRecordId)
            if (response?.data?.data) {
                setPayments(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching payments:', error)
            setPayments([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditPayment = (payment: GetPaymentDto) => {
        // TODO: Implement edit payment
        console.log('Edit payment:', payment)
    }

    const handleRefresh = () => {
        fetchPayments()
    }

    return (
        <CardContent className='px-0'>
            {/* Sub-tabs */}
            <Tabs value={activeSubTab} onChange={(_, v) => setActiveSubTab(v)} sx={{ mb: 3 }}>
                <Tab label="Bảng khoản phí" />
                <Tab label="Lịch sử thanh toán" />
            </Tabs>

            {/* Fee Table Tab */}
            {activeSubTab === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{
                                borderColor: 'primary.main',
                                color: 'primary.main',
                            }}
                        >
                            THÊM MỚI
                        </Button>
                    </Box>

                    <FeeTab
                        data={payments}
                        isLoading={isLoading}
                        onEditPayment={handleEditPayment}
                        onRefresh={handleRefresh}
                    />
                </Box>
            )}

            {/* Payment History Tab */}
            {activeSubTab === 1 && (
                <PaymentHistoryTab />
            )}
        </CardContent>
    )
}

export default PaymentsTab


