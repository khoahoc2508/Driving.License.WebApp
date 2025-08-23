'use client'

import { useState, useEffect } from 'react'

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

import type { CreateExamYardCommand, UpdateExamYardCommand, GetExamYardsDto } from '@/types/examYardTypes'
import examYardsAPI from '@/libs/api/examYardsAPI'

export enum DialogMode {
    ADD = 0,
    EDIT = 1
}

interface AddExamYardDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    editData?: GetExamYardsDto | null
    mode?: DialogMode
}

interface FormData extends Omit<CreateExamYardCommand, 'id'> {
    id?: string
}

const AddExamYardDialog = ({
    open,
    onClose,
    onSuccess,
    editData = null,
    mode = DialogMode.ADD
}: AddExamYardDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            description: '',
            active: true
        }
    })

    useEffect(() => {
        if (editData && mode === DialogMode.EDIT) {
            setValue('name', editData.name || '')
            setValue('description', editData.description || '')
            setValue('active', editData.active === true)
        }
    }, [editData, mode, setValue])

    const handleClose = () => {
        reset()
        setIsSubmitting(false)
        onClose()
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            if (mode === DialogMode.EDIT && editData) {
                const payload: UpdateExamYardCommand = {
                    id: editData.id!,
                    name: data.name,
                    description: data.description,
                    active: data.active
                }

                const response = await examYardsAPI.UpdateExamYard(payload)

                if (response.data.success) {
                    toast.success('Chỉnh sửa sân thi thành công')
                    handleClose()
                    onSuccess()
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi chỉnh sửa sân thi')
                }
            } else {
                const payload: CreateExamYardCommand = {
                    name: data.name,
                    description: data.description,
                    active: data.active
                }

                const response = await examYardsAPI.CreateExamYard(payload)

                if (response.data.success) {
                    toast.success('Thêm sân thi thành công')
                    handleClose()
                    onSuccess()
                } else {
                    toast.error(response.data.message || 'Có lỗi xảy ra khi thêm sân thi')
                }
            }
        } catch (error: any) {
            const errorMessage = mode === DialogMode.EDIT ? 'Có lỗi xảy ra khi chỉnh sửa sân thi' : 'Có lỗi xảy ra khi thêm sân thi'

            toast.error(error?.message || errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const getDialogTitle = () => {
        return mode === DialogMode.EDIT ? 'Chỉnh sửa sân thi' : 'Thêm sân thi'
    }

    const getSubmitButtonText = () => {
        if (isSubmitting) {
            return mode === DialogMode.EDIT ? 'Đang chỉnh sửa...' : 'Đang thêm...'
        }

        return 'XÁC NHẬN'
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
                    {getDialogTitle()}
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
                        name="name"
                        control={control}
                        rules={{
                            required: 'Vui lòng nhập tên',
                            minLength: { value: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={
                                    <span>
                                        Tên <span style={{ color: 'red' }}>(*)</span>
                                    </span>
                                }
                                fullWidth
                                variant="outlined"
                                error={!!errors.name}
                                helperText={errors.name?.message}
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
                    {getSubmitButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddExamYardDialog
