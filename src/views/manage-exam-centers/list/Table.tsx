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
import { IconButton, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'

import examCentersAPI from '@/libs/api/examCentersAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import type { GetExamCentersDto, ExamCenterListType } from '@/types/examCenterTypes'
import CustomPagination from '@/components/common/CustomPagination'

// Column Definitions
const columnHelper = createColumnHelper<GetExamCentersDto>()

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
    onEditExamCenter
}: {
    data?: ExamCenterListType,
    setData: (data: ExamCenterListType) => void,
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (pageSize: number) => void,
    setReloadDataTable: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    onEditExamCenter?: (examCenter: GetExamCentersDto) => void
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
    const columns = useMemo<ColumnDef<GetExamCentersDto, any>[]>(
        () => [
            columnHelper.accessor('id', {
                id: 'stt',
                header: 'STT',
                cell: ({ row, table }) => (
                    <Typography>
                        {table.getRowModel().rows.indexOf(row) + 1}
                    </Typography>
                ),
                size: 50,
                minSize: 50
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
                ),
                size: 200,
                minSize: 150
            }),
            columnHelper.accessor('active', {
                header: 'TRẠNG THÁI',
                cell: ({ row }) => {
                    return (getStatusChip(row.original?.active))
                },
                size: 150,
                minSize: 120
            }),
            columnHelper.accessor('description', {
                header: 'MÔ TẢ',
                cell: ({ row }) => (
                    <div style={{ textAlign: 'left' }}>
                        <Typography>{row.original?.description || ''}</Typography>
                    </div>
                ),
                size: 250,
                minSize: 200
            }),
            columnHelper.accessor('id', {
                id: 'actions',
                header: 'THAO TÁC',
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <IconButton onClick={() => onEditExamCenter?.(row.original)}>
                            <i className="ri-edit-box-line text-textSecondary" />
                        </IconButton>

                        <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
                            <i className='ri-delete-bin-7-line text-textSecondary' />
                        </IconButton>
                    </div>
                ),
                enableSorting: false,
                size: 120,
                minSize: 100
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
            const response = await examCentersAPI.DeleteExamCenter(itemIdToDelete);

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
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        columnResizeMode: 'onChange'
    })

    return (
        <>
            <div className='flex flex-col justify-between flex-1'>
                <div className='overflow-x-auto'>
                    <table className={`${styles.table} ${styles.fixed} ${styles.borderX}`}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="h-9">
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <th
                                                key={header.id}
                                                style={{
                                                    width: header.getSize(),
                                                    minWidth: header.column.columnDef.minSize,
                                                    maxWidth: header.column.columnDef.maxSize
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
                                                    </>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <SkeletonTableRowsLoader
                                    rowsNum={10}
                                    columnsNum={5}
                                    columnSizes={table.getAllColumns().map(col => ({
                                        width: col.getSize(),
                                        minWidth: col.columnDef.minSize,
                                        maxWidth: col.columnDef.maxSize
                                    }))}
                                />
                            ) : table.getFilteredRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, index) => {
                                    return (
                                        <tr key={`${row.id}-${index}`}>
                                            {row.getVisibleCells().map((cell, cellIndex) => {
                                                return (
                                                    <td
                                                        key={`${cell.id}-${cellIndex}`}
                                                        style={{
                                                            width: cell.column.getSize(),
                                                            minWidth: cell.column.columnDef.minSize,
                                                            maxWidth: cell.column.columnDef.maxSize
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <CustomPagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                    pageSizeOptions={[7, 10, 25, 50]}
                    showPageSizeSelector={true}
                />
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
                        Bạn có chắc chắn muốn xóa trường thi này không?
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
