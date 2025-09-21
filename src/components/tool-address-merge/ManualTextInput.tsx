'use client'

import { TextField } from '@mui/material'

interface ManualTextInputProps {
    value: string
    onChange: (value: string) => void
}

const ManualTextInput = ({ value, onChange }: ManualTextInputProps) => {
    return (
        <>
            {/* Manual Input Area */}
            <TextField
                fullWidth
                multiline
                rows={5}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Hải Tân, Hải Hậu, Nam Định"
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-color) !important',
                        borderWidth: '1px !important'
                    },
                    '& .MuiInputBase-root': {
                        height: '100%'
                    },
                    '& .MuiInputBase-input': {
                        height: '100% !important'
                    }
                }}
                className='flex-1'
            />

        </>
    )
}

export default ManualTextInput
