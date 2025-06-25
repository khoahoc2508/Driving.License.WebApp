'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import { LinearProgress } from '@mui/material'

import { toast } from 'react-toastify'


// Component Imports

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import type { ExamScheduleType, GetExamSchedulesWithPaginationQueryParams, PaginatedListOfExamScheduleType } from '@/types/examScheduleTypes'
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'
import TableFilters from '@/views/exam-schedules/list/TableFilters'
import AddExasmScheduleDrawer from '@/views/exam-schedules/list/AddExasmScheduleDrawer'
import type { ExamAddressType, PaginatedListOfExamAddressType } from '@/types/examAddressTypes'
import ExamAddressAPI from '@/libs/api/examAddressAPI'
import OptionMenu from '@/@core/components/option-menu'
import ViewLicenseRegistrationsDrawer from '@/views/exam-schedules/list/assign-license-registrations/ViewLicenseRegistrationsDrawer'
import LicenseTypeAPI from '@/libs/api/licenseTypeApi'
import type { LicenseTypeDto } from '@/types/LicensesRegistrations'
import ResultLicenseRegistrationsDrawer from '@/views/exam-schedules/list/update-result-license-registrations/ResultLicenseRegistrationsDrawer'
import AddExamScheduleDialog from '@/views/exam-schedules/list/AddExamScheduleDialog'


declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type ProductWithActionsType = ExamScheduleType & {
  actions?: string
}

enum LimitType {
  Unlimited,
  Limited
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

// Function to get progress color based on percentage
// Tính toán màu sắc dựa trên tỷ lệ đỗ:
// - >= 80%: success (xanh lá) - tỷ lệ đỗ cao
// - 60-79%: primary (xanh dương) - tỷ lệ đỗ khá
// - 30-59%: warning (cam) - tỷ lệ đỗ trung bình
// - < 30%: error (đỏ) - tỷ lệ đỗ thấp
const getProgressColor = (percentage: number): 'error' | 'warning' | 'primary' | 'success' => {
  if (percentage >= 80) return 'success'  // >= 80%: green
  if (percentage >= 60) return 'primary'  // 60-79%: blue
  if (percentage >= 30) return 'warning'  // 30-59%: orange

  return 'error'                          // < 30%: red
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Vars


// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

const ProductListTable = () => {
  // States
  const [params, setParams] = useState<GetExamSchedulesWithPaginationQueryParams>({ pageNumber: 1, pageSize: 10, search: '' })
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<ExamScheduleType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const [openAddDrawer, setOpenAddDrawer] = useState(false)
  const [openAssignDrawer, setOpenAssignDrawer] = useState(false)
  const [openResultDrawer, setOpenResultDrawer] = useState(false)

  const [reloadFlag, setReloadFlag] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null)
  const [selectedExamScheduleId, setSelectedExamScheduleId] = useState<string>()

  // States of api
  const [examAddresses, setExamAddresses] = useState<ExamAddressType[]>([])
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([])

  // States for data
  // const [examSchedules, setExamSchedules] = useState<ExamScheduleType[]>([])
  const [totalCount, setTotalCount] = useState(0)

  // const [pageSize, setPageSize] = useState(1)s
  // const [loading, setLoading] = useState(false)

  // Function to reload data
  const reloadData = () => {
    setReloadFlag(prev => !prev)
  }

  // Hooks

  const columns = useMemo<ColumnDef<ProductWithActionsType, any>[]>(
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
      columnHelper.accessor('examAddress.fullAddress', {
        header: 'Địa điểm',
        cell: ({ row }) => <Typography>{row.original.examAddress?.fullAddress}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('dateTime', {
        header: 'Thời gian',
        cell: ({ row }) => {
          const dateStr = row.original.dateTime;

          if (!dateStr) return <Typography>-</Typography>;

          const date = new Date(dateStr);

          const formatted = date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return <Typography>{formatted}</Typography>;
        },
        enableSorting: false
      }),

      // columnHelper.accessor('registrationLimit', {
      //   header: 'Suất thi',
      //   cell: ({ row }) => <Typography>{(row.original.limitType === LimitType.Unlimited) ? 'Không giới hạn' : row.original.registrationLimit}</Typography>,
      //   enableSorting: false
      // }),
      columnHelper.accessor('registeredStudents', {
        header: 'Suất thi',
        cell: ({ row }) => {
          const registrationLimit = row.original?.registrationLimit;
          const registeredStudents = row.original?.registeredStudents || 0;

          // Helper function for common badge style
          const getBadgeStyle = (color: string) => ({
            width: '80px',
            height: '24px',
            borderRadius: '16px',
            paddingTop: '3px',
            paddingRight: '4px',
            paddingBottom: '3px',
            paddingLeft: '4px',
            border: `1px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })

          const getTextStyle = (color: string) => ({
            color: color,
            fontSize: '14px',
            fontWeight: 400
          })

          if (registrationLimit === null) {
            // Unlimited case
            const color = '#9155FD';
            return (
              <div style={getBadgeStyle(color)}>
                <Typography style={getTextStyle(color)}>
                  Unlimited
                </Typography>
              </div>
            );
          } else {
            // Limited case - calculate percentage
            const percentage = (registrationLimit && registrationLimit > 0) ? (registeredStudents / registrationLimit) * 100 : 0;
            const color = percentage < 50 ? '#56CA00' : '#FF4C51';

            return (
              <div style={getBadgeStyle(color)}>
                <Typography style={getTextStyle(color)}>
                  {`${registeredStudents}/${registrationLimit}`}
                </Typography>
              </div>
            );
          }
        },
        enableSorting: false
      }),
      // columnHelper.accessor('passedStudents', {
      //   header: 'Tỷ lệ đỗ',
      //   cell: ({ row }) => {
      //     const examDate = row.original?.dateTime ? new Date(row.original.dateTime) : new Date();
      //     const currentDate = new Date();
      //     const isExamPassed = examDate < currentDate;

      //     const passedStudents = row.original?.passedStudents;
      //     const registeredStudents = row.original?.registeredStudents;

      //     const hasValidResults = passedStudents != null &&
      //       passedStudents !== undefined &&
      //       registeredStudents != null &&
      //       registeredStudents !== undefined;

      //     const calculatePassRate = () => {
      //       if (!hasValidResults) return 0;

      //       return Math.floor((passedStudents / registeredStudents) * 100);
      //     };

      //     const passRate = calculatePassRate();
      //     const progressColor = getProgressColor(passRate);

      //     return (
      //       <>
      //         {isExamPassed ? (
      //           hasValidResults ? (
      //             <>
      //               <div className='flex flex-col gap-2 min-w-[120px]'>
      //                 <div className='flex items-center justify-between'>
      //                   <Typography
      //                     className='font-semibold text-sm'
      //                     color='text.primary'
      //                   >
      //                     {`${passRate}%`}
      //                   </Typography>
      //                   <Typography
      //                     variant='caption'
      //                     className='text-textSecondary font-medium'
      //                   >
      //                     {`${passedStudents}/${registeredStudents}`}
      //                   </Typography>
      //                 </div>
      //                 <LinearProgress
      //                   color={progressColor}
      //                   value={passRate}
      //                   variant='determinate'
      //                   className='is-full bs-2'
      //                 />

      //               </div>
      //             </>
      //           ) : (
      //             <div className='flex items-center gap-4 min-is-48'><Typography
      //               className='font-medium'
      //               color='text.primary'
      //             >
      //               Chưa có kết quả thi
      //             </Typography></div>

      //           )
      //         ) : (
      //           <div className='flex items-center gap-4 min-is-48'>

      //             <Typography
      //               className='font-medium'
      //               color='text.primary'
      //             >
      //               Chưa thi
      //             </Typography></div>

      //         )}
      //       </>
      //     );
      //   },
      //   enableSorting: false
      // }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => handleOpenEditDrawer(row.original)}>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => handleOpenDeleteDialog(row.original.id)}>
              <i className='ri-delete-bin-7-line text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                { text: 'Xếp thi', icon: 'ri-id-card-line', menuItemProps: { className: 'gap-2', onClick: () => handleOpenAssignDrawer(row.original) } },
                {
                  text: 'Kết quả',
                  icon: 'ri-toggle-line',
                  menuItemProps: { className: 'gap-2', onClick: () => handleOpenResultDrawer(row.original) }
                },
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: data as ExamScheduleType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // Fetch data function
  const fetchExamSchedules = async () => {
    try {
      // setLoading(true)

      const response = await ExamScheduleAPI.getExamSchedules(params)

      const paginatedData = response.data as PaginatedListOfExamScheduleType

      setData(paginatedData.data || [])
      setTotalCount(paginatedData.totalCount || 0)
    } catch (error) {
      console.error('Error fetching exam schedules:', error)
    } finally {
      // setLoading(false)
    }
  }

  const handleOpenDeleteDialog = (id: string | undefined) => {
    if (id) {
      setItemIdToDelete(id)
      setOpenDeleteDialog(true)
    }
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setItemIdToDelete(null)
  }

  const handleDeleteConfirmed = async () => {
    if (!itemIdToDelete) return

    try {
      const response = await ExamScheduleAPI.deleteExamSchedule(itemIdToDelete)

      if (response.data?.success) {
        toast.success('Xóa lịch thi thành công')
        reloadData() // Reload the table
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra khi xóa lịch thi')
      }
    } catch (error) {
      console.error('Error deleting exam schedule:', error)
      toast.error('Có lỗi xảy ra khi xóa lịch thi')
    } finally {
      handleCloseDeleteDialog()
    }
  }

  const handleOpenEditDrawer = (examSchedule: ExamScheduleType) => {
    setSelectedExamScheduleId(examSchedule.id)
    setOpenAddDrawer(true)
  }

  const handleOpenAddDrawer = () => {
    setOpenAddDrawer(true)
  }

  const handleOpenAssignDrawer = (examSchedule: ExamScheduleType) => {
    setSelectedExamScheduleId(examSchedule.id)
    setOpenAssignDrawer(true)
  }

  const handleOpenResultDrawer = (examSchedule: ExamScheduleType) => {
    setSelectedExamScheduleId(examSchedule.id)
    setOpenResultDrawer(true)
  }

  useEffect(() => {
    fetchExamSchedules()
  }, [JSON.stringify(params), reloadFlag])


  // Fetch license types on component mount
  useEffect(() => {
    const fetchLicenseTypes = async () => {
      try {
        const response = await LicenseTypeAPI.getAllLicenseTypes({});

        if (response.data.success) {
          setLicenseTypes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching license types:', error);
        toast.error('Lỗi khi tải danh sách bằng lái');
      }
    };

    const fetchExamAddresses = async () => {
      try {

        const response = await ExamAddressAPI.getExamAddresses({ pageNumber: 1, pageSize: 10 })

        const paginatedData = response.data as PaginatedListOfExamAddressType

        if (paginatedData.data) {
          setExamAddresses(paginatedData.data || [])
        }

      } catch (error) {
        console.error('Error fetching exam addesses:', error)
        toast.error('Lỗi khi tải danh sách địa điểm thi');
      }
    }


    fetchLicenseTypes()
    fetchExamAddresses()
  }, []);

  return (
    <>
      <Card>
        <CardHeader title='Lọc lịch thi' className='pbe-4' />
        <TableFilters examAddresses={examAddresses} licenseTypes={licenseTypes} setParams={setParams} />
        <Divider />
        <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
            placeholder='Tìm kiếm'
            className='max-sm:is-full'
          />
          <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>

            <Button
              variant='contained'
              startIcon={<i className='ri-add-line' />}
              className='max-sm:is-full is-auto'
              onClick={handleOpenAddDrawer}
            >
              Thêm mới
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
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
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table?.getFilteredRowModel()?.rows?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 2, 1]}
          component='div'
          className='border-bs'
          count={totalCount}
          rowsPerPage={params.pageSize || 10}
          page={(params.pageNumber || 1) - 1}
          onPageChange={(_, page) => {
            setParams((prev) => ({ ...prev, pageNumber: page + 1 }))
          }}
          onRowsPerPageChange={e => setParams((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}
        />
      </Card>
      {/* <AddExasmScheduleDrawer
        examAddresses={examAddresses}
        licenseTypes={licenseTypes}
        open={openAddDrawer}
        handleClose={() => {
          {
            setSelectedExamScheduleId(undefined)
            setOpenAddDrawer(false)
          }
        }
        }
        examScheduleId={selectedExamScheduleId}
        onSuccess={reloadData}
      /> */}
      <AddExamScheduleDialog
        examAddresses={examAddresses}
        licenseTypes={licenseTypes}
        open={openAddDrawer}
        handleClose={() => {
          {
            setSelectedExamScheduleId(undefined)
            setOpenAddDrawer(false)
          }
        }
        }
        examScheduleId={selectedExamScheduleId}
        onSuccess={reloadData}
      />
      <ViewLicenseRegistrationsDrawer
        open={openAssignDrawer}
        handleClose={() => {
          setSelectedExamScheduleId(undefined)
          setOpenAssignDrawer(false)
        }
        }
        examScheduleId={selectedExamScheduleId}
        onSuccess={reloadData}
      />

      <ResultLicenseRegistrationsDrawer
        open={openResultDrawer}
        handleClose={() => {
          setSelectedExamScheduleId(undefined)
          setOpenResultDrawer(false)
        }
        }
        examScheduleId={selectedExamScheduleId}
        onSuccess={reloadData}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa lịch thi này không?
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

export default ProductListTable
