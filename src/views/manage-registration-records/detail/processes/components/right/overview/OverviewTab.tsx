'use client'

import { useEffect, useState } from 'react'

import { Box, Typography, Chip, Divider, IconButton, TextField, InputAdornment } from '@mui/material'

import type { GetStepsDto, StepOverviewDto } from '@/types/stepsTypes'
import type { components } from '@/libs/api/client/schema'
import { getInputBehavior } from '@/utils/helpers'
import CONFIG from '@/configs/config'
import stepsAPI from '@/libs/api/stepsAPI'

type OverviewTabProps = {
    selectedStep: GetStepsDto | null
}

const OverviewTab = ({ selectedStep }: OverviewTabProps) => {

    const [stepOverview, setStepOverview] = useState<StepOverviewDto | null>(null)
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState<string>('')

    useEffect(() => {
        if (selectedStep?.id) {
            fetchStepOverview(selectedStep.id)
        }
    }, [selectedStep])

    const fetchStepOverview = async (id: string) => {
        const response = await stepsAPI.GetStepByStepIdOverview({ id })

        setStepOverview(response?.data?.data)
    }

    const startEdit = (item: components['schemas']['StepFieldInstanceSubmissionDto']) => {
        const fieldId = String(item.stepFieldTemplateConfig?.id || '')

        setEditingFieldId(fieldId)
        setEditingValue(String(item?.value ?? ''))
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

    return (
        <Box>
            <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Trạng thái:
                </Typography>
                <Chip
                    label={getStatusText(stepOverview?.status)}
                    color={getStatusColor(stepOverview?.status)}
                    size="small"
                    sx={{ width: 'fit-content' }}
                />
                {stepOverview?.stepFieldInstanceSubmissions?.map(
                    (
                        item: components['schemas']['StepFieldInstanceSubmissionDto'],
                        index: number
                    ) => (
                        <Box
                            key={`step-field-${item.stepFieldTemplateConfig?.id || 'unknown'}-${index}`}
                            sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, alignItems: 'center' }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.stepFieldTemplateConfig?.label}
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
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            {item?.value ?? 'Chưa có'}
                                        </Typography>
                                        {item.stepFieldTemplateConfig?.canEditInline ? (
                                            <IconButton size="small" aria-label="edit" onClick={() => startEdit(item)}>
                                                <i className="ri-edit-box-line text-textSecondary" />
                                            </IconButton>
                                        ) : null}
                                    </>
                                )}
                            </Box>
                        </Box>
                    )
                )}
            </Box>
            {(stepOverview?.taskInfos ?? []).length > 0 && <Divider sx={{ my: 2 }} />}
            <Box sx={{ p: 4 }}>
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
                            sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 3, mb: 2 }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                {field.label}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {field.value ?? 'Chưa có'}
                                </Typography>
                                {field.canEditInline ? (
                                    <IconButton size="small" aria-label="edit">
                                        <i className="ri-edit-box-line text-textSecondary" />
                                    </IconButton>
                                ) : null}
                            </Box>
                        </Box>
                    ))}
            </Box>
        </Box>
    )
}

export default OverviewTab
