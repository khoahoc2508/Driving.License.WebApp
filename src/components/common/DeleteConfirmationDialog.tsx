'use client'

// React Imports

// MUI Imports
import Button from '@mui/material/Button'
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
}

const DeleteConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title = 'Bạn chắc chắn xóa?',
    itemName,
    itemType = 'hồ sơ',
    isLoading = false
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
                <Typography
                    id="delete-dialog-description"
                    variant="body1"
                    color="text.primary"
                >
                    Bạn đang xóa {itemType} <strong>{itemName}</strong>. Dữ liệu liên quan đến {itemType} này sẽ bị mất!
                </Typography>
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
                    variant="outlined"
                    color="error"
                    disabled={isLoading}
                    className='m-0'
                >
                    {isLoading ? 'Đang xóa...' : 'XÁC NHẬN'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog
