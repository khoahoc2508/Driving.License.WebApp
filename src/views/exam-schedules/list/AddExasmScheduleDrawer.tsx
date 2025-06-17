'use client'

import { useEffect, useState } from "react"

import { Divider, Drawer, FormHelperText, IconButton, Typography } from "@mui/material"

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
import CONFIG from '@/configs/config'
import ExamAddressAPI from "@/libs/api/examAddressAPI"
import type { ExamAddressType, PaginatedListOfExamAddressType } from "@/types/examAddressTypes"
import ExamScheduleAPI from "@/libs/api/examScheduleAPI"
import type { CreateExamScheduleCommandType, ExamScheduleByIdType, ExamScheduleType, UpdateExamScheduleCommandType } from "@/types/examScheduleTypes"
import LicenseTypeAPI from "@/libs/api/licenseTypeApi"
import { LicenseTypeDto } from "@/types/LicensesRegistrations"

type Props = {
  examAddresses: ExamAddressType[]
  licenseTypes: LicenseTypeDto[]
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
  examScheduleId?: string
}

enum LimitType {
  Unlimited,
  Limited
}

type FormValues = {
  id?: string;
  name?: string;
  dateTime?: Date;
  limitType?: LimitType;
  registrationLimit?: number | null;
  note?: string;
  examAddressId?: string;
  licenseTypeCode?: string;
}

const AddExasmScheduleDrawer = (props: Props) => {
  // Props
  const { examAddresses, licenseTypes, open, handleClose, onSuccess, examScheduleId } = props
  const isEditMode = !!examScheduleId

  const defaultValues: FormValues = {
    name: '',
    dateTime: undefined,
    limitType: LimitType.Limited,
    registrationLimit: 10,
    note: undefined,
    examAddressId: '',
    licenseTypeCode: ''
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
    if (isEditMode) {
      onUpdate(data)
    } else {
      onCreate(data)
    }
  }

  const onCreate = async (data: FormValues) => {
    try {
      const payload: CreateExamScheduleCommandType = {
        name: data.examAddressId, // Using examAddressId as name since there's no name field in the form
        dateTime: data.dateTime?.toISOString(),
        limitType: data.limitType,
        registrationLimit: data.registrationLimit,
        note: data.note || '',
        examAddressId: data.examAddressId,
        licenseTypeCode: data.licenseTypeCode
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

  const onUpdate = async (data: FormValues) => {
    try {
      const payload: UpdateExamScheduleCommandType = {
        id: data.id,
        name: data.examAddressId, // Using examAddressId as name since there's no name field in the form
        dateTime: data.dateTime?.toISOString(),
        limitType: data.limitType,
        registrationLimit: data.registrationLimit,
        note: data.note || '',
        examAddressId: data.examAddressId,
        licenseTypeCode: data.licenseTypeCode
      }

      const response = await ExamScheduleAPI.updateExamSchedule(payload)

      if (response.data?.success) {
        toast.success('Cập nhật lịch thi thành công')
        handleClose()

        // Call onSuccess to reload the data table
        if (onSuccess) onSuccess()
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error updating exam schedule:', error)
      toast.error('Có lỗi xảy ra khi cập nhật lịch thi')
    }
  }

  const fetchExamAddressById = async (id: string) => {
    try {

      const response = await ExamScheduleAPI.getExamScheduleById(id)

      const examSchedule = response.data.data as ExamScheduleByIdType

      if (examSchedule) {

        // setExamAddresses(paginatedData.data || [])
        const examScheduleForUpdate = {
          id: examSchedule.id,
          name: examSchedule.name,
          dateTime: examSchedule.dateTime
            ? new Date(examSchedule.dateTime)   // valid string → Date
            : undefined,
          limitType: examSchedule.limitType,
          registrationLimit: examSchedule.registrationLimit,
          note: examSchedule.note,
          examAddressId: examSchedule.examAddress?.id,
          licenseTypeCode: examSchedule.licenseTypeCode
        }

        reset(examScheduleForUpdate)
      }

    } catch (error) {
      console.error('Error fetching exam schedule by id:', error)
    } finally {
    }
  }

  const handleReset = () => {
    handleClose()
  }


  useEffect(() => {
    if (examScheduleId && open) {
      fetchExamAddressById(examScheduleId)
    }
    if (!open) {
      reset(defaultValues)
    }
  }, [open])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={() => { }}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: "90%", sm: 600 } } }}
    >

      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{isEditMode ? 'Chỉnh sửa lịch thi' : 'Tạo lịch thi'}</Typography>
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
                  <InputLabel error={Boolean(errors.examAddressId)}>Địa điểm thi</InputLabel>
                  <Controller
                    name='examAddressId'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} label='Địa điểm thi' error={Boolean(errors.examAddressId)}>
                        {examAddresses.map((examAddress) => (
                          <MenuItem key={examAddress.id} value={examAddress.id}>
                            {examAddress.fullAddress}
                          </MenuItem>
                        ))}

                      </Select>
                    )}
                  />
                  {errors.examAddressId && <FormHelperText error>This field is required.</FormHelperText>}

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

              <Grid size={{ xs: 12, sm: 12 }}>
                <FormControl fullWidth>
                  <InputLabel error={Boolean(errors.licenseTypeCode)}>Loại bằng lái</InputLabel>
                  <Controller
                    name='licenseTypeCode'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select {...field} label='Loại bằng lái' error={Boolean(errors.licenseTypeCode)}>
                        {licenseTypes.map((licenseType) => (
                          <MenuItem key={licenseType.code} value={licenseType.code}>
                            {licenseType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}

                  />
                  {errors.licenseTypeCode && <FormHelperText error>This field is required.</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }} className='flex gap-4'>
                <Button variant='contained' type='submit'>
                  {isEditMode ? 'Cập nhật' : 'Tạo'}
                </Button>
                <Button variant='outlined' type='reset' onClick={() => reset()}>
                  Đặt lại
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
