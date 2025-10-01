'use client'

// React Imports
import type { ReactNode } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'


interface DeleteConfirmationDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    itemName?: string
    itemType?: string
    isLoading?: boolean
    description?: ReactNode
    loadingText?: string
    confirmVariant?: ButtonProps['variant']
    confirmColor?: ButtonProps['color']
    confirmText?: string
}

const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title = 'Bạn chắc chắn xóa?',
    itemName,
    itemType = 'hồ sơ',
    isLoading = false,
    description,
    loadingText = 'Đang xóa...',
    confirmVariant = 'outlined',
    confirmColor = 'error',
    confirmText = 'XÁC NHẬN'
}: DeleteConfirmationDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            maxWidth="sm"
            fullWidth
            sx={
                {
                    '.MuiDialog-paper': {
                        // maxWidth: '23vw',
                        // minWidth: '23vw'
                        width: '490px'
                    }
                }
            }
        >
            <DialogTitle
                id="delete-dialog-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #e0e0e0',
                    gap: 1,
                }}
                className='p-4'
            >

                <Box sx={{
                    color: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <i className='ri-error-warning-line' style={{ fontSize: '20px' }} />
                </Box>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className='ml-auto'
                >
                    <i className='ri-close-line' style={{ fontSize: '24px' }} />
                </IconButton>
            </DialogTitle>

            <DialogContent className='p-4'>
                {description ? (
                    typeof description === 'string' ? (
                        <Typography id="delete-dialog-description" variant="body1" color="text.primary">
                            {description}
                        </Typography>
                    ) : (
                        description
                    )
                ) : (
                    <Typography
                        id="delete-dialog-description"
                        variant="body1"
                        color="text.primary"
                    >
                        Bạn đang xóa {itemType} <strong>{itemName}</strong>. Dữ liệu liên quan đến {itemType} này sẽ bị mất!
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    disabled={isLoading}
                    color='secondary'
                >
                    HỦY
                </Button>
                <Button
                    onClick={onConfirm}
                    variant={confirmVariant}
                    color={confirmColor}
                    disabled={isLoading}
                    className='m-0'
                >
                    {isLoading ? loadingText : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog
