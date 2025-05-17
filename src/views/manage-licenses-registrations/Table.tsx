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

const getStatusTextAndColor = (status: LicenseRegistrationStatus | undefined) => {
  let text = 'N/A';
  let color: 'success' | 'error' | 'warning' = 'warning';

  if (status) {
    text = 'Đã duyệt';
    color = 'success';
  } else {
    text = 'Chưa duyệt';
    color = 'warning';
  }

  return { text, color };
};

const Table = ({ data = [], setData }: { data?: LicenseRegistrationType, setData: (data: LicenseRegistrationType) => void }) => {
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
            {getAvatar({ avatar: row.original?.person?.avatarUrl, customer: row.original?.person?.fullName })}
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
      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: ({ row }) => {
          const { text, color } = getStatusTextAndColor(row.original?.status);
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
          <div className='flex items-center'>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-[22px]'
              options={[
                {
                  text: 'View',
                  icon: 'ri-eye-line',
                  href: `/manage-licenses-registrations/${row.original?.id}`,
                  linkProps: { className: 'flex items-center is-full gap-2 plb-2 pli-4' }
                },
                {
                  text: 'Edit',
                  icon: 'ri-pencil-line',
                  href: `/manage-licenses-registrations/edit/${row.original?.id}`,
                  linkProps: { className: 'flex items-center is-full gap-2 plb-2 pli-4' }
                },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line text-[22px]',
                  menuItemProps: {
                    onClick: () => setData(data?.filter(item => item.id !== row.original?.id) || []),
                    className: 'flex items-center gap-2 text-error'
                  }
                }
              ]}
            />
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
