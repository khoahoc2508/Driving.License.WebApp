'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// Third-party Imports
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

// Components Imports

// type FormData = InferInput<typeof schema>

type FormValues = {
  name?: string;
  dateTime?: Date;
  limitType?: 0 | 1;
  registrationLimit?: number | null;
  note?: string;
  examAddressId?: string;
}

// const schema = object({
//   name: pipe(
//     string(),
//     nonEmpty('Tên lịch thi không được để trống')
//   ),
//   dateTime: pipe(
//     string(),
//     nonEmpty('Thời gian thi không được để trống'),
//     custom((value) => !isNaN(Date.parse(value)), 'Thời gian không hợp lệ')
//   ),
//   limitType: pipe(
//     number(),
//     picklist([0, 1], 'Loại giới hạn không hợp lệ')
//   ),
//   registrationLimit: pipe(
//     nullable(number())
//   ),
//   note: pipe(
//     string(),
//     optional()
//   ),
//   examAddressId: pipe(
//     string(),
//     nonEmpty('Địa điểm thi không được để trống')
//   )
// })

const ExamScheduleForm = () => {
  // States
  // const [isPasswordShown, setIsPasswordShown] = useState(false)
  const defaultValues: FormValues = {
    name: '',
    dateTime: undefined,
    limitType: 1,
    registrationLimit: 0,
    note: '',
    examAddressId: ''
  }

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues
  })

  const onSubmit = () => toast.success('Form Submitted')
  return (
    <Card>
      <CardHeader title='Basic' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Địa điểm'
                    placeholder='Nhổn'
                    {...(errors.name && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='dateTime'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <AppReactDatepicker
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="dd/MM/yyyy HH:mm"
                    selected={value}
                    onChange={onChange}
                    placeholderText='DD/MM/YYYY HH:mm'
                    customInput={
                      <TextField
                        value={value}
                        onChange={onChange}
                        fullWidth
                        label='Thời gian'
                        {...(errors.dateTime && { error: true, helperText: 'This field is required.' })}
                      />
                    }
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Suất thi</InputLabel>
                    <Controller
                      name='limitType'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select {...field} label='Suất Thi'>
                          <MenuItem value={0}>Giới hạn</MenuItem>
                          <MenuItem value={1}>Không giới hạn</MenuItem>
                        </Select>
                      )}
                    />

                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 8 }}>
                  <div className='flex items-center gap-5'>
                    <Controller
                      name="registrationLimit"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label='Số lượng'
                          placeholder='Nhập số lượng'
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />

                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4'>
              <Button variant='contained' type='submit'>
                Submit
              </Button>
              <Button variant='outlined' type='reset' onClick={() => reset()}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
export default ExamScheduleForm
