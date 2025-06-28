'use client'

// React Imports
import { useMemo, useState } from 'react'


// MUI Imports

import TablePagination from '@mui/material/TablePagination'

// Next Imports

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
import { Card, Switch, Typography } from '@mui/material'


import ChevronRight from '@menu/svg/ChevronRight'

// Style Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import type { GetLicensesRegistrationsParams, LicenseRegistrationType, LicenseRegistrationTypeVm, LicenseTypeDto } from "@/types/LicensesRegistrations"
import { getInitials } from '@/utils/getInitials'
import styles from '@core/styles/table.module.css'


import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'

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

// const getLicenseTypeString = (licenseType: LicenseTypeDto | undefined) => {
//   if (!licenseType) return 'N/A';

//   return licenseType.name;
// };

type Props = {
  data?: LicenseRegistrationType,
  totalItems: number,
  isLoading: boolean,
  examScheduleId?: string,
  onResultChange?: (licenseRegistrationId: string, passed: boolean) => void,
  updatedIds?: Set<string>,
  resultChanges?: Map<string, boolean>
}

const LicenseRegistrationTable = ({
  data = [],
  isLoading,
  onResultChange,
  updatedIds = new Set(),
  resultChanges = new Map()
}: Props) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Hooks
  const columns = useMemo<ColumnDef<LicenseRegistrationTypeVm, any>[]>(
    () => [
      // columnHelper.accessor('id', {
      //   id: 'stt',
      //   header: 'STT',
      //   cell: ({ row, table }) => (
      //     <Typography>
      //       {table.getRowModel().rows.indexOf(row) + 1}
      //     </Typography>
      //   )
      // }),
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
      // columnHelper.accessor('licenseType', {
      //   header: 'BẰNG',
      //   cell: ({ row }) => {
      //     return <Typography>{getLicenseTypeString(row.original?.licenseType)}</Typography>;
      //   }
      // }),

      // columnHelper.accessor('hasCompletedHealthCheck', {
      //   header: 'SỨC KHỎE',
      //   cell: ({ row }) => (
      //     <Chip
      //       label={row.original?.hasCompletedHealthCheck ? 'Đã khám' : 'Chưa khám'}
      //       color={row.original?.hasCompletedHealthCheck ? 'success' : 'error'}
      //       variant='tonal'
      //       size='small'
      //     />
      //   )
      // }),
      // columnHelper.accessor('amount', {
      //   header: 'TỔNG THANH TOÁN',
      //   cell: ({ row }) => (
      //     <Typography>{row.original?.amount?.toLocaleString('vi-VN') || '0'}</Typography>
      //   )
      // }),
      // columnHelper.accessor('isPaid', {
      //   header: 'THANH TOÁN',
      //   cell: ({ row }) => (
      //     <Chip
      //       label={row.original?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
      //       color={row.original?.isPaid ? 'success' : 'error'}
      //       variant='tonal'
      //       size='small'
      //     />
      //   )
      // }),
      columnHelper.accessor('passed', {
        header: 'Thi đỗ',
        cell: ({ row }) => {
          const licenseRegistrationId = row.original.id
          // Use the changed value if it exists, otherwise use original value
          const currentValue = licenseRegistrationId && resultChanges.has(licenseRegistrationId)
            ? resultChanges.get(licenseRegistrationId)
            : row.original.passed ?? false

          const isUpdated = licenseRegistrationId ? updatedIds.has(licenseRegistrationId) : false

          return (
            <Switch
              checked={currentValue}
              onChange={(event) => {
                if (onResultChange && licenseRegistrationId) {
                  onResultChange(licenseRegistrationId, event.target.checked)
                }
              }}
              color={'primary'}
            />
          )
        },
        enableSorting: true
      }),

      // columnHelper.accessor('id', {
      //   id: 'actions',
      //   header: 'Hành động',
      //   cell: ({ row }) => (
      //     <div className="flex items-center">
      //       <IconButton>
      //         <a href={`manage-licenses-registration/edit/${row.original.id}`} className='flex items-center'>
      //           <i className="ri-eye-line text-textSecondary" />
      //         </a>
      //       </IconButton>

      //       <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
      //         <i className='ri-delete-bin-7-line text-textSecondary' />
      //       </IconButton>
      //     </div>
      //   ),
      //   enableSorting: false
      // })
    ],
    [data, resultChanges, updatedIds, onResultChange]
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


  const renderTableRows = () => {

    if (isLoading) {
      return <SkeletonTableRowsLoader rowsNum={4} columnsNum={3} />
    }

    if (table.getFilteredRowModel().rows.length === 0) {
      return (
        <tr>
          <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
            No data available
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
      </Card>

    </>
  )
}



export default LicenseRegistrationTable
