'use client'

import { useState, useEffect } from 'react'
import { Box, CardContent, Tab, Tabs, Button } from '@mui/material'
import type { RegistrationRecordOverviewDto, GetPaymentDto, GetPaymentHistoryDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import FeeTab from './FeeTab'
import PaymentHistoryTab from './PaymentHistoryTab'
import AddPaymentDialog, { DialogMode } from './AddPaymentDialog'
import AddPaymentHistoryDialog, { DialogMode as PaymentHistoryDialogMode } from './AddPaymentHistoryDialog'

type PaymentsTabProps = {
    overview: RegistrationRecordOverviewDto | null
    registrationRecordId?: string,
    onDataChange: () => void
}

const PaymentsTab = ({ overview, registrationRecordId, onDataChange }: PaymentsTabProps) => {
    const [activeSubTab, setActiveSubTab] = useState(0)
    const [payments, setPayments] = useState<GetPaymentDto[]>([])
    const [paymentHistories, setPaymentHistories] = useState<GetPaymentHistoryDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryLoading, setIsHistoryLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentId, setEditPaymentId] = useState<string | null>(null)
    const [isHistoryAddOpen, setIsHistoryAddOpen] = useState(false)
    const [editPaymentHistoryId, setEditPaymentHistoryId] = useState<string | null>(null)

    useEffect(() => {
        if (registrationRecordId) {
            if (activeSubTab === 0) {
                fetchPayments()
            } else if (activeSubTab === 1) {
                fetchPaymentHistories()
            }
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

    const fetchPaymentHistories = async () => {
        if (!registrationRecordId) return

        try {
            setIsHistoryLoading(true)
            const response = await registrationRecordsAPI.GetPaymentHistoriesByRegistrationRecordId(registrationRecordId)
            if (response?.data?.data) {
                setPaymentHistories(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching payment histories:', error)
            setPaymentHistories([])
        } finally {
            setIsHistoryLoading(false)
        }
    }

    const handleEditPayment = (payment: GetPaymentDto) => {
        setEditPaymentId(payment.id || null)
        setIsAddOpen(true)
    }

    const handleRefresh = () => {
        if (activeSubTab === 0) {
            fetchPayments()
        } else {
            fetchPaymentHistories()
        }
        onDataChange()
    }

    return (
        <CardContent className='px-0 flex-1 h-full flex flex-col justify-between pb-0'>
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
                <PaymentHistoryTab
                    data={paymentHistories}
                    isLoading={isHistoryLoading}
                    onRefresh={handleRefresh}
                    registrationRecordId={registrationRecordId}
                    onAdd={() => { setEditPaymentHistoryId(null); setIsHistoryAddOpen(true) }}
                    onEdit={(paymentHistory: GetPaymentHistoryDto) => { setEditPaymentHistoryId(paymentHistory.id || null); setIsHistoryAddOpen(true) }}
                />
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

            {/* Payment History Add/Edit Dialog */}
            <AddPaymentHistoryDialog
                open={isHistoryAddOpen}
                onClose={() => { setIsHistoryAddOpen(false); setEditPaymentHistoryId(null) }}
                onSuccess={() => { setIsHistoryAddOpen(false); setEditPaymentHistoryId(null); handleRefresh() }}
                registrationRecordId={registrationRecordId as string}
                mode={editPaymentHistoryId ? PaymentHistoryDialogMode.EDIT : PaymentHistoryDialogMode.ADD}
                editPaymentHistoryId={editPaymentHistoryId}
            />
        </CardContent>
    )
}

export default PaymentsTab


