'use client'

import { useMemo, useState } from 'react'
import { Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TablePagination, Typography } from '@mui/material'
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
import type { GetPaymentDto } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'

// Column Definitions
const columnHelper = createColumnHelper<GetPaymentDto>()

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

type FeeTabProps = {
    data: GetPaymentDto[]
    isLoading: boolean
    onEditPayment: (payment: GetPaymentDto) => void
    onRefresh: () => void
}

const FeeTab = ({ data, isLoading, onEditPayment, onRefresh }: FeeTabProps) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const currency = (value?: number | null) => {
        if (value === undefined || value === null) return 'Chưa có dữ liệu'
        return new Intl.NumberFormat('vi-VN').format(value)
    }

    const getStatusChip = (status: number | undefined) => {
        let label = ''
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default'

        switch (status) {
            case 0: // Unpaid
                label = 'Chưa thanh toán'
                color = 'error'
                break
            case 1: // Paid
                label = 'Đã thanh toán'
                color = 'success'
                break
            case 2: // Partially paid
                label = 'Thanh toán 1 phần'
                color = 'warning'
                break
            case 3: // Overdue
                label = 'Quá hạn'
                color = 'error'
                break
            default:
                label = 'Không xác định'
                color = 'default'
        }

        return <Chip label={label} color={color} size='small' variant='filled' />
    }

    // Hooks
    const columns = useMemo<ColumnDef<GetPaymentDto, any>[]>(
        () => [
            columnHelper.accessor('id', {
                id: 'stt',
                header: 'STT',
                cell: ({ row, table }) => (
                    <Typography>
                        {table.getRowModel().rows.indexOf(row) + 1}
                    </Typography>
                ),
            }),
            columnHelper.accessor('feeTypeName', {
                header: 'LOẠI LỆ PHÍ',
                cell: ({ row }) => (
                    <Typography color='text.primary' className='font-medium'>
                        {row.original?.feeTypeName || 'Không xác định'}
                    </Typography>
                )
            }),
            columnHelper.accessor('amount', {
                header: 'SỐ TIỀN',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'right' }}>
                        <Typography className='font-semibold'>
                            {currency(row.original?.amount)}
                        </Typography>
                    </div>
                )
            }),
            columnHelper.accessor('note', {
                header: 'GHI CHÚ',
                cell: ({ row }) => (
                    <Typography color='text.secondary'>
                        {row.original?.note || '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('status', {
                header: 'TRẠNG THÁI',
                cell: ({ row }) => getStatusChip(row.original?.status)
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <IconButton onClick={() => onEditPayment(row.original)}>
                            <i className="ri-edit-box-line text-textSecondary" />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
                            <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                    </div>
                ),
                enableSorting: false
            })
        ],
        [onEditPayment]
    )

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
            const response = await registrationRecordsAPI.DeletePayment(itemIdToDelete)

            if (response.data.success) {
                toast.success('Xóa khoản phí thành công')
                onRefresh()
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi xóa')
            }
        } catch (error) {
            console.error('Error deleting payment:', error)
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
        getFacetedMinMaxValues: getFacetedMinMaxValues()
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
        <>
            <div className='overflow-x-auto'>
                <table className={styles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="h-9">
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id}>
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
            <TablePagination
                rowsPerPageOptions={[7, 10, 25]}
                component='div'
                className='border-bs'
                count={data.length}
                labelRowsPerPage="Dòng trên trang:"
                rowsPerPage={pageSize}
                page={pageNumber - 1}
                onPageChange={(_, page) => {
                    setPageNumber(page + 1)
                }}
                onRowsPerPageChange={e => setPageSize(Number(e.target.value))}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa khoản phí này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                    <Button onClick={handleDeleteConfirmed} autoFocus color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FeeTab
