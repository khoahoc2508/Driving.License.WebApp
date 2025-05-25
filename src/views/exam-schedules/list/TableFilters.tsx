// React Imports
import { useState, useEffect, forwardRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// Third-party Imports
import { format, addDays } from 'date-fns'

// Type Imports
import { ExamScheduleType } from '@/types/examScheduleTypes'
import { TextField, TextFieldProps } from '@mui/material'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Types
type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

// Vars


const TableFilters = ({
  data
}: {
  data?: ExamScheduleType[]
}) => {
  // States
  const [registrationLimit, setRegistrationLimit] = useState<string[]>([])
  const [addresses, setAddresses] = useState<string[]>([])
  const [startDate, setStartDate] = useState<Date | null | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | null | undefined>(addDays(new Date(), 15))

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = format(start, 'MM/dd/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

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
                setAddresses(event.target.value as string[])
              }}
              labelId='select-addresses'
            >
              <MenuItem value='0'>Nhổn</MenuItem>
              <MenuItem value='1'>Khuất Duy Tiến</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>

            <AppReactDatepicker
              selectsRange
              endDate={endDate as Date}
              selected={startDate}
              startDate={startDate as Date}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              customInput={
                <CustomInput label='Thời gian' start={startDate as Date | number} end={endDate as Date | number} />
              }
            />
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='registration-limit'>Suất thi</InputLabel>
            <Select
              multiple
              fullWidth
              id='registration-limit'
              value={registrationLimit}
              onChange={(event: SelectChangeEvent<string[]>) => {
                setRegistrationLimit(event.target.value as string[])
              }}
              label='Suât thi'
              labelId='registration-limit'
            >
              <MenuItem value='0'>Còn trống</MenuItem>
              <MenuItem value='1'>Đã hết</MenuItem>
              <MenuItem value='2'>Không giới hạn</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent >
  )
}

export default TableFilters
