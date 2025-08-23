'use client'

import { Box } from '@mui/material'

type SubTab = 'overview' | 'tasks'

type SubTabsProps = {
    activeTab: SubTab
    onTabChange: (tab: SubTab) => void
}

const SubTabs = ({ activeTab, onTabChange }: SubTabsProps) => {
    const tabs = [
        { key: 'overview' as SubTab, label: 'Tổng quan' },
        { key: 'tasks' as SubTab, label: 'Công việc' }
    ]

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                {tabs.map((tab) => (
                    <Box
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        sx={{
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            borderBottom: activeTab === tab.key ? '2px solid' : 'none',
                            borderBottomColor: 'primary.main',
                            color: activeTab === tab.key ? 'primary.main' : 'text.secondary',
                            fontWeight: activeTab === tab.key ? 600 : 400,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                color: 'primary.main',
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        {tab.label}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default SubTabs
