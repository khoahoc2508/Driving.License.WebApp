'use client'

import { useMemo, useState } from 'react'

import { Box, Button, IconButton, Typography } from '@mui/material'
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
import { formatCurrency, formatDate } from '@/utils/helpers'
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'
import DebouncedInput from '@/components/common/DebouncedInput'

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
    search: string,
    onSearch: (value: string | number) => void
}

const PaymentHistoryTab = ({ data, isLoading, onRefresh, registrationRecordId, onAdd, onEdit, search, onSearch }: PaymentHistoryTabProps) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [editPaymentHistoryId, setEditPaymentHistoryId] = useState<string | null>(null)

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
                header: 'STT',
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
                            {formatCurrency(row.original?.amount)}
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

        setIsDeleting(true);
        try {
            const response = await registrationRecordsAPI.DeletePaymentHistory(itemIdToDelete)

            if (response.data.success) {
                toast.success('Xóa lịch sử thanh toán thành công')
                onRefresh()
                handleCloseDeleteDialog()
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi xóa')
            }
        } catch (error) {
            console.error('Error deleting payment history:', error)
            toast.error('Có lỗi xảy ra khi xóa')
        } finally {
            setIsDeleting(false);
        }
    }

    const onChangeSearch = (value: string | number) => {
        onSearch(value)
    }

    const table = useReactTable({
        data: data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            columnFilters
        },
        onColumnFiltersChange: setColumnFilters,
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                <DebouncedInput
                    value={search}
                    onDebounceChange={onChangeSearch}
                    className='w-full'
                    placeholder='Loại lệ phí, ghi chú...'
                    size='small'
                    sx={{
                        maxWidth: '260px'
                    }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        whiteSpace: 'nowrap'
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
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirmed}
                title="Bạn chắc chắn xóa lịch sử thanh toán này?"
                itemName={data.find(item => item.id === itemIdToDelete)?.feeTypeName}
                itemType="lịch sử thanh toán"
                isLoading={isDeleting}
            />

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
