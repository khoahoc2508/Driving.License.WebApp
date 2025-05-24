// MUI Imports
'use client'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface HeaderProps {
    onCancel: () => void
}

const Header = ({ onCancel }: HeaderProps) => {
    return (
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <div>
                <Typography variant='h4' className='mbe-1'>
                    Thêm học viên
                </Typography>
            </div>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
                <Button variant='outlined' color='secondary' onClick={onCancel}>
                    Đóng
                </Button>
                <Button variant='contained' type='submit' form='license-registration-form'>
                    Lưu
                </Button>
            </div>
        </div>
    )
}

export default Header
