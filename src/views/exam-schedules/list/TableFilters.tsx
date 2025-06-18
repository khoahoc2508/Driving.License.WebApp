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
  end: Date | number
  start: Date | number
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

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)

    // Update params with new date range
    setParams((prev: any) => ({
      ...prev,
      fromDate: start ? start.toISOString() : undefined,
      toDate: end ? end.toISOString() : undefined
    }))
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    // Only format dates if they are valid and not null/undefined
    let value = ''

    if (start && !isNaN(new Date(start).getTime())) {
      value = format(start, 'dd/MM/yyyy HH:mm')

      if (end && !isNaN(new Date(end).getTime())) {
        value += ` - ${format(end, 'dd/MM/yyyy HH:mm')}`
      }
    }

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
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
        <Grid size={{ xs: 12, sm: 5 }}>
          <FormControl fullWidth>

            <AppReactDatepicker
              selectsRange
              endDate={endDate as Date}
              selected={startDate}
              startDate={startDate as Date}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              showTimeSelect
              isClearable={true}
              timeFormat="HH:mm"
              timeIntervals={1}
              dateFormat="dd/MM/yyyy HH:mm"
              customInput={
                <CustomInput label='Thời gian' start={startDate as Date | number} end={endDate as Date | number} />
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
