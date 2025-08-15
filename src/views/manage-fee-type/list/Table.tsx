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

// Third-party Imports
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, ColumnFiltersState, FilterFn, Table } from '@tanstack/react-table'
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

import feeTypeAPI from '@/libs/api/feeTypeAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import type { FeeTypeDto, FeeTypeListType } from '@/types/feeTypes'

// Column Definitions
const columnHelper = createColumnHelper<FeeTypeDto>()

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
    isLoading,
    onEditFeeType
}: {
    data?: FeeTypeListType,
    setData: (data: FeeTypeListType) => void,
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (pageSize: number) => void,
    setReloadDataTable: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    onEditFeeType?: (feeType: FeeTypeDto) => void
}) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);

    const getStatusChip = (status: boolean | undefined) => {
        const label = status === true ? 'Đang hoạt động' : 'Dừng hoạt động'
        const color = status === true ? 'success' : 'error'

        return (
            <Chip label={label} color={color} variant='tonal' size='small' />
        )
    }

    // Hooks
    const columns = useMemo<ColumnDef<FeeTypeDto, any>[]>(
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
            columnHelper.accessor('name', {
                header: 'TÊN',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                            <Typography color='text.primary' className='font-medium'>
                                {row.original?.name}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('active', {
                header: 'TRẠNG THÁI',
                cell: ({ row }) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            {getStatusChip(row.original?.active)}
                        </div>
                    )
                }
            }),
            columnHelper.accessor('description', {
                header: 'MÔ TẢ',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'left' }}>
                        <Typography>{row.original?.description || ''}</Typography>
                    </div>
                )
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <IconButton onClick={() => onEditFeeType?.(row.original)}>
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
            const response = await feeTypeAPI.DeleteFeeTypeById(itemIdToDelete);

            if (response.data.success) {
                toast.success('Xóa thành công');
                setReloadDataTable(prev => !prev); // Trigger data refresh in parent
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
            return <SkeletonTableRowsLoader rowsNum={10} columnsNum={5} />
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
                        Bạn có chắc chắn muốn xóa lệ phí này không?
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
