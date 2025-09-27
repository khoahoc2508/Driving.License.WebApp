'use client'

// React Imports
import { useMemo, useState } from 'react'

// MUI Imports
import Chip from '@mui/material/Chip'

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

import carsAPI from '@/libs/api/carsAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import type { GetCarsDto, CarListType } from '@/types/carTypes'
import CustomPagination from '@/components/common/CustomPagination'
import { useScrollbarHover } from '@/hooks/useCustomScrollbar'
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'

// Column Definitions
const columnHelper = createColumnHelper<GetCarsDto>()

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
    onEditCar
}: {
    data?: CarListType,
    setData: (data: CarListType) => void,
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (page: number) => void,
    onPageSizeChange: (pageSize: number) => void,
    setReloadDataTable: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    onEditCar?: (car: GetCarsDto) => void
}) => {
    // States
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Custom scrollbar hook
    const scrollbarRef = useScrollbarHover()

    const getStatusChip = (status: boolean | undefined) => {
        const label = status === true ? 'Đang hoạt động' : 'Dừng hoạt động'
        const color = status === true ? 'success' : 'error'

        return (
            <Chip label={label} color={color} variant='tonal' size='small' />
        )
    }

    // Hooks
    const columns = useMemo<ColumnDef<GetCarsDto, any>[]>(
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
                size: 120,
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
                        <IconButton disabled={!row.original.createdBy} onClick={() => onEditCar?.(row.original)}>
                            <i className="ri-edit-box-line text-textSecondary" />
                        </IconButton>

                        <IconButton disabled={!row.original.createdBy} onClick={() => handleOpenDeleteDialog(row.original.id)}>
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

        setIsDeleting(true);

        try {
            const response = await carsAPI.DeleteCar(itemIdToDelete);

            if (response.data.success) {
                toast.success('Xóa thành công');
                setReloadDataTable(prev => !prev); // Trigger data refresh in parent
                handleCloseDeleteDialog();
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi xóa');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Có lỗi xảy ra khi xóa');
        } finally {
            setIsDeleting(false);
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
            <div className='flex flex-col flex-1 h-full'>
                <div ref={scrollbarRef} className='flex-1 overflow-x-auto custom-scrollbar' style={{ overflowY: 'auto', width: '100%' }}>
                    <table className={`${styles.table} ${styles.fixed} ${styles.borderX}`} style={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                    }}>
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
                                                    maxWidth: header.column.columnDef.maxSize,
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 3,
                                                    backgroundColor: 'var(--mui-palette-customColors-tableHeaderBg)'
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
                <div className='flex-shrink-0'>
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
            </div>
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleDeleteConfirmed}
                title="Bạn chắc chắn xóa xe này?"
                itemName={data.find(item => item.id === itemIdToDelete)?.name}
                itemType="xe"
                isLoading={isDeleting}
            />
        </>
    )
}

export default Table
