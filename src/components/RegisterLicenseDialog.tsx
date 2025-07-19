import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

interface RegisterLicenseDialogProps {
    open: boolean
    onClose: () => void
}

const RegisterLicenseDialog = ({ open, onClose }: RegisterLicenseDialogProps) => (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>ĐĂNG KÝ GPLX</DialogTitle>
        <DialogContent>
            <Stack spacing={4} mt={1}>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: '#9254eb',
                        color: '#fff',
                        justifyContent: 'center',
                        px: 6,
                    }}
                >
                    <span style={{ width: '100%', textAlign: 'left' }}>XE MÁY</span>
                    <i
                        className="ri-arrow-right-line"
                    />
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: '#9254eb',
                        color: '#fff',
                        justifyContent: 'center',
                        px: 6,
                    }}
                >
                    <span style={{ width: '100%', textAlign: 'left' }}>Ô TÔ</span>
                    <i
                        className="ri-arrow-right-line"
                    />
                </Button>
            </Stack>
        </DialogContent>
    </Dialog>
)

export default RegisterLicenseDialog 
