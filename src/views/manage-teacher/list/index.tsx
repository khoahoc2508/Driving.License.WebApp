'use client'

import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    TextField
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import { toast } from 'react-toastify'

import type { AssigneeListType, GetAssigneesQueryParams, AssigneeDto, AssigneeType } from '@/types/assigneeTypes'
import assigneeAPI from '@/libs/api/assigneeAPI'
import DebouncedInput from '@/components/common/DebouncedInput'
import Table from './Table'
import AddTeacherDialog, { DialogMode } from './AddTeacherDialog'
import CONFIG from '@/configs/config'

const ManageTeacher = () => {

    const [dataTable, setDataTable] = useState<AssigneeListType>([])
    const [search, setSearch] = useState('')
    const [statusValue, setStatusValue] = useState<{ label: string; value: boolean } | null>(null)
    const [appliedStatusValue, setAppliedStatusValue] = useState<{ label: string; value: boolean } | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
    const [params, setParams] = useState<GetAssigneesQueryParams>()

    // Modal states
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [editData, setEditData] = useState<AssigneeDto | null>(null)
    const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.ADD)

    useEffect(() => {
        setParams({
            assigneeType: CONFIG.AssigneeTypes.Teacher as AssigneeType,
            search: '',
            pageNumber: 1,
            pageSize: 10
        })
    }, [])

    useEffect(() => {
        if (params) {
            getAssignees(params)
        }
    }, [params, reloadDataTable])

    useEffect(() => {
        if (pageNumber && pageSize)
            setParams((prev: any) => {
                return {
                    ...prev,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    search,
                    active: appliedStatusValue?.value,
                }
            })
    }, [pageSize, pageNumber, search, appliedStatusValue])

    const onChangeSearch = (value: string | number) => {
        setSearch(String(value))
        setPageNumber(1)
    }

    const handleStatusSelect = (_event: any, newValue: { label: string; value: boolean } | null) => {
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

    const handleOpenAddDialog = () => {
        setDialogMode(DialogMode.ADD)
        setEditData(null)
        setOpenAddDialog(true)
    }

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false)
        setEditData(null)
        setDialogMode(DialogMode.ADD)
    }

    const handleEditTeacher = (teacher: AssigneeDto) => {
        setDialogMode(DialogMode.EDIT)
        setEditData(teacher)
        setOpenAddDialog(true)
    }

    const handleAddSuccess = () => {
        setReloadDataTable(prev => !prev)
    }

    const getAssignees = async (params: GetAssigneesQueryParams): Promise<void> => {
        try {
            setLoading(true)
            const res = await assigneeAPI.GetAssignees(params)

            if (res?.data?.data) {
                const fetchedData = res?.data?.data || []

                setDataTable(fetchedData)
                setTotalItems(res?.data?.totalCount || 0)
            }
        } catch (error: any) {
            toast.error(error?.message || 'Có lỗi xảy ra khi tải dữ liệu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader title='Lọc giáo viên' />
            <CardContent>
                <Grid container spacing={5} alignItems={'flex-end'}>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <Autocomplete
                            value={statusValue}
                            options={CONFIG.statusOptions}
                            onChange={handleStatusSelect}
                            id='teacher-status-autocomplete'
                            getOptionLabel={option => option?.label || ''}
                            isOptionEqualToValue={(opt, val) => opt.value === val.value}
                            renderInput={params => <TextField {...params} label='Trạng thái' />}
                            noOptionsText='Không có dữ liệu'
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
                <Button variant='contained' color='primary' className='w-full sm:w-auto' onClick={handleOpenAddDialog}>
                    THÊM MỚI
                </Button>
            </div>
            <Table
                data={dataTable}
                setData={setDataTable}
                pageNumber={pageNumber}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={(page) => setPageNumber(page)}
                onPageSizeChange={(size) => setPageSize(size)}
                setReloadDataTable={setReloadDataTable}
                isLoading={isLoading}
                onEditTeacher={handleEditTeacher}
            />

            <AddTeacherDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onSuccess={handleAddSuccess}
                editData={editData}
                mode={dialogMode}
            />
        </Card>
    )
}

export default ManageTeacher
