'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TablePagination from '@mui/material/TablePagination'
import Avatar from '@mui/material/Avatar'

// Third-party Imports
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

// Icon Imports
import { Card, IconButton, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import type { GetRegistrationRecordsDto, GetRegistrationRecordsListType } from '@/types/registrationRecords'
import { getInitials } from '@/utils/getInitials'

// Column Definitions
const columnHelper = createColumnHelper<GetRegistrationRecordsDto>()

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

const Table = ({
    data = [],
    setData,
    pageNumber,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    setReloadDataTable,
    isLoading
}: {
    data?: GetRegistrationRecordsListType,
    setData: (data: GetRegistrationRecordsListType) => void,
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (pageSize: number) => void,
    setReloadDataTable: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean
}) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);

    const getStatusChip = (status: number | undefined) => {
        let label = ''
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default'

        switch (status) {
            case 0: // Pending
                label = 'Chờ xử lý'
                color = 'info'
                break
            case 1: // Processing
                label = 'Đang xử lý'
                color = 'warning'
                break
            case 2: // Completed
                label = 'Hoàn thành'
                color = 'success'
                break
            default:
                label = 'Không xác định'
                color = 'default'
        }

        return (
            <Chip label={label} color={color} variant='tonal' size='small' />
        )
    }

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined || amount === null) return '0'
        return new Intl.NumberFormat('vi-VN').format(amount)
    }

    // Hooks
    const columns = useMemo<ColumnDef<GetRegistrationRecordsDto, any>[]>(
        () => [
            columnHelper.accessor('id', {
                id: 'stt',
                header: 'STT',
                cell: ({ row, table }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>
                            {table.getRowModel().rows.indexOf(row) + 1}
                        </Typography>
                    </div>
                ),
            }),
            columnHelper.accessor('licenseType.code', {
                header: 'HẠNG',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>
                            {row.original?.licenseType?.code || ''}
                        </Typography>
                    </div>
                )
            }),
            columnHelper.accessor('fullname', {
                header: 'HỒ SƠ',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 40,
                                height: 40
                            }}
                        >
                            {getInitials(row.original?.fullname || '')}
                        </Avatar>
                        <div className='flex flex-col'>
                            <Typography color='text.primary' className='font-medium'>
                                {row.original?.fullname}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {row.original?.phone}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('payment.totalAmount', {
                header: 'THANH TOÁN',
                cell: ({ row }) => (
                    <div className='flex flex-col gap-1'>
                        <div className='flex justify-between'>
                            <Typography variant='body2' color='text.secondary'>TỔNG:</Typography>
                            <Typography variant='body2'>{formatCurrency(row.original?.payment?.totalAmount)}</Typography>
                        </div>
                        <div className='flex justify-between'>
                            <Typography variant='body2' color='text.secondary'>ĐÃ NỘP:</Typography>
                            <Typography variant='body2'>{formatCurrency(row.original?.payment?.paidAmount)}</Typography>
                        </div>
                        <div className='flex justify-between'>
                            <Typography variant='body2' color='text.secondary'>CÒN THIẾU:</Typography>
                            <Typography
                                variant='body2'
                                color={row.original?.payment?.remainingAmount && row.original.payment.remainingAmount > 0 ? 'error' : 'text.primary'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                {formatCurrency(row.original?.payment?.remainingAmount)}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('status', {
                header: 'TRẠNG THÁI',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        {getStatusChip(row.original?.status)}
                    </div>
                )
            }),
            columnHelper.accessor('staffAssigneeName', {
                header: 'NGƯỜI PHỤ TRÁCH',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>{row.original?.staffAssigneeName || ''}</Typography>
                    </div>
                )
            }),
            columnHelper.accessor('collaboratorName', {
                header: 'CTV',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>{row.original?.collaboratorName || ''}</Typography>
                    </div>
                )
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <IconButton>
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
        [data, setData]
    )

    const handleOpenDeleteDialog = (id: string | undefined) => {
        if (id) {
            setItemIdToDelete(id);
            setOpenDeleteDialog(true);
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setItemIdToDelete(null);
    };

    const handleDeleteConfirmed = async () => {
        if (!itemIdToDelete) return;

        try {
            const response = await registrationRecordsAPI.DeleteRegistrationRecord(itemIdToDelete);

            if (response.data.success) {
                toast.success('Xóa thành công');
                setReloadDataTable(prev => !prev);
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi xóa');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Có lỗi xảy ra khi xóa');
        } finally {
            handleCloseDeleteDialog();
        }
    };

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
            return <SkeletonTableRowsLoader rowsNum={10} columnsNum={8} />
        }

        if (table.getFilteredRowModel().rows.length === 0) {
            return (
                <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                        Không có dữ liệu
                    </td>
                </tr>
            )
        }

        return (<>
            {
                table.getRowModel().rows.map((row, index) => {
                    return (
                        <tr key={`${row.id}-${index}`}>
                            {row.getVisibleCells().map((cell, cellIndex) => {
                                return <td key={`${cell.id}-${cellIndex}`}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            })}
                        </tr>
                    )
                })
            }
        </>
        )
    }

    return (
        <>
            <Card>
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
                    count={totalItems}
                    labelRowsPerPage="Dòng trên trang:"
                    rowsPerPage={pageSize}
                    page={pageNumber - 1}
                    onPageChange={(_, page) => {
                        onPageChange(page + 1)
                    }}
                    onRowsPerPageChange={e => onPageSizeChange(Number(e.target.value))}
                />
            </Card>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa hồ sơ này không?
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

export default Table
