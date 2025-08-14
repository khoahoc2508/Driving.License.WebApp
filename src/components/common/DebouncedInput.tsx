import { useEffect, useState } from 'react';

import { TextField, InputAdornment } from '@mui/material';

import type { TextFieldProps } from '@mui/material/TextField';

const DebouncedInput = ({
  value: initialValue,
  onDebounceChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onDebounceChange: (value: string | number) => void
  debounce?: number
} & TextFieldProps) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onDebounceChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField
      {...props}
      size='small'
      value={value}
      onChange={e => setValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ opacity: 0.5 }}>
            <i className="ri-search-line" />
          </InputAdornment>
        ),
        ...props.InputProps
      }}
    />
  )
}

export default DebouncedInput
