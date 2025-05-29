'use client'

import { useEffect, useState } from "react"

import { Divider, Drawer, IconButton, Typography } from "@mui/material"

// MUI Imports
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
import ExamAddressAPI from "@/libs/api/examAddressAPI"
import type { ExamAddressType, PaginatedListOfExamAddressType } from "@/types/examAddressTypes"
import ExamScheduleAPI from "@/libs/api/examScheduleAPI"
import type { CreateExamScheduleCommandType } from "@/types/examScheduleTypes"


type Props = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
}

enum LimitType {
  Unlimited,
  Limited
}

type FormValues = {
  name?: string;
  dateTime?: Date;
  limitType?: LimitType;
  registrationLimit?: number | null;
  note?: string;
  examAddressId?: string;
}

const AddExasmScheduleDrawer = (props: Props) => {
  // Props
  const { open, handleClose, onSuccess } = props
  const [examAddresses, setExamAddresses] = useState<ExamAddressType[]>([])

  const defaultValues: FormValues = {
    name: '',
    dateTime: undefined,
    limitType: LimitType.Limited,
    registrationLimit: 10,
    note: '',
    examAddressId: ''
  }

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues
  })

  // Theo dõi giá trị limitType hiện tại
  const currentLimitType = watch('limitType')

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: CreateExamScheduleCommandType = {
        name: data.examAddressId, // Using examAddressId as name since there's no name field in the form
        dateTime: data.dateTime?.toISOString(),
        limitType: data.limitType,
        registrationLimit: data.registrationLimit,
        note: data.note || '',
        examAddressId: data.examAddressId
      }

      const response = await ExamScheduleAPI.createExamSchedule(payload)

      if (response.data?.success) {
        toast.success('Tạo lịch thi thành công')
        handleClose()

        // Call onSuccess to reload the data table
        if (onSuccess) onSuccess()
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error creating exam schedule:', error)
      toast.error('Có lỗi xảy ra khi tạo lịch thi')
    }
  }

  // Fetch data function
  const fetchExamAddresses = async () => {
    try {

      const response = await ExamAddressAPI.getExamAddresses({ pageNumber: 1, pageSize: 10 })

      const paginatedData = response.data as PaginatedListOfExamAddressType

      if (paginatedData.data && paginatedData.data.length > 0) {
        setExamAddresses(paginatedData.data || [])
        reset({ ...defaultValues, examAddressId: paginatedData.data[0].id })
      }

    } catch (error) {
      console.error('Error fetching exam addesses:', error)
      setExamAddresses([])
    } finally {
    }
  }

  const handleReset = () => {
    handleClose()
  }

  useEffect(() => {
    fetchExamAddresses()
  }, [])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={() => { }}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 600 } } }}
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
                <FormControl fullWidth>
                  <InputLabel>Địa điểm thi</InputLabel>
                  <Controller
                    name='examAddressId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} label='Địa điểm thi'>
                        {examAddresses.map((examAddress) => (
                          <MenuItem key={examAddress.id} value={examAddress.id}>
                            {examAddress.fullAddress}
                          </MenuItem>
                        ))}

                      </Select>
                    )}
                  />

                </FormControl>

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
                          <Select
                            {...field}
                            label='Suất Thi'
                            onChange={(e) => {
                              const value = Number(e.target.value);

                              field.onChange(value);

                              // Nếu chọn không giới hạn, set registrationLimit là null
                              if (value === LimitType.Unlimited) {
                                setValue('registrationLimit', null);
                              } else {
                                // Nếu chọn giới hạn, set registrationLimit là 10
                                setValue('registrationLimit', 10);
                              }
                            }}
                          >
                            <MenuItem value={LimitType.Limited}>Giới hạn</MenuItem>
                            <MenuItem value={LimitType.Unlimited}>Không giới hạn</MenuItem>
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
                            disabled={currentLimitType === LimitType.Unlimited}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={currentLimitType === LimitType.Unlimited ? '' : field.value || ''}
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
