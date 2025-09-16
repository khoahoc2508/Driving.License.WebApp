'use client'

import { useState, useEffect } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { CardContent, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'


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

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [activeSubTab, setActiveSubTab] = useState<string>(CONFIG.RegistrationRecordPaymentsTabs.Fees)
    const [payments, setPayments] = useState<GetPaymentDto[]>([])
    const [paymentHistories, setPaymentHistories] = useState<GetPaymentHistoryDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isHistoryLoading, setIsHistoryLoading] = useState(false)
    const [historySearch, setHistorySearch] = useState('')
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentId, setEditPaymentId] = useState<string | null>(null)
    const [isHistoryAddOpen, setIsHistoryAddOpen] = useState(false)
    const [editPaymentHistoryId, setEditPaymentHistoryId] = useState<string | null>(null)
    const [defaultHistoryPaymentId, setDefaultHistoryPaymentId] = useState<string | undefined>(undefined)
    const [defaultHistoryAmount, setDefaultHistoryAmount] = useState<number | undefined>(undefined)

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
        if (!registrationRecordId) return

        if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees) {
            fetchPayments()
        } else if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.History) {
            fetchPaymentHistories(historySearch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationRecordId, activeSubTab, historySearch])

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

    const fetchPaymentHistories = async (search?: string) => {
        if (!registrationRecordId) return
        try {
            setIsHistoryLoading(true)
            const response = await registrationRecordsAPI.GetAllPaymentHistoriesByRegistrationRecordId(registrationRecordId, search)

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

    const handleAddPaymentHistoryFromFee = (payment: GetPaymentDto) => {
        setDefaultHistoryPaymentId(payment.id)
        setDefaultHistoryAmount(payment.remainingAmount)
        setEditPaymentHistoryId(null)
        setIsHistoryAddOpen(true)
    }

    const handleViewHistory = (payment: GetPaymentDto) => {
        const nextTab = CONFIG.RegistrationRecordPaymentsTabs.History
        setActiveSubTab(nextTab)
        setHistorySearch(payment.feeTypeName?.toLowerCase() || '')

        const qs = new URLSearchParams(Array.from(searchParams.entries()))
        qs.set('paymentsTab', nextTab)
        router.replace(`${pathname}?${qs.toString()}`)
    }

    const handleRefresh = () => {
        if (activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees) {
            fetchPayments()
        } else {
            fetchPaymentHistories(historySearch)
        }
        onDataChange()
    }

    const handleSearchHistories = (value: string | number) => {
        const v = String(value)
        setHistorySearch(v)
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
        <CardContent
            className='px-0 flex-1 h-full flex flex-col justify-between pb-0'
            sx={{ p: isMobile ? 2 : 4, py: 4 }}
        >
            {/* Sub-tabs */}
            <Tabs
                value={activeSubTab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
                allowScrollButtonsMobile={isMobile}
                sx={{
                    mb: 3,
                    '& .MuiTabs-scrollButtons': {
                        '&.Mui-disabled': {
                            opacity: 0.3,
                        },
                    },
                }}
            >
                <Tab
                    value={CONFIG.RegistrationRecordPaymentsTabs.Fees}
                    label="Bảng khoản phí"
                    sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
                />
                <Tab
                    value={CONFIG.RegistrationRecordPaymentsTabs.History}
                    label="Lịch sử thanh toán"
                    sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
                />
            </Tabs>

            {/* Fee Table Tab */}
            {activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.Fees && (
                <FeeTab
                    data={payments}
                    isLoading={isLoading}
                    onEditPayment={handleEditPayment}
                    onRefresh={handleRefresh}
                    onAdd={() => { setEditPaymentId(null); setIsAddOpen(true) }}
                    onAddPaymentHistory={handleAddPaymentHistoryFromFee}
                    onViewHistory={handleViewHistory}
                />
            )}

            {/* Payment History Tab */}
            {activeSubTab === CONFIG.RegistrationRecordPaymentsTabs.History && (
                <PaymentHistoryTab
                    data={paymentHistories}
                    isLoading={isHistoryLoading}
                    onRefresh={handleRefresh}
                    registrationRecordId={registrationRecordId}
                    search={historySearch}
                    onSearch={handleSearchHistories}
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
                defaultPaymentId={defaultHistoryPaymentId}
                defaultAmount={defaultHistoryAmount}
            />
        </CardContent>
    )
}

export default PaymentsTab


