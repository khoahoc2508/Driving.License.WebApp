'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent, ReactNode } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import type { Theme } from '@mui/material/styles'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
// import type { ThemeColor } from '@core/types'
// import type { CustomAvatarProps } from '@core/components/mui/Avatar'

// Component Imports
// import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'
import CONFIG from '../../configs/config'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
// Change component signature to remove notifications prop
const Filter = ({ onApplyFilters }: { onApplyFilters: (status: boolean | undefined, licenseType: number | undefined) => void }) => {
    // States
    const [open, setOpen] = useState(false)
    // State for selected filter options
    const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
    const [selectedLicenseType, setSelectedLicenseType] = useState<number | undefined>(undefined);
    // Refs
    const anchorRef = useRef<HTMLButtonElement>(null)

    // Hooks
    const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
    const { settings } = useSettings()

    const handleClose = () => {
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen)
    }

    // Handlers for filter selection
    const handleStatusSelect = (statusValue: boolean) => {
        setSelectedStatus(prevStatus => (prevStatus === statusValue ? undefined : statusValue));
    };

    const handleLicenseTypeSelect = (typeValue: number) => {
        setSelectedLicenseType(prevType => (prevType === typeValue ? undefined : typeValue));
    };

    // Handlers for filter actions
    const handleReset = () => {
        setSelectedStatus(undefined);
        setSelectedLicenseType(undefined);
        // Optionally close the popover after reset
        // setOpen(false);
    };

    const handleApply = () => {
        // Implement apply logic here (e.g., call a prop function with selected filters)
        onApplyFilters(selectedStatus, selectedLicenseType);
        // Close the popover after applying
        setOpen(false);
    };

    return (
        <>
            <IconButton ref={anchorRef} onClick={handleToggle} className='!text-textPrimary'>
                <Badge
                    color='error'
                    className='cursor-pointer'
                    variant='dot'
                    overlap='circular'
                    invisible={!selectedStatus && !selectedLicenseType} // Example: indicate if any filter is selected
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <i className="ri-filter-2-line text-3xl"></i>
                </Badge>
            </IconButton>
            <Popper
                open={open}
                transition
                disablePortal
                placement='bottom-end'
                anchorEl={anchorRef.current}
                {...(isSmallScreen
                    ? {
                        className: 'is-96 !mbs-4 z-[1]',
                    }
                    : { className: 'is-96 !mbs-4 z-[1]' })}
            >
                {({ TransitionProps, placement }) => (
                    <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
                        <Paper className={classnames('bs-full', settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg')}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <div className='bs-full flex flex-col p-4'>
                                    {/* Filter Header */}
                                    <Typography variant='h5' className='mbe-4'>
                                        Lọc danh sách
                                    </Typography>

                                    <Divider className='mbe-4' />

                                    {/* Status Filter Section */}
                                    <Typography variant='h6' className='mbe-2'>
                                        Trạng thái
                                    </Typography>
                                    <div className='flex gap-2 mbe-4'>
                                        <Button
                                            variant={selectedStatus === CONFIG.ApprovedOption[0].value ? 'contained' : 'outlined'}
                                            onClick={() => handleStatusSelect(CONFIG.ApprovedOption[0].value)}
                                            size='small'
                                        >
                                            Đã duyệt
                                        </Button>
                                        <Button
                                            variant={selectedStatus === CONFIG.ApprovedOption[1].value ? 'contained' : 'outlined'}
                                            onClick={() => handleStatusSelect(CONFIG.ApprovedOption[1].value)}
                                            size='small'
                                        >
                                            Chưa duyệt
                                        </Button>
                                    </div>

                                    {/* License Type Filter Section */}
                                    <Typography variant='h6' className='mbe-2'>
                                        Loại bằng
                                    </Typography>
                                    <div className='grid grid-cols-2 gap-2 mbe-6'>
                                        <Button
                                            variant={selectedLicenseType === CONFIG.LicenseType.A1 ? 'contained' : 'outlined'}
                                            onClick={() => handleLicenseTypeSelect(CONFIG.LicenseType.A1)}
                                            size='small'
                                        >
                                            A1
                                        </Button>
                                        <Button
                                            variant={selectedLicenseType === CONFIG.LicenseType.A2 ? 'contained' : 'outlined'}
                                            onClick={() => handleLicenseTypeSelect(CONFIG.LicenseType.A2)}
                                            size='small'
                                        >
                                            A2
                                        </Button>
                                        <Button
                                            variant={selectedLicenseType === CONFIG.LicenseType.B1 ? 'contained' : 'outlined'}
                                            onClick={() => handleLicenseTypeSelect(CONFIG.LicenseType.B1)}
                                            size='small'
                                        >
                                            B1
                                        </Button>
                                        <Button
                                            variant={selectedLicenseType === CONFIG.LicenseType.B2 ? 'contained' : 'outlined'}
                                            onClick={() => handleLicenseTypeSelect(CONFIG.LicenseType.B2)}
                                            size='small'
                                        >
                                            B2
                                        </Button>
                                    </div>

                                    <Divider className='mbe-6' />

                                    {/* Action Buttons */}
                                    <div className='flex justify-between gap-4'>
                                        <Button fullWidth variant='outlined' onClick={handleReset}>
                                            Thiết lập lại
                                        </Button>
                                        <Button fullWidth variant='contained' onClick={handleApply}>
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </>
    )
}

export default Filter
