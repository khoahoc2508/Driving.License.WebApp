'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

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
import type { ThemeColor } from '@core/types'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Util Imports
// import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { ExamScheduleType, GetExamSchedulesWithPaginationQueryParams, PaginatedListOfExamScheduleType } from '@/types/examScheduleTypes'
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'
import { LinearProgress } from '@mui/material'
import TableFilters from '@/views/exam-schedules/list/TableFilters'

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

type ProductCategoryType = {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

type productStatusType = {
  [key: string]: {
    title: string
    color: ThemeColor
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
const productCategoryObj: ProductCategoryType = {
  Accessories: { icon: 'ri-headphone-line', color: 'error' },
  'Home Decor': { icon: 'ri-home-6-line', color: 'info' },
  Electronics: { icon: 'ri-computer-line', color: 'primary' },
  Shoes: { icon: 'ri-footprint-line', color: 'success' },
  Office: { icon: 'ri-briefcase-line', color: 'warning' },
  Games: { icon: 'ri-gamepad-line', color: 'secondary' }
}

const productStatusObj: productStatusType = {
  Scheduled: { title: 'Scheduled', color: 'warning' },
  Published: { title: 'Publish', color: 'success' },
  Inactive: { title: 'Inactive', color: 'error' }
}

// Column Definitions
const columnHelper = createColumnHelper<ProductWithActionsType>()

const ProductListTable = () => {
  // States
  const [params, setParams] = useState<GetExamSchedulesWithPaginationQueryParams>({ pageNumber: 1, pageSize: 10, search: '' })
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<ExamScheduleType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // States for data
  const [examSchedules, setExamSchedules] = useState<ExamScheduleType[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [pageSize, setPageSize] = useState(1)
  const [loading, setLoading] = useState(false)


  // Hooks
  const { lang: locale } = useParams()

  const columns = useMemo<ColumnDef<ProductWithActionsType, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      columnHelper.accessor('name', {
        header: 'Tên',
        cell: ({ row }) => (
          <Typography>{row.original.name}</Typography>
        ),
        enableSorting: false
      }),

      columnHelper.accessor('dateTime', {
        header: 'Thời gian',
        cell: ({ row }) => {
          const d = new Date(row.original.dateTime || new Date());
          const f = (n: number) => n.toString().padStart(2, '0');
          const formatted = `${f(d.getUTCDate())}/${f(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${f(d.getUTCHours())}:${f(d.getUTCMinutes())}:${f(d.getUTCSeconds())}`;
          return <Typography>{formatted}</Typography>;
        },
        enableSorting: false
      }),
      columnHelper.accessor('examAddress.fullAddress', {
        header: 'Địa điểm',
        cell: ({ row }) => <Typography>{row.original.examAddress?.fullAddress}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('registrationLimit', {
        header: 'Suất thi',
        cell: ({ row }) => <Typography>{row.original.registrationLimit}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('registeredStudents', {
        header: 'Đã xếp',
        cell: ({ row }) => <Typography>{`${row.original?.registeredStudents}/${row.original?.registrationLimit}`}</Typography>,
        enableSorting: false
      }),
      columnHelper.accessor('passedStudents', {
        header: 'Tỷ lệ đỗ',
        cell: ({ row }) => {
          const examDate = new Date(row.original?.dateTime);
          const currentDate = new Date();
          const isExamPassed = examDate < currentDate;

          const passedStudents = row.original?.passedStudents;
          const registeredStudents = row.original?.registeredStudents;

          const hasValidResults = passedStudents != null &&
            passedStudents !== undefined &&
            registeredStudents != null &&
            registeredStudents !== undefined;

          const calculatePassRate = () => {
            if (!hasValidResults) return 0;
            return Math.floor((passedStudents / registeredStudents) * 100);
          };

          return (
            <div className='flex items-center gap-4 min-is-48'>
              {isExamPassed ? (
                hasValidResults ? (
                  <>
                    <Typography
                      className='font-medium'
                      color='text.primary'
                    >
                      {`${calculatePassRate()}%`}
                    </Typography>
                    <LinearProgress
                      color='primary'
                      value={calculatePassRate()}
                      variant='determinate'
                      className='is-full bs-2'
                    />
                    <Typography variant='body2'>
                      {`${passedStudents}/${registeredStudents}`}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    className='font-medium'
                    color='text.primary'
                  >
                    Chưa có kết quả thi
                  </Typography>
                )
              ) : (
                <Typography
                  className='font-medium'
                  color='text.primary'
                >
                  Chưa thi
                </Typography>
              )}
            </div>
          );
        },
        enableSorting: false
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small'>
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                { text: 'Download', icon: 'ri-download-line', menuItemProps: { className: 'gap-2' } },
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    className: 'gap-2',
                    onClick: () => setData(data?.filter(product => product.id !== row.original.id))
                  }
                },
                { text: 'Duplicate', icon: 'ri-stack-line', menuItemProps: { className: 'gap-2' } }
              ]}
            /> */}
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
      setLoading(true)

      const response = await ExamScheduleAPI.getExamSchedules(params)

      const paginatedData = response.data as PaginatedListOfExamScheduleType

      setData(paginatedData.data || [])
      setTotalCount(paginatedData.totalCount || 0)
    } catch (error) {
      console.error('Error fetching exam schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExamSchedules()
  }, [params])

  return (
    <>
      <Card>
        <CardHeader title='Filters' className='pbe-4' />
        <TableFilters data={data} />
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
              component={Link}
              href={`/exam-schedules/create`}
              startIcon={<i className='ri-add-line' />}
              className='max-sm:is-full is-auto'
            >
              Thêm
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
    </>
  )
}

export default ProductListTable
