'use client'

import { useMemo, useState } from 'react'
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, ColumnFiltersState, FilterFn } from '@tanstack/react-table'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import classnames from 'classnames'
import { toast } from 'react-toastify'
import ChevronRight from '@menu/svg/ChevronRight'
import styles from '@core/styles/table.module.css'
import type { GetPaymentHistoryDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import AddPaymentHistoryDialog, { DialogMode } from './AddPaymentHistoryDialog'

// Column Definitions
const columnHelper = createColumnHelper<GetPaymentHistoryDto>()

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank
    })
    return itemRank.passed
}

type PaymentHistoryTabProps = {
    data: GetPaymentHistoryDto[]
    isLoading: boolean
    onRefresh: () => void
    registrationRecordId?: string
    onAdd?: () => void
    onEdit?: (paymentHistory: GetPaymentHistoryDto) => void
}

const PaymentHistoryTab = ({ data, isLoading, onRefresh, registrationRecordId, onAdd, onEdit }: PaymentHistoryTabProps) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentHistoryId, setEditPaymentHistoryId] = useState<string | null>(null)

    const currency = (value?: number | null) => {
        if (value === undefined || value === null) return 'Chưa có dữ liệu'
        return new Intl.NumberFormat('vi-VN').format(value)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN')
        } catch {
            return '-'
        }
    }

    const handleEditPaymentHistory = (paymentHistory: GetPaymentHistoryDto) => {
        if (onEdit) {
            onEdit(paymentHistory)
        } else {
            setEditPaymentHistoryId(paymentHistory.id || null)
            setIsAddOpen(true)
        }
    }

    // Hooks
    const columns = useMemo<ColumnDef<GetPaymentHistoryDto, any>[]>(
        () => [
            columnHelper.accessor('id', {
                id: 'stt',
                header: () => (<Typography>STT</Typography>),
                cell: ({ row, table }) => (
                    <Typography>{table.getRowModel().rows.indexOf(row) + 1}</Typography>
                ),
                size: 40,
                minSize: 40
            }),
            columnHelper.accessor('paymentDate', {
                header: 'NGÀY NỘP',
                cell: ({ row }) => (
                    <Typography color='text.primary' className='w-full'>
                        {formatDate(row.original?.paymentDate)}
                    </Typography>
                ),
                size: 100,
                minSize: 100
            }),
            columnHelper.accessor('feeTypeName', {
                header: 'LOẠI LỆ PHÍ',
                cell: ({ row }) => (
                    <Typography color='text.primary' className='w-full' sx={{ textAlign: "left" }}>
                        {row.original?.feeTypeName || 'Không xác định'}
                    </Typography>
                ),
                size: 200,
                minSize: 150
            }),
            columnHelper.accessor('amount', {
                header: 'SỐ TIỀN',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'right' }}>
                        <Typography className='w-full'>
                            {currency(row.original?.amount)}
                        </Typography>
                    </div>
                ),
                size: 70,
                minSize: 60
            }),
            columnHelper.accessor('note', {
                header: 'GHI CHÚ',
                cell: ({ row }) => (
                    <Typography color='text.secondary' sx={{ textAlign: "right" }}>
                        {row.original?.note || '-'}
                    </Typography>
                ),
                size: 100,
                minSize: 100
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <IconButton onClick={() => handleEditPaymentHistory(row.original)}>
                            <i className="ri-edit-box-line text-textSecondary" />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
                            <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                    </div>
                ),
                enableSorting: false,
                size: 100,
                minSize: 100
            })
        ],
        [handleEditPaymentHistory]
    )

    const handleAddNew = () => {
        if (onAdd) {
            onAdd()
        } else {
            setEditPaymentHistoryId(null)
            setIsAddOpen(true)
        }
    }

    const handleCloseDialog = () => {
        setIsAddOpen(false)
        setEditPaymentHistoryId(null)
    }

    const handleSuccess = () => {
        handleCloseDialog()
        onRefresh()
    }

    const handleOpenDeleteDialog = (id: string | undefined) => {
        if (id) {
            setItemIdToDelete(id)
            setOpenDeleteDialog(true)
        }
    }

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false)
        setItemIdToDelete(null)
    }

    const handleDeleteConfirmed = async () => {
        if (!itemIdToDelete) return

        try {
            const response = await registrationRecordsAPI.DeletePaymentHistory(itemIdToDelete)
            if (response.data.success) {
                toast.success('Xóa lịch sử thanh toán thành công')
                onRefresh()
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi xóa')
            }
        } catch (error) {
            console.error('Error deleting payment history:', error)
            toast.error('Có lỗi xảy ra khi xóa')
        } finally {
            handleCloseDeleteDialog()
        }
    }

    const table = useReactTable({
        data: data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            columnFilters,
            globalFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        columnResizeMode: 'onChange'
    })

    const renderTableRows = () => {
        if (isLoading) {
            return <SkeletonTableRowsLoader rowsNum={10} columnsNum={6} />
        }

        if (table.getFilteredRowModel().rows.length === 0) {
            return (
                <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center py-8'>
                        Không có dữ liệu
                    </td>
                </tr>
            )
        }

        return (
            <>
                {table.getRowModel().rows.map((row, index) => {
                    return (
                        <tr key={`${row.id}-${index}`} className="hover:bg-gray-50">
                            {row.getVisibleCells().map((cell, cellIndex) => {
                                return <td key={`${cell.id}-${cellIndex}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            })}
                        </tr>
                    )
                })}
            </>
        )
    }

    return (
        <Box className='flex-1 h-full flex flex-col justify-between'>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                    }}
                    onClick={handleAddNew}
                >
                    THÊM MỚI
                </Button>
            </Box>
            <div className='flex-1 flex flex-col justify-between'>
                <div className='overflow-x-auto'>
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
                                                    <>
                                                        <div
                                                            className={classnames({
                                                                'flex items-center': header.column.getIsSorted(),
                                                                'cursor-pointer select-none': header.column.getCanSort()
                                                            })}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {{
                                                                asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                                                                desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                                                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                                                        </div>
                                                    </>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </table>
                </div>

            </div>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa lịch sử thanh toán này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleDeleteConfirmed} autoFocus color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Payment History Dialog */}
            {!onAdd && !onEdit && (
                <AddPaymentHistoryDialog
                    open={isAddOpen}
                    onClose={handleCloseDialog}
                    onSuccess={handleSuccess}
                    registrationRecordId={registrationRecordId as string}
                    mode={editPaymentHistoryId ? DialogMode.EDIT : DialogMode.ADD}
                    editPaymentHistoryId={editPaymentHistoryId}
                />
            )}
        </Box>
    )
}

export default PaymentHistoryTab
