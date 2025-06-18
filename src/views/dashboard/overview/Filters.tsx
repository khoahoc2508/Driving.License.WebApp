"use client"

import { forwardRef, useState } from 'react'

import type { TextFieldProps } from '@mui/material';
import { Card, IconButton, TextField, Tooltip } from '@mui/material'


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
  onRefresh: () => void
}


const Filters = ({ setParams, onRefresh }: FiltersProps) => {
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
    <Card >
      <div className='flex justify-between flex-row items-center gap-y-4 p-5'>
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
          className='min-w-[240px]'
          customInput={
            <CustomInput
              label='Khoảng thời gian'
              start={endDate ?? null}
              end={startDate ?? null}
            />
          }
        />
        <div className='flex items-center max-sm:flex-col gap-4'>
          <Tooltip title='Refresh' placement='top'>
            <IconButton onClick={onRefresh}>
              <i className='ri-refresh-line text-textSecondary' />
            </IconButton>
          </Tooltip>

        </div>
      </div>

    </Card>
  )
}

export default Filters
