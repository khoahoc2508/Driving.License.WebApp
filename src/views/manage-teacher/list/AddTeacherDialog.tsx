'use client'

import { useState } from 'react'
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
    FormHelperText
} from '@mui/material'

import { toast } from 'react-toastify'

import type { UpsertAssigneeCommand } from '@/types/assigneeTypes'
import assigneeAPI from '@/libs/api/assigneeAPI'

interface AddTeacherDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

interface FormData extends Omit<UpsertAssigneeCommand, 'assigneeType'> {
    assigneeType: number
}

const AddTeacherDialog = ({ open, onClose, onSuccess }: AddTeacherDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            fullName: '',
            phone: '',
            description: '',
            active: true,
            assigneeType: 1
        }
    })

    const handleClose = () => {
        reset()
        setIsSubmitting(false)
        onClose()
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            const response = await assigneeAPI.UpsertAssignee(data)

            if (response.data.success) {
                toast.success('Thêm giáo viên thành công')
                handleClose()
                onSuccess()
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi thêm giáo viên')
            }
        } catch (error: any) {
            toast.error(error?.message || 'Có lỗi xảy ra khi thêm giáo viên')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: '5px',
                    minWidth: '30%'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: 2,
            }}>
                <Typography variant="h5" fontWeight={600} component="div">
                    Thêm giáo viên
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <i className="ri-close-line" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Controller
                        name="fullName"
                        control={control}
                        rules={{
                            required: 'Vui lòng nhập họ tên',
                            minLength: { value: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Họ tên"
                                fullWidth
                                variant="outlined"
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                                required
                            />
                        )}
                    />

                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            pattern: {
                                value: /^[0-9+\-\s()]*$/,
                                message: 'Số điện thoại không hợp lệ'
                            },
                            minLength: { value: 10, message: 'Số điện thoại phải có ít nhất 10 số' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Số điện thoại"
                                fullWidth
                                variant="outlined"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                            />
                        )}
                    />

                    <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.active}>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    {...field}
                                    label="Trạng thái"
                                    value={field.value ? 'true' : 'false'}
                                    onChange={(e) => field.onChange(e.target.value === 'true')}
                                >
                                    <MenuItem value="true">Đang hoạt động</MenuItem>
                                    <MenuItem value="false">Dừng hoạt động</MenuItem>
                                </Select>
                                {errors.active && (
                                    <FormHelperText>{errors.active.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            maxLength: { value: 500, message: 'Mô tả không được quá 500 ký tự' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Mô tả"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'transparent'
                        }
                    }}
                >
                    HỦY
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    {isSubmitting ? 'Đang thêm...' : 'XÁC NHẬN'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTeacherDialog
