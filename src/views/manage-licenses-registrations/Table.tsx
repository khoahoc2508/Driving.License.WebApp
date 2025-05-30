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

// Next Imports

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
import CustomAvatar from '@/@core/components/mui/Avatar'
import CONFIG from '@/configs/config'
import type { LicenseRegistrationType, LicenseRegistrationTypeVm, LicenseType } from "@/types/LicensesRegistrations"
import { getInitials } from '@/utils/getInitials'
import styles from '@core/styles/table.module.css'


import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
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

const getLicenseTypeString = (licenseType: LicenseType | undefined) => {
  if (licenseType === undefined) return 'N/A';

  const key = (Object.keys(CONFIG.LicenseType) as (keyof typeof CONFIG.LicenseType)[]).find(
    (k) => CONFIG.LicenseType[k] === licenseType
  );


  return key || 'N/A';
};

const getStatusTextAndColor = (status: boolean | undefined) => {
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
  onPageSizeChange,
  setReloadDataTable,
  isLoading
}: {
  data?: LicenseRegistrationType,
  setData: (data: LicenseRegistrationType) => void,
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

  // Hooks
  const columns = useMemo<ColumnDef<LicenseRegistrationTypeVm, any>[]>(
    () => [
      columnHelper.accessor('id', {
        id: 'stt',
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
        id: 'actions',
        header: 'Hành động',
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton>
              <a href={`manage-licenses-registration/edit/${row.original.id}`}  >
                <i className="ri-edit-box-line text-textSecondary" />
              </a>
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

  // Handle delete action
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
      const response = await LicenseRegistrationAPI.deleteLicensesRegistrations(itemIdToDelete);

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
      return <SkeletonTableRowsLoader rowsNum={10} columnsNum={9} />
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
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa mục này không?
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
