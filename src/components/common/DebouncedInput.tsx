import { TextField } from '@mui/material';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

import type { TextFieldProps } from '@mui/material/TextField'

const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & TextFieldProps) => {
    // States
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return <TextField {...props} size='small' value={value} onChange={e => setValue(e.target.value)} />
}

export default DebouncedInput
