'use client'

import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Box, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material'

import type { GetStepsDto } from '@/types/stepsTypes'
import CONFIG from '@/configs/config'

import OverviewTab, { type OverviewTabRef } from './overview/OverviewTab'
import TaskTab, { type TaskTabRef } from './task/TaskTab'

type MainContentProps = {
    selectedStep: GetStepsDto | null
    registrationRecordId: string | undefined
    onRefreshSteps: (newStepsCount?: number) => void,
    refreshBasicInfo: () => void
}

export type MainContentRef = {
    refreshTasks: () => void
    refreshStepOverview: () => void
}

const MainContent = forwardRef<MainContentRef, MainContentProps>(({ selectedStep, registrationRecordId, onRefreshSteps, refreshBasicInfo }, ref) => {
    const [tabValue, setTabValue] = useState<string>(CONFIG.RegistrationRecordProcessTabs.Overview)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const taskTabRef = useRef<TaskTabRef>(null)
    const overviewTabRef = useRef<OverviewTabRef>(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

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
        },
        refreshStepOverview: () => {
            if (overviewTabRef.current) {
                overviewTabRef.current.refreshStepOverview()
            }
        }
    }), [])

    return (
        <Box sx={{
            p: isMobile ? 2 : 4,
            height: '100%',
            borderLeft: { xs: 'none', md: '1px solid' },
            borderColor: { md: 'divider' }
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "standard"}
                    scrollButtons={isMobile ? "auto" : false}
                    allowScrollButtonsMobile={isMobile}
                    sx={{
                        '& .MuiTabs-scrollButtons': {
                            '&.Mui-disabled': {
                                opacity: 0.3,
                            },
                        },
                    }}
                >
                    <Tab
                        value={CONFIG.RegistrationRecordProcessTabs.Overview}
                        label="Tổng quan"
                        sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
                    />
                    <Tab
                        value={CONFIG.RegistrationRecordProcessTabs.Tasks}
                        label="Công việc"
                        sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
                    />
                </Tabs>
            </Box>

            <Box>
                {tabValue === CONFIG.RegistrationRecordProcessTabs.Overview && (
                    <OverviewTab ref={overviewTabRef} selectedStep={selectedStep} registrationRecordId={registrationRecordId} onRefreshSteps={onRefreshSteps} />
                )}
                {tabValue === CONFIG.RegistrationRecordProcessTabs.Tasks && (
                    <TaskTab ref={taskTabRef}
                        selectedStep={selectedStep}
                        onRefreshSteps={onRefreshSteps}
                        registrationRecordId={registrationRecordId}
                        refreshBasicInfo={refreshBasicInfo}
                    />
                )}
            </Box>
        </Box>
    )
})

MainContent.displayName = 'MainContent'

export default MainContent
