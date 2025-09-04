'use client'

import { useState, useEffect } from 'react'

import { CardContent, Tab, Tabs } from '@mui/material'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import CONFIG from '@/configs/config'
import type { GetPaymentDto, GetPaymentHistoryDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import FeeTab from './FeeTab'
import PaymentHistoryTab from './PaymentHistoryTab'
import AddPaymentDialog, { DialogMode } from './AddPaymentDialog'
import AddPaymentHistoryDialog, { DialogMode as PaymentHistoryDialogMode } from './AddPaymentHistoryDialog'

type PaymentsTabProps = {
    registrationRecordId?: string,
    onDataChange: () => void
}

const PaymentsTab = ({ registrationRecordId, onDataChange }: PaymentsTabProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [activeSubTab, setActiveSubTab] = useState<string>(CONFIG.RegistrationRecordPaymentsTabs.Fees)
    const [payments, setPayments] = useState<GetPaymentDto[]>([])
    const [paymentHistories, setPaymentHistories] = useState<GetPaymentHistoryDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryLoading, setIsHistoryLoading] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentId, setEditPaymentId] = useState<string | null>(null)
    const [isHistoryAddOpen, setIsHistoryAddOpen] = useState(false)
    const [editPaymentHistoryId, setEditPaymentHistoryId] = useState<string | null>(null)

    const tabKeys = [
        CONFIG.RegistrationRecordPaymentsTabs.Fees,
        CONFIG.RegistrationRecordPaymentsTabs.History
    ] as const

    useEffect(() => {
        const tabParam = searchParams.get('paymentsTab') || CONFIG.RegistrationRecordPaymentsTabs.Fees
        const isValid = tabKeys.includes(tabParam as typeof tabKeys[number])
        setActiveSubTab(isValid ? tabParam : CONFIG.RegistrationRecordPaymentsTabs.Fees)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    useEffect(() => {
        if (registrationRecordId) {
            if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees) {
                fetchPayments()
            } else if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.History) {
                fetchPaymentHistories()
            }
        }
    }, [registrationRecordId, activeSubTab])

    const fetchPayments = async () => {
        if (!registrationRecordId) return

        try {
            setIsLoading(true)
            const response = await registrationRecordsAPI.GetAllPaymentsByRegistrationRecordId(registrationRecordId)

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
            const response = await registrationRecordsAPI.GetAllPaymentHistoriesByRegistrationRecordId(registrationRecordId)

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
        if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees) {
            fetchPayments()
        } else {
            fetchPaymentHistories()
        }

        onDataChange()
    }

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setActiveSubTab(newValue)
        const nextTab = tabKeys.includes(newValue as typeof tabKeys[number])
            ? newValue
            : CONFIG.RegistrationRecordPaymentsTabs.Fees
        const qs = new URLSearchParams(Array.from(searchParams.entries()))
        qs.set('paymentsTab', nextTab)
        router.replace(`${pathname}?${qs.toString()}`)
    }

    return (
        <CardContent className='px-0 flex-1 h-full flex flex-col justify-between pb-0'>
            {/* Sub-tabs */}
            <Tabs value={activeSubTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab value={CONFIG.RegistrationRecordPaymentsTabs.Fees} label="Bảng khoản phí" />
                <Tab value={CONFIG.RegistrationRecordPaymentsTabs.History} label="Lịch sử thanh toán" />
            </Tabs>

            {/* Fee Table Tab */}
            {activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees && (
                <FeeTab
                    data={payments}
                    isLoading={isLoading}
                    onEditPayment={handleEditPayment}
                    onRefresh={handleRefresh}
                    onAdd={() => { setEditPaymentId(null); setIsAddOpen(true) }}
                />
            )}

            {/* Payment History Tab */}
            {activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.History && (
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


