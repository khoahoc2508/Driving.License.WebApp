'use client'

import stepsAPI from '@/libs/api/stepsAPI'
import type { GetStepsDto, GetTaskDto } from '@/types/stepsTypes'
import { Box, Typography, Chip, IconButton, Avatar } from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type FilterFn, type Column } from '@tanstack/react-table'
import styles from '@core/styles/table.module.css'
import CONFIG from '@/configs/config'
import EditTaskDialog from './EditTaskDialog'

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

// Thêm function để xử lý pinning styles
const getCommonPinningStyles = (column: Column<any>): React.CSSProperties => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
                ? '4px 0 4px -4px gray inset'
                : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    }
}

const TaskTab = ({ selectedStep }: TaskTabProps) => {
    const [tasks, setTasks] = useState<GetTaskDto[]>([])
    const [selectedTask, setSelectedTask] = useState<GetTaskDto | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [columnPinning, setColumnPinning] = useState({})

    const fetchTasks = async () => {
        if (selectedStep?.id) {
            const response = await stepsAPI.GetTaskByStepId({ id: selectedStep.id })
            setTasks(response.data?.data || [])
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [selectedStep?.id])

    const handleEditTask = (task: GetTaskDto) => {
        setSelectedTask(task)
        setIsEditDialogOpen(true)
    }

    const handleEditDialogClose = () => {
        setIsEditDialogOpen(false)
        setSelectedTask(null)
    }

    const handleEditSuccess = () => {
        fetchTasks() // Refresh tasks after successful edit
        handleEditDialogClose()
    }

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
                        src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${row.original?.assignee?.avatarUrl}`}
                        sx={{
                            width: 40,
                            height: 40
                        }}
                    >
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
                                Người xử lý: {row.original.assignee?.fullName || 'Chưa được giao'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ),
            size: 300,
            minSize: 300
        }),
        columnHelper.accessor('note', {
            header: 'GHI CHÚ',
            cell: ({ row }) => (
                <Typography color="text.secondary" sx={{ textAlign: "right" }}>
                    {row.original.note || '-'}
                </Typography>
            ),
            size: 250,
            minSize: 250
        }),
        columnHelper.accessor('summaryItems', {
            header: 'NỘI DUNG',
            cell: ({ row }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {row.original.summaryItems?.map((item, index) => (
                        <Typography
                            key={index}
                            variant="body2"
                            color="text.primary"
                            sx={{ fontSize: '0.875rem' }}
                        >
                            {item.label}: <span className='font-semibold'>{item.value}</span>
                        </Typography>
                    )) || (
                            <Typography variant="body2" color="text.secondary">
                                Không có dữ liệu
                            </Typography>
                        )}
                </Box>
            ),
            size: 250,
            minSize: 200
        }),
        columnHelper.accessor('id', {
            id: 'actions',
            header: 'THAO TÁC',
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <IconButton
                        size="small"
                        onClick={() => handleEditTask(row.original)}
                    >
                        <i className="ri-edit-box-line text-textSecondary" />
                    </IconButton>
                </div>
            ),
            enableSorting: false,
            size: 80,
            minSize: 60,
        })
    ], [])

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            columnPinning
        },
        onColumnPinningChange: setColumnPinning,
        enableColumnPinning: true
    })

    // Pin cột THAO TÁC sang phải khi component mount
    useEffect(() => {
        if (table.getAllColumns().length > 0) {
            const thaoTacColumn = table.getColumn('actions')
            if (thaoTacColumn) {
                thaoTacColumn.pin('right')
            }
        }
    }, [table])

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
                <table
                    className={styles.table}
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: 0
                    }}
                >
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="h-9">
                                {headerGroup.headers.map(header => {
                                    const isPinned = header.column.getIsPinned()
                                    return (
                                        <th
                                            key={header.id}
                                            style={{
                                                width: header.getSize(),
                                                minWidth: header.column.columnDef.minSize,
                                                maxWidth: header.column.columnDef.maxSize,
                                                position: isPinned ? 'sticky' : 'relative',
                                                right: isPinned === 'right' ? '0px' : undefined,
                                                backgroundColor: isPinned ? 'var(--mui-palette-background-paper)' : 'transparent',
                                                zIndex: isPinned ? 1 : 0,
                                                boxShadow: isPinned === 'right' ? '4px 0 4px -4px gray inset' : undefined
                                            }}
                                        >
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
                                    {row.getVisibleCells().map((cell, cellIndex) => {
                                        const isPinned = cell.column.getIsPinned()
                                        return (
                                            <td
                                                key={`${cell.id}-${cellIndex}`}
                                                style={{
                                                    position: isPinned ? 'sticky' : 'relative',
                                                    right: isPinned === 'right' ? '0px' : undefined,
                                                    backgroundColor: isPinned ? 'var(--mui-palette-background-paper)' : 'transparent',
                                                    zIndex: isPinned ? 1 : 0,
                                                    boxShadow: isPinned === 'right' ? '4px 0 4px -4px gray inset' : undefined
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Task Dialog */}
            <EditTaskDialog
                open={isEditDialogOpen}
                onClose={handleEditDialogClose}
                onSuccess={handleEditSuccess}
                task={selectedTask}
            />
        </Box>
    )
}

export default TaskTab
