import { Divider, Drawer, IconButton, Typography } from "@mui/material"

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
import PerfectScrollbar from 'react-perfect-scrollbar'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'

// Styled Component Imports
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'


type Props = {
  open: boolean
  handleClose: () => void
}

type FormValues = {
  name?: string;
  dateTime?: Date;
  limitType?: 0 | 1;
  registrationLimit?: number | null;
  note?: string;
  examAddressId?: string;
}

const AddExasmScheduleDrawer = (props: Props) => {
  // Props
  const { open, handleClose } = props

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


  const handleReset = () => {
    handleClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={() => { }}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
    >

      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Tạo lịch thi</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
        <div className='p-5'>
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
        </div>
      </PerfectScrollbar>
    </Drawer>
  )
}

export default AddExasmScheduleDrawer 
