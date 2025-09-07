'use client'

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Box, Tabs, Tab } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import CONFIG from '@/configs/config'

import OverviewTab from './overview/OverviewTab'
import TaskTab, { type TaskTabRef } from './task/TaskTab'

type MainContentProps = {
    selectedStep: GetStepsDto | null
    registrationRecordId: string | undefined
    onRefreshSteps: (newStepsCount?: number) => void
}

export type MainContentRef = {
    refreshTasks: () => void
}

const MainContent = forwardRef<MainContentRef, MainContentProps>(({ selectedStep, registrationRecordId, onRefreshSteps }, ref) => {
    const [tabValue, setTabValue] = useState<string>(CONFIG.RegistrationRecordProcessTabs.Overview)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const taskTabRef = useRef<TaskTabRef>(null)

    const tabKeys = [CONFIG.RegistrationRecordProcessTabs.Overview, CONFIG.RegistrationRecordProcessTabs.Tasks] as const

    useEffect(() => {
        const tabParam = searchParams.get('processTab') || CONFIG.RegistrationRecordProcessTabs.Overview
        const isValid = tabKeys.includes(tabParam as typeof tabKeys[number])

        setTabValue(isValid ? tabParam : CONFIG.RegistrationRecordProcessTabs.Overview)
    }, [searchParams])

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue)
        const nextTab = tabKeys.includes(newValue as typeof tabKeys[number]) ? newValue : CONFIG.RegistrationRecordProcessTabs.Overview
        const qs = new URLSearchParams(Array.from(searchParams.entries()))

        qs.set('processTab', nextTab)
        router.replace(`${pathname}?${qs.toString()}`)
    }

    // Expose refreshTasks method to parent component
    useImperativeHandle(ref, () => ({
        refreshTasks: () => {
            if (taskTabRef.current) {
                taskTabRef.current.refreshTasks()
            }
        }
    }), [])

    return (
        <Box sx={{
            p: 3,
            height: '100%',
            borderLeft: { xs: 'none', md: '1px solid' },
            borderColor: { md: 'divider' }
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                >
                    <Tab value={CONFIG.RegistrationRecordProcessTabs.Overview} label="Tổng quan" />
                    <Tab value={CONFIG.RegistrationRecordProcessTabs.Tasks} label="Công việc" />
                </Tabs>
            </Box>

            <Box>
                {tabValue === CONFIG.RegistrationRecordProcessTabs.Overview && (
                    <OverviewTab selectedStep={selectedStep} registrationRecordId={registrationRecordId} onRefreshSteps={onRefreshSteps} />
                )}
                {tabValue === CONFIG.RegistrationRecordProcessTabs.Tasks && (
                    <TaskTab ref={taskTabRef} selectedStep={selectedStep} onRefreshSteps={onRefreshSteps} />
                )}
            </Box>
        </Box>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
