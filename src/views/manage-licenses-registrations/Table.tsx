'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
// MUI Imports
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import classnames from 'classnames'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { Column, Table, ColumnFiltersState, FilterFn, ColumnDef } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports

// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'
import { LicenseRegistrationType } from "@/types/LicensesRegistrations"
import { Card } from '@mui/material'

// Data Imports

// Column Definitions
const columnHelper = createColumnHelper<LicenseRegistrationType>()

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}


const Table = ({ data = [] }: { data?: LicenseRegistrationType }) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo<ColumnDef<LicenseRegistrationType, any>[]>(
    () => [
      columnHelper.accessor(row => row.person?.fullName || '', {
        id: 'fullName',
        cell: info => info.getValue(),
        header: 'Họ tên'
      }),
      columnHelper.accessor(row => row.person?.phoneNumber || '', {
        id: 'phoneNumber',
        cell: info => info.getValue(),
        header: 'Số điện thoại'
      }),
      columnHelper.accessor(row => row.licenseType, {
        id: 'licenseType',
        cell: info => {
          const val = info.getValue();
          return val === 0 ? 'A1' : val === 1 ? 'A2' : val === 2 ? 'B1' : val === 3 ? 'B2' : '';
        },
        header: 'Bằng'
      }),
      columnHelper.accessor(row => row.hasCompletedHealthCheck, {
        id: 'health',
        cell: info => info.getValue() ? 'Đã khám' : 'Chưa khám',
        header: 'Sức khỏe'
      }),
      columnHelper.accessor(row => row.amount, {
        id: 'amount',
        cell: info => info.getValue() ? info.getValue().toLocaleString('vi-VN') : '',
        header: 'Tổng thanh toán'
      }),
      columnHelper.accessor(row => row.isPaid, {
        id: 'isPaid',
        cell: info => info.getValue() ? 'Đã thanh toán' : 'Chưa thanh toán',
        header: 'Thanh toán'
      }),
      columnHelper.accessor(row => row.status, {
        id: 'status',
        cell: info => {
          const val = info.getValue();
          return val === 0 ? 'Chưa duyệt' : val === 1 ? 'Đã duyệt' : val === 2 ? 'Đã thi' : val === 3 ? 'Đã cấp bằng' : '';
        },
        header: 'Trạng thái'
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              title="Xem"
              className="cursor-pointer hover:text-yellow-800 bg-transparent"
              type="button"
            >
              <i className="ri-eye-line text-lg" />
            </button>
            <button
              title="Sửa"
              className="cursor-pointer hover:text-blue-800 bg-transparent"
              type="button"
            >
              <i className="ri-edit-line text-lg" />
            </button>
            <button
              title="Xóa"
              className="cursor-pointer hover:text-red-800 bg-transparent"
              type="button"
            >
              <i className="ri-delete-bin-line text-lg" />
            </button>
          </div>
        )
      })
    ],
    []
  )

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

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters[0]?.id])

  return (
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
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[7, 10, 25, { label: 'All', value: data.length }]}
        component='div'
        className='border-bs'
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      /></Card>
  )
}

export default Table
