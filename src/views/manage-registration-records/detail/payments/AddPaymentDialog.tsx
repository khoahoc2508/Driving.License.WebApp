'use client'

import { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Button,
    Divider,
    FormHelperText,
    InputAdornment
} from '@mui/material'
import { toast } from 'react-toastify'

import type { CreatePaymentCommand } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import feeTypeAPI from '@/libs/api/feeTypeAPI'
import { formatCurrencyVNDInput } from '@/utils/helpers'

export enum DialogMode {
    ADD = 0,
    EDIT = 1
}

type FeeTypeOption = { value: string; label: string }

type AddPaymentDialogProps = {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    registrationRecordId: string
    mode?: DialogMode
    editPaymentId?: string | null
}

type FormData = {
    feeTypeId: string
    amountInput: string
    note?: string
}

const AddPaymentDialog = ({ open, onClose, onSuccess, registrationRecordId, mode = DialogMode.ADD, editPaymentId = null }: AddPaymentDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feeTypeOptions, setFeeTypeOptions] = useState<FeeTypeOption[]>([])
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            feeTypeId: '',
            amountInput: '',
            note: ''
        }
    })

    useEffect(() => {
        if (!open) return

        const fetchFeeTypes = async () => {
            try {
                const res = await feeTypeAPI.GetFeeTypes({ pageNumber: 1, pageSize: 9999 } as any)
                const options = res?.data?.data?.map((x: any) => ({ value: x.id, label: x.name })) || []

                setFeeTypeOptions(options)
            } catch (e) {
                setFeeTypeOptions([])
            }
        }

        fetchFeeTypes()
    }, [open])

    useEffect(() => {
        if (!open || mode !== DialogMode.EDIT || !editPaymentId) return

        const fetchDetail = async () => {
            try {
                setIsLoadingDetail(true)
                const res = await registrationRecordsAPI.GetPaymentById(editPaymentId)
                const detail = res?.data?.data

                if (detail) {
                    setValue('feeTypeId', detail.feeTypeId || '')
                    setValue('amountInput', new Intl.NumberFormat('vi-VN').format(detail.amount ?? 0))
                    setValue('note', detail.note || '')
                }
            } finally {
                setIsLoadingDetail(false)
            }
        }

        fetchDetail()
    }, [open, mode, editPaymentId, setValue])

    const handleClose = () => {
        reset()
        setIsSubmitting(false)
        onClose()
    }

    const parseAmount = (input: string): number => {
        const numeric = input.replace(/[^\d]/g, '')

        
return numeric ? Number(numeric) : 0
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            if (mode === DialogMode.EDIT && editPaymentId) {
                const payload = {
                    id: editPaymentId,
                    feeTypeId: data.feeTypeId,
                    registrationRecordId,
                    amount: parseAmount(data.amountInput),
                    note: data.note || ''
                }

                const response = await registrationRecordsAPI.UpdatePayment(editPaymentId, payload as any)

                if (response.data.success) {
                    toast.success('Cập nhật khoản phí thành công')
                    handleClose()
                    onSuccess()
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi cập nhật khoản phí')
                }


                return
            }

            const payload: CreatePaymentCommand = {
                feeTypeId: data.feeTypeId,
                registrationRecordId,
                amount: parseAmount(data.amountInput),
                note: data.note || ''
            }

            const response = await registrationRecordsAPI.CreatePayment(payload)

            if (response.data.success) {
                toast.success('Thêm khoản phí thành công')
                handleClose()
                onSuccess()
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi thêm khoản phí')
            }
        } catch (error: any) {
            toast.error(error?.message || 'Có lỗi xảy ra')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getDialogTitle = () => (mode === DialogMode.EDIT ? 'Chỉnh sửa - Khoản phí' : 'Thêm - Khoản phí')
    const submitButtonText = isSubmitting ? (mode === DialogMode.EDIT ? 'Đang cập nhật...' : 'Đang thêm...') : 'XÁC NHẬN'

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            PaperProps={{
                style: { borderRadius: '5px', minWidth: '30%' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
                <Typography variant="h5" fontWeight={600} component="div">
                    {getDialogTitle()}
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} sx={{ color: theme => theme.palette.grey[500] }}>
                    <i className="ri-close-line" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <FormControl fullWidth error={!!errors.feeTypeId}>
                        <InputLabel>Loại phí <span style={{ color: 'red' }}>(*)</span></InputLabel>
                        <Controller
                            name="feeTypeId"
                            control={control}
                            rules={{ required: 'Vui lòng chọn loại phí' }}
                            render={({ field }) => (
                                <Select {...field} label="Loại phí (*)">
                                    {feeTypeOptions.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.feeTypeId && (
                            <FormHelperText>{errors.feeTypeId.message}</FormHelperText>
                        )}
                    </FormControl>

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
                                onChange={e => field.onChange(formatCurrencyVNDInput(e.target.value))}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">VND</InputAdornment>
                                }}
                                error={!!errors.amountInput}
                                helperText={errors.amountInput?.message}
                            />
                        )}
                    />

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
                    disabled={isSubmitting || isLoadingDetail}
                    sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
                >
                    {submitButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddPaymentDialog
