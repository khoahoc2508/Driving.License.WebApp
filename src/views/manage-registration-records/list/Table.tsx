'use client'

// React Imports
import type { CSSProperties } from 'react';
import { useMemo, useState, useEffect } from 'react'

// MUI Imports
import { useRouter } from 'next/navigation'

import Chip from '@mui/material/Chip'
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
import { tableHeaderRowSpan } from 'tanstack-table-header-rowspan'

// Icon Imports
import { IconButton, Typography, Tooltip, useTheme, useMediaQuery } from '@mui/material'

import { toast } from 'react-toastify'

import CustomPagination from '@/components/common/CustomPagination'
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'

// Style Imports
import styles from '@core/styles/table.module.css'

import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import SkeletonTableRowsLoader from '@/components/common/SkeletonTableRowsLoader'
import type { GetRegistrationRecordsDto, GetRegistrationRecordsListType, RegistrationRecordStatus } from '@/types/registrationRecords'
import CONFIG from '@/configs/config'
import { useScrollbarHover } from '@/hooks/useCustomScrollbar'
import { formatCurrency, formatDate } from '@/utils/helpers'

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
  const [itemToDelete, setItemToDelete] = useState<GetRegistrationRecordsDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [columnPinning, setColumnPinning] = useState({})

  // Custom scrollbar hook
  const scrollbarRef = useScrollbarHover()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))


  const router = useRouter()

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


  // Hooks
  const columns = useMemo<ColumnDef<GetRegistrationRecordsDto, any>[]>(
    () => [
      columnHelper.accessor('id', {
        id: CONFIG.RegistrationRecordsTableColumns.STT,
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
        id: CONFIG.RegistrationRecordsTableColumns.HANG,
        header: 'HẠNG',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography>
              {row.original?.licenseType?.name || ''}
            </Typography>
          </div>
        ),
        size: 150,
      }),
      columnHelper.accessor('fullname', {
        id: CONFIG.RegistrationRecordsTableColumns.HO_SO,
        header: 'HỒ SƠ',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar
              src={`${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${row.original?.avatarUrl}`}
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
        size: 220,
      }),
      columnHelper.accessor('birthday', {
        id: CONFIG.RegistrationRecordsTableColumns.NGAY_SINH,
        header: 'NGÀY SINH',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography>
              {formatDate(row.original?.birthday)}
            </Typography>
          </div>
        ),
        size: 120,
      }),
      columnHelper.accessor('receivedDate', {
        id: CONFIG.RegistrationRecordsTableColumns.NGAY_NHAN_HS,
        header: 'NGÀY NHẬN HS',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography>
              {formatDate(row.original?.receivedDate)}
            </Typography>
          </div>
        ),
        size: 150,
      }),
      columnHelper.accessor('healthCheckDate', {
        id: CONFIG.RegistrationRecordsTableColumns.NGAY_KHAM_SK,
        header: 'NGÀY KHÁM SK',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography>
              {formatDate(row.original?.healthCheckDate)}
            </Typography>
          </div>
        ),
        size: 150,
      }),

      // Grouped columns for payment
      columnHelper.group({
        id: CONFIG.RegistrationRecordsTableColumns.THANH_TOAN,
        header: 'THANH TOÁN',
        columns: [
          columnHelper.accessor('payment.totalAmount', {
            id: CONFIG.RegistrationRecordsTableColumns.TONG,
            header: 'TỔNG',
            cell: ({ row }) => (
              <div style={{ textAlign: 'right' }}>
                <Typography variant='body2'>
                  {formatCurrency(row.original?.payment?.totalAmount)}
                </Typography>
              </div>
            ),
            size: 120,
          }),
          columnHelper.accessor('payment.paidAmount', {
            id: CONFIG.RegistrationRecordsTableColumns.DA_NOP,
            header: 'ĐÃ NỘP',
            cell: ({ row }) => (
              <div style={{ textAlign: 'right' }}>
                <Typography variant='body2'>
                  {formatCurrency(row.original?.payment?.paidAmount)}
                </Typography>
              </div>
            ),
            size: 120,
          }),
          columnHelper.accessor('payment.remainingAmount', {
            id: CONFIG.RegistrationRecordsTableColumns.CON_THIEU,
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
            size: 120,
          })
        ],
        size: 360,
      }),
      columnHelper.accessor('status', {
        id: CONFIG.RegistrationRecordsTableColumns.TRANG_THAI,
        header: 'TRẠNG THÁI',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            {getStatusChip(row.original?.status as RegistrationRecordStatus)}
          </div>
        ),
        size: 150,
        minSize: 150,
        maxSize: 150,
      }),
      columnHelper.accessor('staffAssigneeName', {
        id: CONFIG.RegistrationRecordsTableColumns.NGUOI_PHU_TRACH,
        header: 'NV phụ trách',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography sx={{ maxWidth: 230, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original?.staffAssigneeName || ''}</Typography>
          </div>
        ),
        size: 220,
      }),
      columnHelper.accessor('collaboratorName', {
        id: CONFIG.RegistrationRecordsTableColumns.CTV,
        header: 'CTV',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Typography sx={{ maxWidth: 230, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.original?.collaboratorName || ''}</Typography>
          </div>
        ),
        size: 240,
      }),
      columnHelper.accessor('note', {
        id: CONFIG.RegistrationRecordsTableColumns.GHI_CHU,
        header: 'GHI CHÚ',
        cell: ({ row }) => (
          <div style={{ textAlign: 'center' }}>
            <Tooltip
              title={row.original?.note || ''}
              placement='top'
              arrow
              disableHoverListener={!row.original?.note}
            >
              <Typography sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {row.original?.note || ''}
              </Typography>
            </Tooltip>
          </div>
        ),
        size: 250,
      }),
      columnHelper.accessor('id', {
        id: CONFIG.RegistrationRecordsTableColumns.THAO_TAC,
        header: 'THAO TÁC',
        cell: ({ row }) => (
          <div className="flex items-center justify-center" style={{ width: '100%' }}>
            <IconButton onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/detail/${row.original.id}`)}>
              <i className='ri-eye-line text-textSecondary' />
            </IconButton>
            <IconButton onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/edit/${row.original.id}?from=list`)}>
              <a href={`${CONFIG.Routers.ManageRegistrationRecords}/edit/${row.original.id}?from=list`} className='flex items-center cursor-pointer'>
                <i className="ri-edit-box-line text-textSecondary" />
              </a>
            </IconButton>
            <IconButton onClick={() => handleOpenDeleteDialog(row.original.id)}>
              <i className='ri-delete-bin-7-line text-textSecondary' />
            </IconButton>

          </div>
        ),
        enableSorting: false,
        size: 150,
      })
    ],
    [data]
  )

  const handleOpenDeleteDialog = (id: string | undefined) => {
    if (id) {
      const item = data.find(item => item.id === id);

      setItemIdToDelete(id);
      setItemToDelete(item || null);
      setOpenDeleteDialog(true);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setItemIdToDelete(null);
    setItemToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemIdToDelete) return;

    setIsDeleting(true);
    try {
      const response = await registrationRecordsAPI.DeleteRegistrationRecord(itemIdToDelete);

      if (response.data.success) {
        toast.success('Xóa thành công');
        setReloadDataTable(prev => !prev);
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

  useEffect(() => {
    if (table.getAllColumns().length > 0) {
      const thaoTacColumn = table.getColumn(CONFIG.RegistrationRecordsTableColumns.THAO_TAC)

      if (thaoTacColumn) {
        if (isMobile) {
          // Unpin column on mobile
          thaoTacColumn.pin(false)
        } else {
          // Pin THAO TÁC column to right on desktop
          thaoTacColumn.pin('right')
        }
      }
    }
  }, [table, isMobile])

  return (
    <>
      <div className='flex flex-col flex-1 h-full'>
        <div ref={scrollbarRef} className='flex-1 overflow-x-auto custom-scrollbar' style={{ overflowY: 'auto', width: '100%' }}>
          <table
            className={`${styles.table} ${styles.fixed} ${styles.borderX} ${styles.borderTop}`}
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
                    const rowSpan = tableHeaderRowSpan(header)

                    if (!rowSpan) {
                      return null;
                    }

                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        rowSpan={rowSpan}
                        style={{
                          ...getCommonPinningStyles(header.column),
                          position: 'sticky',
                          top: (header.depth - 1 || 0) * 56,
                          zIndex: header.column.getIsPinned() ? 4 : 3,
                          backgroundColor: 'var(--mui-palette-customColors-tableHeaderBg)'
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                (() => {
                  const visibleColumns = table.getVisibleFlatColumns()

                  const filteredColumns = visibleColumns.filter(col => {
                    return !('columns' in col.columnDef) || !col.columnDef.columns || col.columnDef.columns.length === 0
                  })

                  return (
                    <SkeletonTableRowsLoader
                      rowsNum={Math.min(pageSize, 5)}
                      columns={filteredColumns}
                      getCommonPinningStyles={getCommonPinningStyles}
                    />
                  )
                })()
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className='text-center py-8'
                    style={{
                      color: 'var(--mui-palette-text-secondary)',
                      fontSize: '14px'
                    }}
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr key={`${row.id}-${index}`} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell, cellIndex) => {

                      return (
                        <td
                          key={`${cell.id}-${cellIndex}`}
                          style={{
                            ...getCommonPinningStyles(cell.column),
                            backgroundColor: cell.column.getIsPinned() ? 'var(--mui-palette-background-paper)' : 'transparent',
                            cursor: cell.column.id === CONFIG.RegistrationRecordsTableColumns.THAO_TAC ? 'default' : 'pointer',
                          }}
                          onClick={(e) => {
                            // Prevent row click when clicking on actions column
                            if (cell.column.id === CONFIG.RegistrationRecordsTableColumns.THAO_TAC) {
                              e.stopPropagation();

                              return;
                            }

                            router.push(`${CONFIG.Routers.ManageRegistrationRecords}/detail/${row.original.id}`);
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    })}
                  </tr>
                ))
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirmed}
        itemName={itemToDelete?.fullname}
        itemType="hồ sơ"
        isLoading={isDeleting}
      />
    </>
  )
}

export default Table
