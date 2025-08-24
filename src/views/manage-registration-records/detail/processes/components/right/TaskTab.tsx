'use client'

import stepsAPI from '@/libs/api/stepsAPI'
import type { GetStepsDto, GetTaskDto } from '@/types/stepsTypes'
import { Box, Typography, Chip, IconButton, Avatar } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type FilterFn } from '@tanstack/react-table'
import classnames from 'classnames'
import styles from '@core/styles/table.module.css'
import CONFIG from '@/configs/config'

type TaskTabProps = {
    selectedStep: GetStepsDto | null
}

const columnHelper = createColumnHelper<GetTaskDto>()

// Add fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
    const itemValue = row.getValue(columnId)
    if (typeof itemValue === 'string' && typeof value === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
    }
    return true
}

const TaskTab = ({ selectedStep }: TaskTabProps) => {
    const [tasks, setTasks] = useState<GetTaskDto[]>([])

    const fetchTasks = async () => {
        if (selectedStep?.id) {
            const response = await stepsAPI.GetTaskByStepId({ id: selectedStep.id })
            setTasks(response.data?.data || [])
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [selectedStep?.id])

    const getStatusText = (status: number | undefined) => {
        if (status === undefined) return 'Không xác định'
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
        if (status === undefined) return 'default'
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

    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            id: 'stt',
            header: () => <Typography>STT</Typography>,
            cell: ({ row, table }) => (
                <Typography>{table.getRowModel().rows.indexOf(row) + 1}</Typography>
            ),
            size: 50,
            minSize: 50
        }),
        columnHelper.accessor('title', {
            header: 'CÔNG VIỆC',
            cell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.light',
                            color: 'primary.main',
                            fontSize: '0.875rem'
                        }}
                    >
                        {row.original.title?.charAt(0) || 'T'}
                    </Avatar>
                    <Box className='flex flex-col items-start'>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {row.original.title || 'Không có tên'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.75rem' }}>
                            <Typography variant="caption" color="text.secondary">
                                Trạng thái:
                            </Typography>
                            <Chip
                                label={getStatusText(row.original.status)}
                                color={getStatusColor(row.original.status)}
                                size="small"
                                sx={{ height: 20, fontSize: '0.75rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                |
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Người xử lý: {row.original.assigneeId || 'Chưa được giao'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ),
            size: 300,
            minSize: 250
        }),
        columnHelper.accessor('note', {
            header: 'GHI CHÚ',
            cell: ({ row }) => (
                <Typography color="text.secondary" sx={{ textAlign: "left" }}>
                    {row.original.note || '-'}
                </Typography>
            ),
            size: 200,
            minSize: 150
        }),
        columnHelper.accessor('id', {
            id: 'actions',
            header: 'THAO TÁC',
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <IconButton size="small">
                        <i className="ri-edit-box-line text-textSecondary" />
                    </IconButton>
                </div>
            ),
            enableSorting: false,
            size: 80,
            minSize: 60
        })
    ], [])

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
        filterFns: {
            fuzzy: fuzzyFilter
        }
    })

    if (!selectedStep) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                    Vui lòng chọn một bước để xem thông tin công việc
                </Typography>
            </Box>
        )
    }

    return (
        <Box>
            <div className='overflow-x-auto custom-scrollbar'>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="h-9">
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} style={{
                                            width: header.getSize(),
                                            minWidth: header.column.columnDef.minSize,
                                            maxWidth: header.column.columnDef.maxSize
                                        }}>
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center justify-center">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row, index) => (
                                <tr key={`${row.id}-${index}`} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell, cellIndex) => (
                                        <td key={`${cell.id}-${cellIndex}`}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Box>
    )
}

export default TaskTab
