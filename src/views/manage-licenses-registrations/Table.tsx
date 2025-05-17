'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
// MUI Imports
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'

// Next Imports
import Link from 'next/link'

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


// Icon Imports
import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import styles from '@core/styles/table.module.css'
import { LicenseRegistrationStatus, LicenseRegistrationType, LicenseRegistrationTypeVm, LicenseType } from "@/types/LicensesRegistrations"
import { Card, Typography } from '@mui/material'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import OptionMenu from '@/@core/components/option-menu'
import CONFIG from '@/configs/config'

// Data Imports

// Column Definitions
const columnHelper = createColumnHelper<LicenseRegistrationTypeVm>()

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

const getAvatar = (params: { avatar?: string | null; customer?: string | null }) => {
  const { avatar, customer } = params
  debugger
  if (avatar) {
    return <CustomAvatar src={avatar} size={30} className='shadow-md' />
  } else {
    return (
      <CustomAvatar size={30} skin='light' color='primary' className='shadow-md'>
        {getInitials(customer as string)}
      </CustomAvatar>
    )
  }
}

const getLicenseTypeString = (licenseType: LicenseType | undefined) => {
  if (licenseType === undefined) return 'N/A';
  const key = (Object.keys(CONFIG.LicenseType) as (keyof typeof CONFIG.LicenseType)[]).find(
    (k) => CONFIG.LicenseType[k] === licenseType
  );
  return key || 'N/A';
};

const getStatusTextAndColor = (status: Boolean | undefined) => {
  let text = 'N/A';
  let color: 'success' | 'error' | 'warning' = 'warning';

  if (status) {
    text = 'Đã duyệt';
    color = 'success';
  } else {
    text = 'Chưa duyệt';
    color = 'error';
  }

  return { text, color };
};

const Table = ({
  data = [],
  setData,
  pageNumber,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange
}: {
  data?: LicenseRegistrationType,
  setData: (data: LicenseRegistrationType) => void,
  pageNumber: number,
  pageSize: number,
  totalItems: number,
  onPageChange: (page: number) => void,
  onPageSizeChange: (pageSize: number) => void
}) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo<ColumnDef<LicenseRegistrationTypeVm, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'STT',
        cell: ({ row, table }) => (
          <Typography>
            {table.getRowModel().rows.indexOf(row) + 1}
          </Typography>
        )
      }),
      columnHelper.accessor('person.fullName', {
        header: 'HỌ TÊN',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {getAvatar({ avatar: row.original?.person?.avatarUrl ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${row.original?.person?.avatarUrl}` : null, customer: row.original?.person?.fullName })}
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original?.person?.fullName}
              </Typography>
              <Typography variant='body2'>{row.original?.person?.email}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('person.phoneNumber', {
        header: 'SỐ ĐIỆN THOẠI',
        cell: ({ row }) => (
          <Typography>{row.original?.person?.phoneNumber}</Typography>
        )
      }),
      columnHelper.accessor('licenseType', {
        header: 'BẰNG',
        cell: ({ row }) => {
          return <Typography>{getLicenseTypeString(row.original?.licenseType)}</Typography>;
        }
      }),
      columnHelper.accessor('hasCompletedHealthCheck', {
        header: 'SỨC KHỎE',
        cell: ({ row }) => (
          <Chip
            label={row.original?.hasCompletedHealthCheck ? 'Đã khám' : 'Chưa khám'}
            color={row.original?.hasCompletedHealthCheck ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('amount', {
        header: 'TỔNG THANH TOÁN',
        cell: ({ row }) => (
          <Typography>{row.original?.amount?.toLocaleString('vi-VN') || '0'}</Typography>
        )
      }),
      columnHelper.accessor('isPaid', {
        header: 'THANH TOÁN',
        cell: ({ row }) => (
          <Chip
            label={row.original?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            color={row.original?.isPaid ? 'success' : 'error'}
            variant='tonal'
            size='small'
          />
        )
      }),
      columnHelper.accessor('hasApproved', {
        header: 'Trạng thái',
        cell: ({ row }) => {
          const { text, color } = getStatusTextAndColor(row.original?.hasApproved);
          return (
            <Chip
              label={text}
              color={color}
              variant='tonal'
              size='small'
            />
          );
        }
      }),
      columnHelper.accessor('id', {
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link href={`manage-licenses-registration/edit/${row.original.id}`} passHref legacyBehavior>
              <button
                title="Sửa"
                className="cursor-pointer hover:text-blue-800 bg-transparent"
                type="button"
              >
                <i className="ri-edit-line text-lg" />
              </button>
            </Link>
            <button
              title="Xóa"
              className="cursor-pointer hover:text-red-800 bg-transparent"
              type="button"
            >
              <i className="ri-delete-bin-line text-lg" />
            </button>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data, setData]
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
        rowsPerPageOptions={[7, 10, 25]}
        component='div'
        className='border-bs'
        count={totalItems}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={(_, page) => {
          onPageChange(page + 1)
        }}
        onRowsPerPageChange={e => onPageSizeChange(Number(e.target.value))}
      /></Card>
  )
}

export default Table
