// React Imports
import { useState, forwardRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select'

// Third-party Imports
import { format } from 'date-fns'

// Type Imports
import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material'

import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import type { ExamAddressType } from '@/types/examAddressTypes'
import CONFIG from '@/configs/config'
import type { LicenseTypeDto } from '@/types/LicensesRegistrations'

// Types
type CustomInputProps = TextFieldProps & {
  label: string
  value?: string
}

type TableFiltersProps = {
  examAddresses: ExamAddressType[]
  licenseTypes: LicenseTypeDto[]
  setParams: (params: any) => void
}

// Vars


const TableFilters = ({ examAddresses, setParams }: TableFiltersProps) => {
  // States
  const [registrationLimit, setRegistrationLimit] = useState<string[]>([])
  const [addresses, setAddresses] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null | undefined>(null)
  const [endDate, setEndDate] = useState<Date | null | undefined>(null)

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)

    // Update params when both dates are available
    setParams((prev: any) => ({
      ...prev,
      fromDate: date ? date.toISOString() : undefined,
      toDate: endDate ? endDate.toISOString() : prev.toDate
    }))
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)

    // Update params when both dates are available
    setParams((prev: any) => ({
      ...prev,
      fromDate: startDate ? startDate.toISOString() : prev.fromDate,
      toDate: date ? date.toISOString() : undefined
    }))
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, value, ...rest } = props

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value || ''} />
  })

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='select-addresses'>Địa điểm</InputLabel>
            <Select
              fullWidth
              id='select-addresses'
              label='Địa điểm'
              value={addresses}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const selectedAddresses = event.target.value as string[]

                setAddresses(selectedAddresses)
                setParams((prev: any) => ({
                  ...prev,
                  examAddressIds: selectedAddresses.length > 0 ? selectedAddresses : undefined
                }))
              }}
              labelId='select-addresses'
            >
              <MenuItem value={""}>
                <em>None</em>
              </MenuItem>
              {examAddresses.map((address) => (
                <MenuItem key={address.id} value={address.id}>
                  {address.fullAddress}
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <AppReactDatepicker
              selected={startDate}
              onChange={handleStartDateChange}
              isClearable={true}
              timeIntervals={1}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn thời gian bắt đầu"
              maxDate={endDate || undefined}
              customInput={
                <CustomInput
                  label='Từ ngày'
                  value={startDate ? format(startDate, 'dd/MM/yyyy') : ''}
                />
              }
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <AppReactDatepicker
              selected={endDate}
              onChange={handleEndDateChange}
              isClearable={true}
              timeIntervals={1}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn thời gian kết thúc"
              minDate={startDate || undefined}
              customInput={
                <CustomInput
                  label='Đến ngày'
                  value={endDate ? format(endDate, 'dd/MM/yyyy') : ''}
                />
              }
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <FormControl fullWidth>
            <InputLabel id='registration-limit'>Suất thi</InputLabel>
            <Select
              multiple
              fullWidth
              id='registration-limit'
              value={registrationLimit}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const selectedLimits = event.target.value as string[]

                setRegistrationLimit(selectedLimits)
                setParams((prev: any) => ({
                  ...prev,
                  limitTypes: selectedLimits.length > 0 ? selectedLimits.map(Number) : undefined
                }))
              }}
              label='Suât thi'
              labelId='registration-limit'
            >
              <MenuItem value={CONFIG.LimitType.Limited.toString()}>Giới hạn</MenuItem>
              <MenuItem value={CONFIG.LimitType.Unlimited.toString()}>Không giới hạn</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent >
  )
}

export default TableFilters
