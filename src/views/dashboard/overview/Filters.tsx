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
  value?: string
}

type FiltersProps = {
  params: GetStatisticByTimeRangeParams
  setParams: (params: GetStatisticByTimeRangeParams) => void
  onRefresh: () => void
}


const Filters = ({ setParams, onRefresh }: FiltersProps) => {
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)

    // Cập nhật params khi có thay đổi
    if (date && endDate) {
      setParams({
        startDate: date.toISOString(),
        endDate: endDate.toISOString()
      })
    } else if (date && !endDate) {
      // Nếu chỉ có startDate, có thể set endDate = startDate hoặc để trống
      // Tùy theo logic business của bạn
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)

    // Cập nhật params khi có thay đổi
    if (startDate && date) {
      setParams({
        startDate: startDate.toISOString(),
        endDate: date.toISOString()
      })
    }
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, value, ...rest } = props

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value || ''} />
  })


  return (
    <Card >
      <div className='flex justify-between flex-row items-center gap-y-4 p-5'>
        <div className='flex items-center gap-4 flex-col sm:flex-row'>
          {/* Start Date Picker */}
          <AppReactDatepicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
            isClearable={true}
            placeholderText="Chọn ngày bắt đầu"
            className='w-[240px] sm:w-full'
            maxDate={endDate || undefined} // Không cho chọn ngày sau endDate
            customInput={
              <CustomInput
                label='Ngày bắt đầu'
                value={startDate ? format(startDate, 'dd/MM/yyyy') : ''}
              />
            }
          />

          {/* End Date Picker */}
          <AppReactDatepicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
            isClearable={true}
            placeholderText="Chọn ngày kết thúc"
            className='w-[240px] sm:w-full'
            minDate={startDate || undefined} // Không cho chọn ngày trước startDate
            customInput={
              <CustomInput
                label='Ngày kết thúc'
                value={endDate ? format(endDate, 'dd/MM/yyyy') : ''}
              />
            }
          />
        </div>

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
