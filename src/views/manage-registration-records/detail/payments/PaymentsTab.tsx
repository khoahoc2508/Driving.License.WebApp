'use client'

import { useState, useEffect } from 'react'
import { Box, CardContent, Tab, Tabs, Button } from '@mui/material'
import type { RegistrationRecordOverviewDto, GetPaymentDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import FeeTab from './FeeTab'
import PaymentHistoryTab from './PaymentHistoryTab'
import AddPaymentDialog, { DialogMode } from './AddPaymentDialog'

type PaymentsTabProps = {
    overview: RegistrationRecordOverviewDto | null
    registrationRecordId?: string
}

const PaymentsTab = ({ overview, registrationRecordId }: PaymentsTabProps) => {
    const [activeSubTab, setActiveSubTab] = useState(0)
    const [payments, setPayments] = useState<GetPaymentDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentId, setEditPaymentId] = useState<string | null>(null)

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
        setEditPaymentId(payment.id || null)
        setIsAddOpen(true)
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
                <FeeTab
                    data={payments}
                    isLoading={isLoading}
                    onEditPayment={handleEditPayment}
                    onRefresh={handleRefresh}
                    registrationRecordId={registrationRecordId}
                    onAdd={() => { setEditPaymentId(null); setIsAddOpen(true) }}
                />

            )}

            {/* Payment History Tab */}
            {activeSubTab === 1 && (
                <PaymentHistoryTab />
            )}

            {/* Shared Add/Edit Dialog */}
            <AddPaymentDialog
                open={isAddOpen}
                onClose={() => { setIsAddOpen(false); setEditPaymentId(null) }}
                onSuccess={() => { setIsAddOpen(false); setEditPaymentId(null); handleRefresh() }}
                registrationRecordId={registrationRecordId as string}
                mode={editPaymentId ? DialogMode.EDIT : DialogMode.ADD}
                editPaymentId={editPaymentId}
            />
        </CardContent>
    )
}

export default PaymentsTab


