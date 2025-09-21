'use client'

import { Button, Card } from '@mui/material'

// Common Button Styles
const tabButtonStyles = (isActive: boolean) => ({
    flex: 1,
    py: 2,
    px: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? 'primary.main' : 'transparent',
    color: isActive ? 'white' : 'text.primary !important',
    boxShadow: isActive ? '0 2px 8px rgba(124, 77, 255, 0.3)' : 'none',
    position: 'relative',
    '&:hover': {
        backgroundColor: isActive ? '#6a3de8 !important' : '#e9ecef',
        boxShadow: isActive ? '0 4px 12px rgba(124, 77, 255, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
    }
})

interface ModeToggleProps {
    currentMode: 'excel' | 'manual'
    onModeChange: (mode: 'excel' | 'manual') => void
}

const ModeToggle = ({ currentMode, onModeChange }: ModeToggleProps) => {
    return (
        <Card sx={{
            display: 'flex',
            p: 2,
            width: '100%',
            columnGap: '8px'
        }}>
            <Button
                onClick={() => onModeChange('excel')}
                sx={tabButtonStyles(currentMode === 'excel')}
            >
                TẢI EXCEL
            </Button>
            <Button
                onClick={() => onModeChange('manual')}
                sx={tabButtonStyles(currentMode === 'manual')}
            >
                TỰ NHẬP
            </Button>
        </Card>
    )
}

export default ModeToggle
