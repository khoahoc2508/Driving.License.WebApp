'use client'

import { useMemo, useState } from 'react'

import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Typography } from '@mui/material'
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
import CONFIG from '@/configs/config'
import { formatCurrency } from '@/utils/helpers'

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
    onAdd?: () => void
    onAddPaymentHistory?: (payment: GetPaymentDto) => void
    onViewHistory?: (payment: GetPaymentDto) => void
}

const FeeTab = ({ data, isLoading, onEditPayment, onRefresh, onAdd, onAddPaymentHistory, onViewHistory }: FeeTabProps) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null)

    // Add handled by parent dialog


    const getStatusChip = (status: number | undefined) => {
        const statusOption = CONFIG.paymentStatusOptions.find(option => option.value === status)

        if (!statusOption) {
            return <Chip label="Không xác định" color="default" size='small' variant='filled' />
        }

        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default'

        switch (status) {
            case 0: // Chưa thanh toán
                color = 'error'
                break
            case 1: // Thanh toán một phần
                color = 'warning'
                break
            case 2: // Đã thanh toán
                color = 'success'
                break
            case 3: // Chưa thêm thanh toán
                color = 'error'
                break
            default:
                color = 'default'
        }

        return <Chip label={statusOption.label} color={color} size='small' variant='tonal' />
    }

    // Hooks
    const RowActions = ({ payment }: { payment: GetPaymentDto }) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const open = Boolean(anchorEl)

        const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
        }

        const handleCloseMenu = () => setAnchorEl(null)

        const canPay = (payment?.remainingAmount ?? 0) > 0

        return (
            <div className="flex items-center justify-center gap-1">
                <button
                    disabled={!canPay}
                    onClick={() => canPay && onAddPaymentHistory && onAddPaymentHistory(payment)}
                    className={` ${!canPay ? 'cursor-not-allowed' : 'text-primary'} bg-transparent cursor-pointer`}
                    style={{ fontWeight: 600, fontSize: '14px' }}
                >
                    Nộp tiền
                </button>
                <IconButton onClick={handleOpenMenu}>
                    <i className="ri-more-2-fill text-textSecondary" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} keepMounted>
                    <MenuItem onClick={() => { handleCloseMenu(); onViewHistory && onViewHistory(payment) }}>
                        <i className="ri-history-line mr-2" /> Xem lịch sử
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); onEditPayment(payment) }}>
                        <i className="ri-edit-box-line text-textSecondary mr-2" /> Sửa
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseMenu(); handleOpenDeleteDialog(payment.id) }}>
                        <i className='ri-delete-bin-7-line mr-2' /> Xóa
                    </MenuItem>
                </Menu>
            </div>
        )
    }

    const columns = useMemo<ColumnDef<GetPaymentDto, any>[]>(
        () => [
            columnHelper.accessor('id', {
                id: 'stt',
                header: 'STT',
                cell: ({ row, table }) => (
                    <Typography>{table.getRowModel().rows.indexOf(row) + 1}</Typography>
                ),
                size: 50,
                minSize: 50
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
                )
            }),
            columnHelper.accessor('paidAmount', {
                header: 'ĐÃ THANH TOÁN',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'right' }}>
                        <Typography className='w-full'>
                            {formatCurrency(row.original?.paidAmount)}
                        </Typography>
                    </div>
                ),
            }),
            columnHelper.accessor('remainingAmount', {
                header: 'CÒN LẠI',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'right' }}>
                        <Typography className='w-full'>
                            {formatCurrency(row.original?.remainingAmount)}
                        </Typography>
                    </div>
                ),
            }),
            columnHelper.accessor('status', {
                header: 'TRẠNG THÁI',
                cell: ({ row }) => getStatusChip(row.original?.status),
                size: 150,
                minSize: 150
            }),
            columnHelper.accessor('note', {
                header: 'GHI CHÚ',
                cell: ({ row }) => (
                    <Typography color='text.secondary' sx={{ textAlign: "right" }}>
                        {row.original?.note || '-'}
                    </Typography>
                ),
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <RowActions payment={row.original} />
                ),
                enableSorting: false,
                size: 180,
                minSize: 150
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
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        columnResizeMode: 'onChange'
    })

    const renderTableRows = () => {
        if (isLoading) {
            return <SkeletonTableRowsLoader rowsNum={10} columnsNum={8} />
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
                    onClick={onAdd}
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

            {/* Add dialog moved to parent */}
        </Box>
    )
}

export default FeeTab
