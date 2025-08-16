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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Checkbox,
    FormControlLabel,
    Box
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import { toast } from 'react-toastify'

import DebouncedInput from '@/components/common/DebouncedInput'
import CONFIG from '@/configs/config'
import Table from './Table'
import { GetRegistrationRecordsDto, GetRegistrationRecordsQueryParams, PaymentStatus, RegistrationRecordStatus } from '@/types/registrationRecords'
import registrationRecordsAPI from '@/libs/api/registrationRecordsAPI'
import licenseTypeAPI from '@/libs/api/licenseTypeApi'
import assigneeAPI from '@/libs/api/assigneeAPI'
import { AssigneeType } from '@/types/assigneeTypes'
import type { VisibilityState } from '@tanstack/react-table'

const ManageRegistrationRecords = () => {

    const [dataTable, setDataTable] = useState<GetRegistrationRecordsDto[]>([])
    const [search, setSearch] = useState('')
    const [licenseTypeValue, setLicenseTypeValue] = useState<{ label: string; value: string }[]>([])
    const [paymentStatusValue, setPaymentStatusValue] = useState<{ label: string; value: number }[]>([])
    const [registrationRecordStatusValue, setRegistrationRecordStatusValue] = useState<{ label: string; value: number }[]>([])
    const [staffAssigneeValue, setStaffAssigneeValue] = useState<{ label: string; value: string }[]>([])
    const [collaboratorValue, setCollaboratorValue] = useState<{ label: string; value: string }[]>([])

    const [appliedLicenseTypeValue, setAppliedLicenseTypeValue] = useState<{ label: string; value: string }[]>([])
    const [appliedPaymentStatusValue, setAppliedPaymentStatusValue] = useState<{ label: string; value: number }[]>([])
    const [appliedRegistrationRecordStatusValue, setAppliedRegistrationRecordStatusValue] = useState<{ label: string; value: number }[]>([])
    const [appliedStaffAssigneeValue, setAppliedStaffAssigneeValue] = useState<{ label: string; value: string }[]>([])
    const [appliedCollaboratorValue, setAppliedCollaboratorValue] = useState<{ label: string; value: string }[]>([])

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
    const [params, setParams] = useState<GetRegistrationRecordsQueryParams>()

    // License type options from API
    const [licenseTypeOptions, setLicenseTypeOptions] = useState<{ label: string; value: string }[]>([])

    // Staff assignee and collaborator options from API
    const [staffAssigneeOptions, setStaffAssigneeOptions] = useState<{ label: string; value: string }[]>([])
    const [collaboratorOptions, setCollaboratorOptions] = useState<{ label: string; value: string }[]>([])
    const [staffAssigneePage, setStaffAssigneePage] = useState(1)
    const [collaboratorPage, setCollaboratorPage] = useState(1)
    const [hasMoreStaff, setHasMoreStaff] = useState(true)
    const [hasMoreCollaborator, setHasMoreCollaborator] = useState(true)

    // Column visibility state
    const [openColumnVisibilityDialog, setOpenColumnVisibilityDialog] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnVisibilitySearch, setColumnVisibilitySearch] = useState('');

    useEffect(() => {
        setParams({
            pageNumber: 1,
            pageSize: 10
        })
        // Fetch license types on component mount
        fetchLicenseTypes()
        // Fetch initial staff assignees and collaborators
        fetchStaffAssignees(1, true)
        fetchCollaborators(1, true)
    }, [])

    useEffect(() => {
        if (params) {
            getRegistrationRecords(params)
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
                    licenseTypeCode: appliedLicenseTypeValue.map(item => item.value),
                    registrationRecordStatus: appliedRegistrationRecordStatusValue.map(item => item.value),
                    paymentStatus: appliedPaymentStatusValue.map(item => item.value),
                    staffAssigneeId: appliedStaffAssigneeValue.map(item => item.value),
                    collaboratorId: appliedCollaboratorValue.map(item => item.value),
                }
            })
    }, [pageSize, pageNumber, search, appliedLicenseTypeValue, appliedPaymentStatusValue, appliedRegistrationRecordStatusValue, appliedStaffAssigneeValue, appliedCollaboratorValue])

    const fetchLicenseTypes = async () => {
        try {
            const res = await licenseTypeAPI.getAllLicenseTypes({})
            if (res?.data?.data) {
                const options = res.data.data.map((licenseType: any) => ({
                    label: licenseType.name || licenseType.code,
                    value: licenseType.code
                }))
                setLicenseTypeOptions(options)
            }
        } catch (error: any) {
            setLicenseTypeOptions([])
        }
    }

    const fetchStaffAssignees = async (page: number, reset: boolean = false) => {
        try {
            const res = await assigneeAPI.GetAssignees({
                assigneeType: CONFIG.AssigneeTypes.Employee as AssigneeType,
                pageNumber: page,
                pageSize: 9999
            })

            if (res?.data?.data) {
                const newOptions = res.data.data.map((assignee: any) => ({
                    label: assignee.fullName || 'Unknown',
                    value: assignee.id || ''
                }))

                if (reset) {
                    setStaffAssigneeOptions(newOptions)
                } else {
                    setStaffAssigneeOptions(prev => [...prev, ...newOptions])
                }

                setHasMoreStaff(res.data.hasNextPage || false)
                setStaffAssigneePage(page)
            }
        } catch (error: any) {
            console.error('Error fetching staff assignees:', error)
        }
    }

    const fetchCollaborators = async (page: number, reset: boolean = false) => {
        try {
            const res = await assigneeAPI.GetAssignees({
                assigneeType: CONFIG.AssigneeTypes.Collaborator as AssigneeType,
                pageNumber: page,
                pageSize: 9999
            })

            if (res?.data?.data) {
                const newOptions = res.data.data.map((assignee: any) => ({
                    label: assignee.fullName || 'Unknown',
                    value: assignee.id || ''
                }))

                if (reset) {
                    setCollaboratorOptions(newOptions)
                } else {
                    setCollaboratorOptions(prev => [...prev, ...newOptions])
                }

                setHasMoreCollaborator(res.data.hasNextPage || false)
                setCollaboratorPage(page)
            }
        } catch (error: any) {
            console.error('Error fetching collaborators:', error)
        }
    }

    const handleStaffAssigneeScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1 && hasMoreStaff) {
            fetchStaffAssignees(staffAssigneePage + 1, false)
        }
    }

    const handleCollaboratorScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1 && hasMoreCollaborator) {
            fetchCollaborators(collaboratorPage + 1, false)
        }
    }

    const onChangeSearch = (value: string | number) => {
        setSearch(String(value))
        setPageNumber(1)
    }

    const handleLicenseTypeSelect = (_event: any, newValue: { label: string; value: string }[]) => {
        setLicenseTypeValue(newValue)
    }

    const handlePaymentStatusSelect = (_event: any, newValue: { label: string; value: number }[]) => {
        setPaymentStatusValue(newValue)
    }

    const handleRegistrationRecordStatusSelect = (_event: any, newValue: { label: string; value: number }[]) => {
        setRegistrationRecordStatusValue(newValue)
    }

    const handleStaffAssigneeSelect = (_event: any, newValue: { label: string; value: string }[]) => {
        setStaffAssigneeValue(newValue)
    }

    const handleCollaboratorSelect = (_event: any, newValue: { label: string; value: string }[]) => {
        setCollaboratorValue(newValue)
    }

    const applyFilters = () => {
        setAppliedLicenseTypeValue(licenseTypeValue)
        setAppliedPaymentStatusValue(paymentStatusValue)
        setAppliedRegistrationRecordStatusValue(registrationRecordStatusValue)
        setAppliedStaffAssigneeValue(staffAssigneeValue)
        setAppliedCollaboratorValue(collaboratorValue)
        setPageNumber(1)
    }

    const clearAllFilters = () => {
        setLicenseTypeValue([])
        setPaymentStatusValue([])
        setRegistrationRecordStatusValue([])
        setStaffAssigneeValue([])
        setCollaboratorValue([])
        setAppliedLicenseTypeValue([])
        setAppliedPaymentStatusValue([])
        setAppliedRegistrationRecordStatusValue([])
        setAppliedStaffAssigneeValue([])
        setAppliedCollaboratorValue([])
        setPageNumber(1)
    }

    const getRegistrationRecords = async (params: GetRegistrationRecordsQueryParams): Promise<void> => {
        try {
            setLoading(true)
            const res = await registrationRecordsAPI.GetRegistrationRecords(params)

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

    // Column visibility handlers
    const handleOpenColumnVisibilityDialog = () => {
        setOpenColumnVisibilityDialog(true);
    };

    const handleCloseColumnVisibilityDialog = () => {
        setOpenColumnVisibilityDialog(false);
    };

    const handleSaveColumnVisibility = () => {
        setOpenColumnVisibilityDialog(false);
        toast.success('Đã lưu cài đặt hiển thị cột');
    };

    const handleColumnVisibilityChange = (updater: VisibilityState | ((old: VisibilityState) => VisibilityState)) => {
        if (typeof updater === 'function') {
            setColumnVisibility(updater);
        } else {
            setColumnVisibility(updater);
        }
    };

    return (
        <>
            <Card>
                <CardHeader title='Lọc hồ sơ' />
                <CardContent>
                    <Grid container spacing={5} alignItems={'flex-end'}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete
                                multiple
                                value={licenseTypeValue}
                                options={licenseTypeOptions}
                                onChange={handleLicenseTypeSelect}
                                id='license-type-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Hạng' />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete
                                multiple
                                value={paymentStatusValue}
                                options={CONFIG.paymentStatusOptions || []}
                                onChange={handlePaymentStatusSelect}
                                id='payment-status-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Thanh toán' />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete
                                multiple
                                value={registrationRecordStatusValue}
                                options={CONFIG.registrationStatusOptions || []}
                                onChange={handleRegistrationRecordStatusSelect}
                                id='status-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Trạng thái' />}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete
                                multiple
                                value={staffAssigneeValue}
                                options={staffAssigneeOptions}
                                onChange={handleStaffAssigneeSelect}
                                onScroll={handleStaffAssigneeScroll}
                                id='staff-assignee-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Người phụ trách' />}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={5} alignItems={'flex-end'} sx={{ mt: 2 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Autocomplete
                                multiple
                                value={collaboratorValue}
                                options={collaboratorOptions}
                                onChange={handleCollaboratorSelect}
                                onScroll={handleCollaboratorScroll}
                                id='collaborator-autocomplete'
                                getOptionLabel={option => option?.label || ''}
                                isOptionEqualToValue={(opt, val) => opt.value === val.value}
                                renderInput={params => <TextField {...params} label='Cộng tác viên' />}
                            />
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
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleOpenColumnVisibilityDialog}
                            startIcon={<i className="ri-settings-3-line" />}
                        >
                            Cột hiển thị
                        </Button>
                        <DebouncedInput
                            value={search}
                            className='w-full'
                            onDebounceChange={onChangeSearch}
                            placeholder='Q. Họ tên, số điện thoại'
                        />
                    </div>
                    <Button variant='contained' color='primary' className='w-full sm:w-auto'>
                        THÊM MỚI
                    </Button>
                </div>
                <Table
                    data={dataTable}
                    setData={(data: GetRegistrationRecordsDto[] | undefined) => setDataTable(data || [])}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={(page: number) => setPageNumber(page)}
                    onPageSizeChange={(size: number) => setPageSize(size)}
                    setReloadDataTable={setReloadDataTable}
                    isLoading={isLoading}
                    columnVisibility={columnVisibility}
                    onColumnVisibilityChange={handleColumnVisibilityChange}
                />
            </Card>

            {/* Column Visibility Dialog */}
            <Dialog
                open={openColumnVisibilityDialog}
                onClose={handleCloseColumnVisibilityDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Cột hiển thị</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Tìm kiếm"
                            value={columnVisibilitySearch}
                            onChange={(e) => setColumnVisibilitySearch(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={Object.keys(columnVisibility).length === 0 || Object.values(columnVisibility).every(v => v)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        const newVisibility: VisibilityState = {};
                                        // Define all column IDs dynamically
                                        const allColumns = [
                                            { id: 'stt', header: 'STT' },
                                            { id: 'hang', header: 'HẠNG' },
                                            { id: 'hoSo', header: 'HỒ SƠ' },
                                            { id: 'tong', header: 'TỔNG' },
                                            { id: 'daNop', header: 'ĐÃ NỘP' },
                                            { id: 'conThieu', header: 'CÒN THIẾU' },
                                            { id: 'trangThai', header: 'TRẠNG THÁI' },
                                            { id: 'nguoiPhuTrach', header: 'NGƯỜI PHỤ TRÁCH' },
                                            { id: 'ctv', header: 'CTV' },
                                            { id: 'thaoTac', header: 'THAO TÁC' }
                                        ];
                                        allColumns.forEach(col => {
                                            newVisibility[col.id] = checked;
                                        });
                                        setColumnVisibility(newVisibility);
                                    }}
                                />
                            }
                            label="Tất cả"
                        />
                        {[
                            { id: 'stt', header: 'STT' },
                            { id: 'hang', header: 'HẠNG' },
                            { id: 'hoSo', header: 'HỒ SƠ' },
                            { id: 'tong', header: 'TỔNG' },
                            { id: 'daNop', header: 'ĐÃ NỘP' },
                            { id: 'conThieu', header: 'CÒN THIẾU' },
                            { id: 'trangThai', header: 'TRẠNG THÁI' },
                            { id: 'nguoiPhuTrach', header: 'NGƯỜI PHỤ TRÁCH' },
                            { id: 'ctv', header: 'CTV' },
                            { id: 'thaoTac', header: 'THAO TÁC' }
                        ].map((column) => (
                            <FormControlLabel
                                key={column.id}
                                control={
                                    <Checkbox
                                        checked={columnVisibility[column.id] !== false}
                                        onChange={(e) => {
                                            setColumnVisibility(prev => ({
                                                ...prev,
                                                [column.id]: e.target.checked
                                            }));
                                        }}
                                    />
                                }
                                label={column.header}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseColumnVisibilityDialog}>HỦY</Button>
                    <Button onClick={handleSaveColumnVisibility} variant="contained">LƯU</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ManageRegistrationRecords
