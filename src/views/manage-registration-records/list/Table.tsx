'use client'

// React Imports
import { useMemo, useState, useEffect, CSSProperties } from 'react'

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
import type { ColumnDef, ColumnFiltersState, FilterFn, Column, VisibilityState } from '@tanstack/react-table'
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
import type { GetRegistrationRecordsDto, GetRegistrationRecordsListType, RegistrationRecordStatus } from '@/types/registrationRecords'
import { getInitials } from '@/utils/getInitials'
import CONFIG from '@/configs/config'

// Column Definitions
const columnHelper = createColumnHelper<GetRegistrationRecordsDto>()

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
    interface ColumnMeta<TData extends unknown, TValue> {
        sticky?: 'left' | 'right'
    }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank
    })
    return itemRank.passed
}

// These are the important styles to make sticky column pinning work!
const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
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

const Table = ({
    data = [],
    setData,
    pageNumber,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    setReloadDataTable,
    isLoading,
    columnVisibility,
    onColumnVisibilityChange
}: {
    data?: GetRegistrationRecordsListType,
    setData: (data: GetRegistrationRecordsListType) => void,
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (pageSize: number) => void,
    setReloadDataTable: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    columnVisibility: VisibilityState,
    onColumnVisibilityChange: (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => void
}) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
    const [columnPinning, setColumnPinning] = useState({})

    const getStatusChip = (status: RegistrationRecordStatus | undefined) => {
        let label = ''
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default'

        switch (status) {
            case CONFIG.RegistrationRecordStatus.Pending: // Pending
                label = 'Chờ xử lý'
                color = 'info'
                break
            case CONFIG.RegistrationRecordStatus.Processing: // Processing
                label = 'Đang xử lý'
                color = 'warning'
                break
            case CONFIG.RegistrationRecordStatus.Completed: // Completed
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

    const formatCurrency = (amount: number | undefined | null) => {
        if (amount === undefined || amount === null) return null
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
                size: 80,
            }),
            columnHelper.accessor('licenseType.code', {
                id: 'hang',
                header: 'HẠNG',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>
                            {row.original?.licenseType?.name || ''}
                        </Typography>
                    </div>
                ),
                size: 100,
            }),
            columnHelper.accessor('fullname', {
                id: 'hoSo',
                header: 'HỒ SƠ',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <Avatar
                            src={row.original?.avatarUrl}
                            sx={{
                                width: 40,
                                height: 40
                            }}
                        >
                        </Avatar>
                        <div className='flex flex-col justify-center items-start'>
                            <Typography color='text.primary' className='font-medium'>
                                {row.original?.fullname}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {row.original?.phone}
                            </Typography>
                        </div>
                    </div>
                ),
                size: 200,
            }),
            // Grouped columns for payment
            columnHelper.group({
                id: 'thanhToan',
                header: 'THANH TOÁN',
                columns: [
                    columnHelper.accessor('payment.totalAmount', {
                        id: 'tong',
                        header: 'TỔNG',
                        cell: ({ row }) => (
                            <div style={{ textAlign: 'right' }}>
                                <Typography variant='body2'>
                                    {formatCurrency(row.original?.payment?.totalAmount)}
                                </Typography>
                            </div>
                        ),
                        size: 100,
                    }),
                    columnHelper.accessor('payment.paidAmount', {
                        id: 'daNop',
                        header: 'ĐÃ NỘP',
                        cell: ({ row }) => (
                            <div style={{ textAlign: 'right' }}>
                                <Typography variant='body2'>
                                    {formatCurrency(row.original?.payment?.paidAmount)}
                                </Typography>
                            </div>
                        ),
                        size: 100,
                    }),
                    columnHelper.accessor('payment.remainingAmount', {
                        id: 'conThieu',
                        header: 'CÒN THIẾU',
                        cell: ({ row }) => (
                            <div style={{ textAlign: 'right' }}>
                                <Typography
                                    variant='body2'
                                    sx={{ color: 'error.main' }}
                                >
                                    {formatCurrency(row.original?.payment?.remainingAmount)}
                                </Typography>
                            </div>
                        ),
                        size: 100,
                    })
                ],
                size: 300,
            }),
            columnHelper.accessor('status', {
                id: 'trangThai',
                header: 'TRẠNG THÁI',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        {getStatusChip(row.original?.status as RegistrationRecordStatus)}
                    </div>
                ),
                size: 120,
            }),
            columnHelper.accessor('staffAssigneeName', {
                id: 'nguoiPhuTrach',
                header: 'NGƯỜI PHỤ TRÁCH',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>{row.original?.staffAssigneeName || ''}</Typography>
                    </div>
                ),
                size: 200,
            }),
            columnHelper.accessor('collaboratorName', {
                id: 'ctv',
                header: 'CTV',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'center' }}>
                        <Typography>{row.original?.collaboratorName || ''}</Typography>
                    </div>
                ),
                size: 200,
            }),
            columnHelper.accessor('id', {
                id: 'thaoTác',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2" style={{ width: '100%' }}>
                        <IconButton>
                            <i className="ri-edit-box-line text-textSecondary" />
                        </IconButton>
                        <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
                            <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                    </div>
                ),
                enableSorting: false,
                size: 120,
            })
        ],
        [data, setData]
    )

    const getTotalColumns = () => {
        let total = 0
        columns.forEach(column => {
            if ('columns' in column && column.columns) {
                total += column.columns.length
            } else {
                total += 1
            }
        })
        return total
    }

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
        state: {
            columnFilters,
            globalFilter,
            columnVisibility,
            columnPinning
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: onColumnVisibilityChange,
        onColumnPinningChange: setColumnPinning,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        columnResizeMode: 'onChange',
        enableColumnPinning: true,
        enableColumnResizing: true
    })

    // Pin columns when component mounts
    // useEffect(() => {
    //     if (table.getAllColumns().length > 0) {
    //         const sttColumn = table.getColumn('stt')
    //         if (sttColumn) {
    //             sttColumn.pin('left')
    //         }


    //         // Pin HẠNG column to left
    //         const hangColumn = table.getColumn('hang')
    //         if (hangColumn) {
    //             hangColumn.pin('left')
    //         }


    //         // // Pin HỒ SƠ column to left
    //         // const hoSoColumn = table.getColumn('hoSo')
    //         // if (hoSoColumn) {
    //         //     hoSoColumn.pin('left')
    //         // }

    //         // Pin THAO TÁC column to right
    //         const thaoTacColumn = table.getColumn('thaoTác')
    //         if (thaoTacColumn) {
    //             thaoTacColumn.pin('right')
    //         }
    //     }
    // }, [table])



    return (
        <>
            <Card>
                <div className='overflow-x-auto'>
                    <table
                        className={styles.table}
                        style={{
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            width: table.getTotalSize()
                        }}
                    >
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="h-9">
                                    {headerGroup.headers.map(header => {
                                        const isGrouped = header.column.columns && header.column.columns.length > 0
                                        const colSpan = isGrouped ? header.column.columns.length : 1
                                        const isPinned = header.column.getIsPinned()

                                        return (
                                            <th
                                                key={header.id}
                                                colSpan={colSpan}
                                                style={{
                                                    ...getCommonPinningStyles(header.column),
                                                    backgroundColor: header.column.getIsPinned() ? 'var(--mui-palette-background-paper)' : 'transparent'
                                                }}
                                            >
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
                                                        {/* Pin/Unpin buttons */}
                                                        {!header.isPlaceholder && header.column.getCanPin() && (
                                                            <div className="flex gap-1 justify-center mt-2">
                                                                {header.column.getIsPinned() !== 'left' ? (
                                                                    <button
                                                                        className="border rounded px-2 text-xs"
                                                                        onClick={() => {
                                                                            header.column.pin('left')
                                                                        }}
                                                                    >
                                                                        {'<='}
                                                                    </button>
                                                                ) : null}
                                                                {header.column.getIsPinned() ? (
                                                                    <button
                                                                        className="border rounded px-2 text-xs"
                                                                        onClick={() => {
                                                                            header.column.pin(false)
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                ) : null}
                                                                {header.column.getIsPinned() !== 'right' ? (
                                                                    <button
                                                                        className="border rounded px-2 text-xs"
                                                                        onClick={() => {
                                                                            header.column.pin('right')
                                                                        }}
                                                                    >
                                                                        {'=>'}
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                        {/* Resizer */}
                                                        <div
                                                            {...{
                                                                onDoubleClick: () => header.column.resetSize(),
                                                                onMouseDown: header.getResizeHandler(),
                                                                onTouchStart: header.getResizeHandler(),
                                                                className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                                                                    }`,
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row, index) => {
                                if (isLoading) {
                                    return <SkeletonTableRowsLoader key={`skeleton-${index}`} rowsNum={1} columnsNum={getTotalColumns()} />
                                }

                                if (table.getFilteredRowModel().rows.length === 0) {
                                    return (
                                        <tr key={`no-data-${index}`}>
                                            <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )
                                }

                                return (
                                    <tr key={`${row.id}-${index}`}>
                                        {row.getVisibleCells().map((cell, cellIndex) => {
                                            const isPinned = cell.column.getIsPinned()
                                            return (
                                                <td
                                                    key={`${cell.id}-${cellIndex}`}
                                                    style={{
                                                        ...getCommonPinningStyles(cell.column),
                                                        backgroundColor: cell.column.getIsPinned() ? 'var(--mui-palette-background-paper)' : 'transparent'
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
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

            {/* Delete Confirmation Dialog */}
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
