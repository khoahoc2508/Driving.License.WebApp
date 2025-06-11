"use client"

import { forwardRef, useState } from 'react'

import type { TextFieldProps } from '@mui/material';
import { Card, CardContent, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'


// Third-party Imports
import { format } from 'date-fns'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import type { GetStatisticByTimeRangeParams } from '@/types/statisticTypes'

// Types
type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | null | undefined
  start: Date | null | undefined
}

type FiltersProps = {
  params: GetStatisticByTimeRangeParams
  setParams: (params: GetStatisticByTimeRangeParams) => void
}


const Filters = ({ setParams }: FiltersProps) => {
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)

    // Chỉ set params khi cả start và end đã được chọn
    if (start && end) {
      setParams({
        startDate: start.toISOString(),
        endDate: end.toISOString()
      })
    }
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    // Safely format dates only if they exist
    const startDateStr = start ? format(start, 'dd/MM/yyyy') : ''
    const endDateStr = end ? ` - ${format(end, 'dd/MM/yyyy')}` : ''

    const value = startDateStr + endDateStr

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })


  return (
    <Card sx={{ width: { xs: '100%', sm: '100%', md: '280px' }, mx: 'auto' }}>
      <CardContent>
        <Grid container justifyContent="center">
          <Grid size={{ xs: 12, sm: 12 }}>
            <AppReactDatepicker
              selectsRange
              endDate={endDate ? endDate : null}
              selected={startDate ? startDate : null}
              startDate={startDate ? startDate : null}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              dateFormat="dd/MM/yyyy"
              isClearable={true}
              placeholderText="Chọn khoảng thời gian"
              customInput={
                <CustomInput
                  label='Khoảng thời gian'
                  start={endDate ?? null}
                  end={startDate ?? null}
                />
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Filters
