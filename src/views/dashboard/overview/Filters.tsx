import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { Card, CardContent, Grid2, TextField, TextFieldProps } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { forwardRef } from 'react'

// Third-party Imports
import { format, addDays } from 'date-fns'

// Types
type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
}

type FiltersProps = {
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  setStartDate: (date: Date | null | undefined) => void
  setEndDate: (date: Date | null | undefined) => void
}


const Filters = ({ startDate, endDate, setStartDate, setEndDate }: FiltersProps) => {

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    // Only format dates if they are valid and not null/undefined
    let value = ''

    if (start && !isNaN(new Date(start).getTime())) {
      value = format(start, 'dd/MM/yyyy')

      if (end && !isNaN(new Date(end).getTime())) {
        value += ` - ${format(end, 'dd/MM/yyyy')}`
      }
    }

    return <TextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

  return <>

    <Card>
      <CardContent>
        <Grid2 container justifyContent="center">
          <Grid2>
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
          </Grid2>
        </Grid2></CardContent>

    </Card>
  </>
}

export default Filters
