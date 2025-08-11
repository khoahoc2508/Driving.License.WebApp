'use client'

import { useMemo, useState } from 'react'

import DebouncedInput from '@/components/common/DebouncedInput'
import Grid from '@mui/material/Grid2'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    IconButton,
    TablePagination,
    Typography
} from '@mui/material'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import styles from '@core/styles/table.module.css'

type TeacherStatus = 'active' | 'inactive'

interface TeacherVm {
    id: string
    fullName: string
    phoneNumber: string
    status: TeacherStatus
    note?: string
}

const mockTeachers: TeacherVm[] = [
    { id: '1', fullName: 'Thầy Tuân', phoneNumber: '0362225161', status: 'active', note: '' },
    { id: '2', fullName: 'Thầy Hải', phoneNumber: '0362225161', status: 'inactive', note: '' }
]

const ManageTeacher = () => {
    const [search, setSearch] = useState('')
    const [statusValue, setStatusValue] = useState<{ label: string; value: string } | null>(null)
    const [appliedStatusValue, setAppliedStatusValue] = useState<{ label: string; value: string } | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const onChangeSearch = (value: string | number) => {
        setSearch(String(value))
        setPageNumber(1)
    }

    const handleStatusSelect = (_event: any, newValue: { label: string; value: string } | null) => {
        setStatusValue(newValue)
    }

    const applyFilters = () => {
        setAppliedStatusValue(statusValue)
        setPageNumber(1)
    }

    const clearAllFilters = () => {
        setStatusValue(null)
        setAppliedStatusValue(null)
        setPageNumber(1)
    }


    const filteredData = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()
        return mockTeachers.filter(t => {
            const matchSearch =
                !normalizedSearch ||
                t.fullName.toLowerCase().includes(normalizedSearch) ||
                t.phoneNumber.includes(normalizedSearch)

            const matchStatus = !appliedStatusValue || t.status === appliedStatusValue.value

            return matchSearch && matchStatus
        })
    }, [search, appliedStatusValue])

    const pagedData = useMemo(() => {
        const start = (pageNumber - 1) * pageSize
        const end = start + pageSize
        return filteredData.slice(start, end)
    }, [filteredData, pageNumber, pageSize])

    const totalItems = filteredData.length

    const getStatusChip = (status: TeacherStatus) => {
        const label = status === 'active' ? 'Đang hoạt động' : 'Dừng hoạt động'
        const color = status === 'active' ? 'success' : 'error'
        return (
            <Chip label={label} color={color} variant='tonal' size='small' />
        )
    }

    const statusOptions = [
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Dừng hoạt động', value: 'inactive' }
    ]

    return (
        <Card>
            <CardHeader title='Lọc giáo viên' />
            <CardContent>
                <Grid container spacing={5} alignItems={'flex-end'}>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <Autocomplete
                            value={statusValue}
                            options={statusOptions}
                            onChange={handleStatusSelect}
                            id='teacher-status-autocomplete'
                            getOptionLabel={option => option?.label || ''}
                            isOptionEqualToValue={(opt, val) => opt.value === val.value}
                            renderInput={params => <TextField {...params} label='Trạng thái' />}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent>
                <Grid size={{ xs: 12, sm: 8, md: 9 }} className='flex items-center gap-3'>
                    <Button variant='contained' color='primary' className='min-w-[170px]' onClick={applyFilters}>LỌC</Button>
                    <Button variant='outlined' color='error' className='min-w-[170px]' onClick={clearAllFilters}>XÓA TẤT CẢ</Button>
                </Grid>
            </CardContent>
            <Divider />

            <div className='flex justify-between p-5 gap-4 flex-col sm:flex-row sm:items-center'>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <DebouncedInput
                        value={search}
                        className='w-full'
                        onDebounceChange={onChangeSearch}
                        placeholder='Họ tên, số điện thoại'
                    />
                </div>
                <Button variant='contained' color='primary' className='w-full sm:w-auto'>
                    Thêm mới
                </Button>
            </div>

            {/* Table */}
            <div className='overflow-x-auto'>
                <table className={styles.table}>
                    <thead>
                        <tr className='h-9'>
                            <th>STT</th>
                            <th>HỌ TÊN</th>
                            <th>SỐ ĐIỆN THOẠI</th>
                            <th>TRẠNG THÁI</th>
                            <th>GHI CHÚ</th>
                            <th>THAO TÁC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className='text-center'>Không có dữ liệu</td>
                            </tr>
                        ) : (
                            pagedData.map((row, index) => (
                                <tr key={row.id}>
                                    <td>
                                        <Typography>{(pageNumber - 1) * pageSize + index + 1}</Typography>
                                    </td>
                                    <td>
                                        <Typography color='text.primary' className='font-medium'>{row.fullName}</Typography>
                                    </td>
                                    <td>
                                        <Typography>{row.phoneNumber}</Typography>
                                    </td>
                                    <td>{getStatusChip(row.status)}</td>
                                    <td>
                                        <Typography>{row.note || ''}</Typography>
                                    </td>
                                    <td>
                                        <div className='flex items-center'>
                                            <IconButton>
                                                <i className='ri-edit-box-line text-textSecondary' />
                                            </IconButton>
                                            <IconButton>
                                                <i className='ri-delete-bin-7-line text-textSecondary' />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                rowsPerPageOptions={[10, 25]}
                component='div'
                className='border-bs'
                count={totalItems}
                rowsPerPage={pageSize}
                page={pageNumber - 1}
                labelRowsPerPage="Dòng trên trang:"
                onPageChange={(_, page) => setPageNumber(page + 1)}
                onRowsPerPageChange={e => {
                    setPageSize(Number(e.target.value))
                    setPageNumber(1)
                }}
            />
        </Card>
    )
}

export default ManageTeacher
