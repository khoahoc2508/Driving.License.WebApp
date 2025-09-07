'use client'

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'

import { Box, Typography, Chip, Divider, IconButton, TextField, InputAdornment, Button, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material'

import { toast } from 'react-toastify'

import type { GetStepsDto, StepActionTemplateDto, StepOverviewDto } from '@/types/stepsTypes'
import type { components } from '@/libs/api/client/schema'
import { getInputBehavior } from '@/utils/helpers'
import CONFIG from '@/configs/config'
import stepsAPI from '@/libs/api/stepsAPI'

type OverviewTabProps = {
    selectedStep: GetStepsDto | null
    registrationRecordId: string | undefined
    onRefreshSteps: (count: number) => void
}

export type OverviewTabRef = {
    refreshStepOverview: () => void
}

const OverviewTab = forwardRef<OverviewTabRef, OverviewTabProps>(({ selectedStep, registrationRecordId, onRefreshSteps }, ref) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [stepOverview, setStepOverview] = useState<StepOverviewDto | null>(null)
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState<string>('')
    const [stepActions, setStepActions] = useState<StepActionTemplateDto[]>([])
    const [isCreatingStep, setIsCreatingStep] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [selectedAction, setSelectedAction] = useState<StepActionTemplateDto | null>(null)

    useEffect(() => {
        if (selectedStep?.id) {
            fetchStepOverview(selectedStep.id)
            fetchStepActions(selectedStep.id)
        }
    }, [selectedStep])

    // Expose refreshStepOverview method to parent component
    useImperativeHandle(ref, () => ({
        refreshStepOverview: () => {
            if (selectedStep?.id) {
                fetchStepOverview(selectedStep.id)
            }
        }
    }), [selectedStep])

    const fetchStepOverview = async (id: string) => {
        const response = await stepsAPI.GetStepByStepIdOverview({ id })

        const overviewData = response?.data?.data

        setStepOverview(overviewData)

        return overviewData
    }

    const fetchStepActions = async (id: string) => {
        const response = await stepsAPI.GetStepActionsByStepId(id)

        setStepActions(response?.data?.data || [])
    }

    const startEdit = (item: components['schemas']['StepFieldInstanceSubmissionDto']) => {
        const fieldId = String(item.stepFieldTemplateConfig?.id || '')

        setEditingFieldId(fieldId)
        setEditingValue(
            String(
                (item?.value !== undefined && item?.value !== null && String(item?.value).trim() !== '')
                    ? item?.value
                    : (item.stepFieldTemplateConfig?.defaultValue ?? '')
            )
        )
    }

    const cancelEdit = () => {
        setEditingFieldId(null)
        setEditingValue('')
    }

    const saveEdit = async (
        stepId: string,
        item: components['schemas']['StepFieldInstanceSubmissionDto']
    ) => {
        const stepFieldTemplateConfigId = String(item.stepFieldTemplateConfig?.id || '')

        await stepsAPI.UpdateStepFieldInline({
            stepId,
            stepFieldInstanceSubmissions: [
                { stepFieldTemplateConfigId, value: editingValue }
            ]
        })
        await fetchStepOverview(stepId)

        onRefreshSteps(0)

        cancelEdit()
    }

    if (!selectedStep) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    Vui lòng chọn một bước để xem thông tin tổng quan
                </Typography>
            </Box>
        )
    }

    const getStatusText = (status: number | undefined) => {
        if (status === undefined) {
            return ''
        }

        switch (status) {
            case CONFIG.StepStatus.Pending:
                return 'Chưa xử lý'
            case CONFIG.StepStatus.InProgress:
                return 'Đang xử lý'
            case CONFIG.StepStatus.Completed:
                return 'Hoàn thành'
            default:
                return 'Không xác định'
        }
    }

    const getStatusColor = (status: number | undefined) => {
        if (status === undefined) {
            return 'default'
        }

        switch (status) {
            case CONFIG.StepStatus.Pending:
                return 'default'
            case CONFIG.StepStatus.InProgress:
                return 'warning'
            case CONFIG.StepStatus.Completed:
                return 'success'
            default:
                return 'default'
        }
    }

    const handleCreateStepFromAction = async (action: StepActionTemplateDto) => {
        try {
            if (registrationRecordId && action.stepTemplates && action.stepTemplates.length > 0) {
                setSelectedAction(action)
                setShowConfirmDialog(true)
            }
        } catch (error) {
            console.error('Error preparing step creation:', error)

            // Có thể thêm thông báo lỗi ở đây
        }
    }

    const handleConfirmCreate = async () => {
        if (selectedAction && registrationRecordId && selectedAction.stepTemplates) {
            setIsCreatingStep(true)

            try {
                // Tạo tất cả các step từ templates
                for (const stepTemplate of selectedAction.stepTemplates) {
                    if (stepTemplate.id) {
                        const response = await stepsAPI.CreateStepFromTemplate({
                            stepTemplateId: stepTemplate.id,
                            recordRegistrationId: registrationRecordId
                        })

                        if (response.data?.success && response.data?.data) {
                            console.log(`Đã tạo step từ template: ${stepTemplate.name}`)
                        } else {
                            console.error(`Lỗi khi tạo step từ template: ${stepTemplate.name}`)
                        }
                    }
                }

                onRefreshSteps(selectedAction.stepTemplates.length)
                toast.success(`Đã tạo bước "${selectedAction?.name}" thành công`)
                setShowConfirmDialog(false)
                setSelectedAction(null)
            } catch (error) {
                // Có thể thêm thông báo lỗi ở đây
                toast.error(`Lỗi khi tạo bước "${selectedAction?.name}"`)
            } finally {
                setIsCreatingStep(false)
            }
        }
    }

    const handleCancelCreate = () => {
        setShowConfirmDialog(false)
        setSelectedAction(null)
    }

    return (
        <Box>
            <Box sx={{ p: isMobile ? 2 : 4, display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr', rowGap: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Trạng thái:
                </Typography>
                <Chip
                    label={getStatusText(stepOverview?.status)}
                    color={getStatusColor(stepOverview?.status)}
                    size="small"
                    sx={{ width: 'fit-content' }}
                />
                <Box className='flex flex-col gap-3'>
                    {stepOverview?.stepFieldInstanceSubmissions?.map(
                        (
                            item: components['schemas']['StepFieldInstanceSubmissionDto'],
                            index: number
                        ) => (
                            <Box
                                key={`step-field-${item.stepFieldTemplateConfig?.id || 'unknown'}-${index}`}
                                sx={{ display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr', rowGap: 3, alignItems: 'center' }}
                            >
                                <Typography variant="subtitle2" color="text.secondary">
                                    {item.stepFieldTemplateConfig?.label}:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {editingFieldId === item.stepFieldTemplateConfig?.id ? (
                                        <>
                                            <TextField
                                                size="small"
                                                value={editingValue}
                                                onChange={(e) => {
                                                    const behavior = getInputBehavior({
                                                        inputType: item.stepFieldTemplateConfig?.inputType,
                                                        prefix: item.stepFieldTemplateConfig?.prefix
                                                    } as any)

                                                    setEditingValue(behavior.format(e.target.value))
                                                }}
                                                fullWidth
                                                sx={{ width: { xs: 100, sm: 300 } }}
                                                InputProps={{
                                                    startAdornment: item.stepFieldTemplateConfig?.prefix ? (
                                                        <InputAdornment position="start">{String(item.stepFieldTemplateConfig?.prefix)}</InputAdornment>
                                                    ) : undefined
                                                }}
                                            />
                                            <IconButton size="small" aria-label="save" onClick={() => selectedStep?.id && saveEdit(selectedStep.id, item)}>
                                                <i className="ri-check-line" style={{ color: '#11a600' }} />
                                            </IconButton>
                                            <IconButton size="small" aria-label="cancel" onClick={cancelEdit}>
                                                <i className="ri-close-circle-line" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="body1" sx={item?.value !== undefined && item?.value !== null && String(item?.value).trim() !== '' || item.stepFieldTemplateConfig?.defaultValue ? { fontWeight: 600 } : {}}>
                                                {(item?.value !== undefined && item?.value !== null && String(item?.value).trim() !== '')
                                                    ? item?.value ?? '-'
                                                    : (item.stepFieldTemplateConfig?.defaultValue ?? '-')}
                                            </Typography>
                                            {item.stepFieldTemplateConfig?.canEditInline ? (
                                                <IconButton size="small" aria-label="edit" onClick={() => startEdit(item)}>
                                                    <i className="ri-edit-line" />
                                                </IconButton>
                                            ) : null}
                                        </>
                                    )}
                                </Box>
                            </Box>
                        )
                    )}
                </Box>
            </Box>
            {(stepOverview?.taskInfos ?? []).length > 0 && <Divider sx={{ my: 2 }} />}
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                {stepOverview?.taskInfos
                    ?.flatMap(
                        (task, taskIndex) =>
                            task.taskFieldInstanceSubmissions?.map(
                                (
                                    tItem: components['schemas']['TaskFieldInstanceSubmissionDto'],
                                    fieldIndex
                                ) => ({
                                    key:
                                        `task-${taskIndex}-${tItem.taskFieldTemplateConfig?.id || 'unknown'}-${fieldIndex}`,
                                    label: tItem.taskFieldTemplateConfig?.label,
                                    value: tItem.value,
                                    canEditInline:
                                        tItem.taskFieldTemplateConfig?.canEditInline ?? false
                                })
                            ) || []
                    )
                    .map((field) => (
                        <Box
                            key={field.key}
                            sx={{ display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr', rowGap: 3, mb: 2 }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                {field.label}:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={field?.value !== undefined && field?.value !== null && String(field?.value).trim() !== '' ? { fontWeight: 600 } : {}}>
                                    {(field?.value !== undefined && field?.value !== null && String(field?.value).trim() !== '')
                                        ? field?.value
                                        : '-'}
                                </Typography>
                                {field.canEditInline ? (
                                    <IconButton size="small" aria-label="edit">
                                        <i className="ri-edit-line" />
                                    </IconButton>
                                ) : null}
                            </Box>
                        </Box>
                    ))}
            </Box>
            {stepActions.length > 0 && <Divider sx={{ my: 2 }} />}
            {stepActions.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        my: 4
                    }}
                >
                    {stepActions
                        .sort((a, b) => (b.order || 0) - (a.order || 0))
                        .map((action) => (
                            <Button
                                key={action.id}
                                variant='contained'
                                color='primary'
                                onClick={() => handleCreateStepFromAction(action)}
                                disabled={isCreatingStep}
                            >
                                {isCreatingStep ? 'Đang tạo...' : action.name}
                            </Button>
                        ))}
                </Box>
            )}
            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onClose={handleCancelCreate}>
                <DialogTitle>Xác nhận?</DialogTitle>
                <DialogContent>
                    <Typography>
                        {`Bạn đang thêm bước "${selectedAction?.name}" cho học viên. Xác nhận tiếp tục?`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCreate} color="error" variant="outlined">
                        HỦY
                    </Button>
                    <Button
                        onClick={handleConfirmCreate}
                        color="primary"
                        variant="contained"
                        disabled={isCreatingStep}
                    >
                        {isCreatingStep ? 'Đang tạo...' : 'XÁC NHẬN'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})

OverviewTab.displayName = 'OverviewTab'

export default OverviewTab
