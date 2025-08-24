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
    FormHelperText
} from '@mui/material'
import { toast } from 'react-toastify'
import type { GetTaskDto } from '@/types/stepsTypes'
import type { AssigneeType } from '@/types/assigneeTypes'
import CONFIG from '@/configs/config'
import assigneeAPI from '@/libs/api/assigneeAPI'

type EditTaskDialogProps = {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    task: GetTaskDto | null
}

type FormData = {
    [key: string]: any
    note?: string
    assigneeId?: string
}

type AssigneeOption = {
    value: string
    label: string
}

const EditTaskDialog = ({ open, onClose, onSuccess, task }: EditTaskDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [assigneeOptions, setAssigneeOptions] = useState<AssigneeOption[]>([])

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            note: '',
            assigneeId: ''
        }
    })

    // Fetch assignee options (danh sách nhân viên)
    const fetchAssigneeOptions = async () => {
        try {
            const res = await assigneeAPI.GetAssignees({
                assigneeType: CONFIG.AssigneeTypes.Employee as AssigneeType,
                pageNumber: 1,
                pageSize: 9999
            })

            if (res?.data?.data) {
                const options = res.data.data.map((assignee: any) => ({
                    label: assignee.fullName || 'Unknown',
                    value: assignee.id || ''
                }))
                setAssigneeOptions(options)
            }
        } catch (error: any) {
            console.error('Error fetching assignee options:', error)
            setAssigneeOptions([])
        }
    }

    useEffect(() => {
        if (open) {
            fetchAssigneeOptions()
        }
    }, [open])

    useEffect(() => {
        if (!open || !task) return

        // Reset form and set default values from taskFieldTemplateConfig
        reset()
        const defaultValues: FormData = {
            note: task.note || '',
            assigneeId: task.assignee?.id || ''
        }

        // Set values from taskFieldTemplateConfig
        task.taskFieldTemplateConfig?.forEach(field => {
            if (field.key) {
                // Find existing value from submissions
                const submission = task.taskFieldInstanceSubmissions?.find(
                    sub => sub.taskFieldTemplateConfigId === field.id
                )
                defaultValues[field.key] = submission?.value || field.defaultValue || ''
            }
        })

        // Set form values
        Object.keys(defaultValues).forEach(key => {
            setValue(key, defaultValues[key])
        })
    }, [open, task, reset, setValue])

    const handleClose = () => {
        reset()
        setIsSubmitting(false)
        onClose()
    }

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        try {
            // TODO: Implement API call to update task
            console.log('Updating task with data:', data)

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success('Cập nhật công việc thành công')
            handleClose()
            onSuccess()
        } catch (error: any) {
            toast.error(error?.message || 'Có lỗi xảy ra khi cập nhật công việc')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderField = (field: any) => {
        const fieldKey = field.key
        const isRequired = field.isRequired
        const label = field.label
        const hint = field.hint
        const description = field.description

        switch (field.inputType) {
            case CONFIG.InputType.Text: // Text input
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={isRequired ? `${label} (*)` : label}
                                fullWidth
                                variant="outlined"
                                value={value || ''}
                                onChange={onChange}
                                error={!!errors[fieldKey]}
                                helperText={errors[fieldKey]?.message || hint || description}
                            />
                        )}
                    />
                )

            case CONFIG.InputType.Number: // Number input
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={isRequired ? `${label} (*)` : label}
                                fullWidth
                                variant="outlined"
                                type="number"
                                value={value || ''}
                                onChange={onChange}
                                error={!!errors[fieldKey]}
                                helperText={errors[fieldKey]?.message || hint || description}
                            />
                        )}
                    />
                )

            case CONFIG.InputType.DateOnly: // Date input
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={isRequired ? `${label} (*)` : label}
                                fullWidth
                                variant="outlined"
                                type="date"
                                value={value || ''}
                                onChange={onChange}
                                InputLabelProps={{ shrink: true }}
                                error={!!errors[fieldKey]}
                                helperText={errors[fieldKey]?.message || hint || description}
                            />
                        )}
                    />
                )

            case CONFIG.InputType.SingleSelect: // Select dropdown
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <FormControl fullWidth error={!!errors[fieldKey]}>
                                <InputLabel>{isRequired ? `${label} (*)` : label}</InputLabel>
                                <Select
                                    value={value || ''}
                                    onChange={onChange}
                                    label={isRequired ? `${label} (*)` : label}
                                >
                                    {/* TODO: Add options based on dataSourceConfig */}
                                    <MenuItem value="">Chọn...</MenuItem>
                                </Select>
                                {errors[fieldKey] && (
                                    <FormHelperText>{String(errors[fieldKey]?.message || 'Có lỗi xảy ra')}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                )

            case CONFIG.InputType.Textarea: // Textarea
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={isRequired ? `${label} (*)` : label}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={3}
                                value={value || ''}
                                onChange={onChange}
                                error={!!errors[fieldKey]}
                                helperText={errors[fieldKey]?.message || hint || description}
                            />
                        )}
                    />
                )

            default:
                return (
                    <Controller
                        name={fieldKey}
                        control={control}
                        rules={isRequired ? { required: `${label} là bắt buộc` } : {}}
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label={isRequired ? `${label} (*)` : label}
                                fullWidth
                                variant="outlined"
                                value={value || ''}
                                onChange={onChange}
                                error={!!errors[fieldKey]}
                                helperText={errors[fieldKey]?.message || hint || description}
                            />
                        )}
                    />
                )
        }
    }

    if (!task) return null

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
                    <span className='opacity-70'>Cập nhật</span> - {task.title}
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} sx={{ color: theme => theme.palette.grey[500] }}>
                    <i className="ri-close-line" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Dynamic fields from taskFieldTemplateConfig */}
                    {task.taskFieldTemplateConfig
                        ?.filter(field => field.isVisible && field.active)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map(field => (
                            <Box key={field.id}>
                                {renderField(field)}
                            </Box>
                        ))
                    }

                    {/* Note field */}
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
                                value={field.value || ''}
                            />
                        )}
                    />

                    <Divider sx={{ my: 2 }} />

                    {/* Assignee field */}
                    <FormControl fullWidth error={!!errors.assigneeId}>
                        <InputLabel>Người phụ trách <span style={{ color: 'red' }}>(*)</span></InputLabel>
                        <Controller
                            name="assigneeId"
                            control={control}
                            rules={{ required: 'Vui lòng chọn người phụ trách' }}
                            render={({ field }) => (
                                <Select {...field} label="Người phụ trách (*)">
                                    {assigneeOptions.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.assigneeId && (
                            <FormHelperText>{String(errors.assigneeId.message || 'Có lỗi xảy ra')}</FormHelperText>
                        )}
                    </FormControl>

                    {/* Status field */}
                    <FormControl fullWidth>
                        <InputLabel>Trạng thái (*)</InputLabel>
                        <Select
                            value={task.status || 0}
                            label={<span>Trạng thái <span style={{ color: 'red' }}>(*)</span></span>}
                        >
                            <MenuItem value={0}>Chưa xử lý</MenuItem>
                            <MenuItem value={1}>Đang xử lý</MenuItem>
                            <MenuItem value={2}>Hoàn thành</MenuItem>
                        </Select>
                    </FormControl>
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
                    disabled={isSubmitting}
                    sx={{ backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
                >
                    {isSubmitting ? 'Đang cập nhật...' : 'XÁC NHẬN'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditTaskDialog

