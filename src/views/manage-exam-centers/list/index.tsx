'use client'

import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    useMediaQuery,
    useTheme
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import { toast } from 'react-toastify'

import type { ExamCenterListType, GetExamCentersQueryParams, GetExamCentersDto } from '@/types/examCenterTypes'
import examCentersAPI from '@/libs/api/examCentersAPI'
import DebouncedInput from '@/components/common/DebouncedInput'
import AddExamCenterDialog, { DialogMode } from './AddExamCenterDialog'
import Table from './Table'

const ManageExamCentersList = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const [dataTable, setDataTable] = useState<ExamCenterListType>([])
    const [search, setSearch] = useState('')
    const [statusValue, setStatusValue] = useState<{ label: string; value: boolean } | null>(null)
    const [appliedStatusValue, setAppliedStatusValue] = useState<{ label: string; value: boolean } | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
    const [params, setParams] = useState<GetExamCentersQueryParams>()

    // Modal states
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [editData, setEditData] = useState<GetExamCentersDto | null>(null)
    const [dialogMode, setDialogMode] = useState<DialogMode>()

    useEffect(() => {
        setParams({
            search: '',
            pageNumber: 1,
            pageSize: 10
        })
    }, [])

    useEffect(() => {
        if (params) {
            getExamCenters(params)
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
        setAppliedStatusValue(newValue)
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
        // setDialogMode(DialogMode.ADD)
    }

    const handleEditExamCenter = (examCenter: GetExamCentersDto) => {
        setDialogMode(DialogMode.EDIT)
        setEditData(examCenter)
        setOpenAddDialog(true)
    }

    const handleAddSuccess = () => {
        setReloadDataTable(prev => !prev)
    }

    const getExamCenters = async (params: GetExamCentersQueryParams): Promise<void> => {
        try {
            setLoading(true)
            const res = await examCentersAPI.GetExamCenters(params)

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

    const statusOptions = [
        { label: 'Đang hoạt động', value: true },
        { label: 'Dừng hoạt động', value: false }
    ]

    return (
        <>
            <Card className={`flex flex-col ${!isMobile ? 'h-[calc(100vh-116px)]' : 'h-full'}`}>
                <CardHeader title='Lọc trường thi' />
                <CardContent>
                    <Grid container spacing={5} alignItems={'flex-end'}>
                        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                            <Autocomplete
                                value={statusValue}
                                options={statusOptions}
                                onChange={handleStatusSelect}
                                id='exam-center-status-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Trạng thái' />}
                                noOptionsText='Không có dữ liệu'
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
                            <Button variant='outlined' disabled={!statusValue} color='error' className='min-w-[170px]' onClick={clearAllFilters}>XÓA TẤT CẢ</Button>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <div className='flex justify-between p-5 gap-4 flex-col sm:flex-row sm:items-center'>
                    <div className='flex items-center gap-3 w-full sm:w-auto'>
                        <DebouncedInput
                            value={search}
                            className='w-full'
                            onDebounceChange={onChangeSearch}
                            placeholder='Tên trường thi'
                        />
                    </div>
                    <Button variant='contained' color='primary' className='w-full sm:w-auto' onClick={handleOpenAddDialog}>
                        THÊM MỚI
                    </Button>
                </div>
                <div className='flex-1 overflow-hidden'>
                    <Table
                        data={dataTable}
                        setData={setDataTable}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        onPageChange={(page: number) => setPageNumber(page)}
                        onPageSizeChange={(size: number) => setPageSize(size)}
                        setReloadDataTable={setReloadDataTable}
                        isLoading={isLoading}
                        onEditExamCenter={handleEditExamCenter}
                    />
                </div>
            </Card>
            <AddExamCenterDialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                onSuccess={handleAddSuccess}
                editData={editData}
                mode={dialogMode}
            />
        </>
    )
}

export default ManageExamCentersList
