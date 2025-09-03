'use client'

import { useState, useEffect } from 'react'

import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
  Autocomplete
} from '@mui/material'
import { toast } from 'react-toastify'

import type { CreatePaymentHistoryCommand } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

export enum DialogMode {
  ADD = 'add',
  EDIT = 'edit'
}

type PaymentOption = { value: string; label: string }

type AddPaymentHistoryDialogProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  registrationRecordId: string
  mode: DialogMode
  editPaymentHistoryId?: string | null
}

type FormData = {
  paymentDate: string
  paymentId: string
  amountInput: string
  note: string
}

const AddPaymentHistoryDialog = ({
  open,
  onClose,
  onSuccess,
  registrationRecordId,
  mode,
  editPaymentHistoryId
}: AddPaymentHistoryDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([])

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0],
      paymentId: '',
      amountInput: '',
      note: ''
    }
  })

  useEffect(() => {
    if (!open) return

    const fetchPayments = async () => {
      try {
        const res = await registrationRecordsAPI.GetAllPaymentsByRegistrationRecordId(registrationRecordId)

        const options = res?.data?.data?.map((x: any) => ({
          value: x.id,
          label: `${x.feeTypeName || 'Loại phí'} - ${new Intl.NumberFormat('vi-VN').format(x.amount || 0)} VNĐ`
        })) || []

        setPaymentOptions(options)
      } catch (e) {
        setPaymentOptions([])
      }
    }

    fetchPayments()
  }, [open, registrationRecordId])

  useEffect(() => {
    if (open && mode === DialogMode.EDIT && editPaymentHistoryId) {
      fetchPaymentHistory()
    } else if (open) {
      reset({
        paymentDate: new Date().toISOString().split('T')[0],
        paymentId: '',
        amountInput: '',
        note: ''
      })
    }
  }, [open, mode, editPaymentHistoryId, reset])

  const fetchPaymentHistory = async () => {
    if (!editPaymentHistoryId) return

    try {
      const response = await registrationRecordsAPI.GetPaymentHistoryById(editPaymentHistoryId)

      if (response?.data?.data) {
        const data = response.data.data

        reset({
          paymentDate: data.paymentDate ? new Date(data.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          paymentId: data.paymentId || '',
          amountInput: new Intl.NumberFormat('vi-VN').format(data.amount ?? 0),
          note: data.note || ''
        })
      }
    } catch (error) {
      console.error('Error fetching payment history:', error)
      toast.error('Có lỗi xảy ra khi tải thông tin')
    }
  }

  const parseAmount = (input: string): number => {
    const numeric = input.replace(/[^\d]/g, '')


    return numeric ? Number(numeric) : 0
  }

  const formatAmount = (value: string): string => {
    const num = value.replace(/[^\d]/g, '')


    return num ? new Intl.NumberFormat('vi-VN').format(Number(num)) : ''
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const paymentHistoryData: CreatePaymentHistoryCommand = {
        paymentId: data.paymentId,
        amount: parseAmount(data.amountInput),
        paymentDate: data.paymentDate,
        note: data.note
      }

      if (mode === DialogMode.ADD) {
        const response = await registrationRecordsAPI.CreatePaymentHistory(paymentHistoryData)

        if (response?.data?.success) {
          toast.success('Thêm lịch sử thanh toán thành công')
          onSuccess()
        } else {
          toast.error(response?.data?.message || 'Có lỗi xảy ra')
        }
      } else {
        if (!editPaymentHistoryId) return

        const response = await registrationRecordsAPI.UpdatePaymentHistory(editPaymentHistoryId, {
          id: editPaymentHistoryId,
          ...paymentHistoryData
        })

        if (response?.data?.success) {
          toast.success('Cập nhật lịch sử thanh toán thành công')
          onSuccess()
        } else {
          toast.error(response?.data?.message || 'Có lỗi xảy ra')
        }
      }
    } catch (error) {
      console.error('Error saving payment history:', error)
      toast.error('Có lỗi xảy ra khi lưu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflowY: "initial"
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h5" fontWeight={600} component="div">
          {mode === DialogMode.ADD ? 'Thêm - Lịch sử thanh toán' : 'Chỉnh sửa - Lịch sử thanh toán'}
        </Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: theme => theme.palette.grey[500] }}>
          <i className="ri-close-line" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Ngày nộp */}
          <Controller
            name="paymentDate"
            control={control}
            rules={{ required: 'Ngày nộp là bắt buộc' }}
            render={({ field }) => (
              <AppReactDatepicker
                boxProps={{ className: 'is-full' }}
                selected={field.value ? new Date(field.value) : null}
                showYearDropdown
                showMonthDropdown
                dateFormat='dd/MM/yyyy'
                maxDate={new Date()}
                onChange={(date) => {
                  if (date) {
                    field.onChange(date.toISOString().split('T')[0])
                  } else {
                    field.onChange('')
                  }
                }}
                customInput={
                  <TextField
                    fullWidth
                    size='medium'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>Ngày nộp</span>
                        <span style={{ color: 'red' }}>*</span>
                      </Box>
                    }
                    error={!!errors.paymentDate}
                    helperText={errors.paymentDate?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: errors.paymentDate ? '#d32f2f' : '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.paymentDate ? '#d32f2f' : '#bdbdbd',
                        },
                      }
                    }}
                  />
                }
              />
            )}
          />

          {/* Loại phí */}
          <Controller
            name="paymentId"
            control={control}
            rules={{ required: 'Vui lòng chọn Loại phí' }}
            render={({ field }) => (
              <Autocomplete
                options={paymentOptions}
                value={paymentOptions.find(option => option.value === field.value) || null}
                getOptionLabel={(option) => option?.label || ''}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(_, newValue) => field.onChange(newValue?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>Loại phí</span>
                        <span style={{ color: 'red' }}>*</span>
                      </Box>
                    }
                    error={!!errors.paymentId}
                    helperText={errors.paymentId?.message}
                  />
                )}
                noOptionsText="Không có dữ liệu"
              />
            )}
          />

          {/* Số tiền */}
          <Controller
            name="amountInput"
            control={control}
            rules={{ required: 'Vui lòng nhập số tiền' }}
            render={({ field }) => (
              <TextField
                {...field}
                label={<span>Số tiền <span style={{ color: 'red' }}>(*)</span></span>}
                fullWidth
                variant="outlined"
                onChange={e => field.onChange(formatAmount(e.target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">VNĐ</InputAdornment>
                }}
                error={!!errors.amountInput}
                helperText={errors.amountInput?.message}
              />
            )}
          />

          {/* Ghi chú */}
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ghi chú"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
              />
            )}
          />
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { borderColor: 'primary.dark', backgroundColor: 'transparent' }
          }}
        >
          HỦY
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isLoading}
          sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
        >
          {isLoading ? 'Đang lưu...' : 'XÁC NHẬN'}
        </Button>
      </DialogActions>
    </Dialog >
  )
}

export default AddPaymentHistoryDialog
