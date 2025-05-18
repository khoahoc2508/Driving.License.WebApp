'use client'

import { useEffect, useState } from 'react'
import Table from './Table'
import DebouncedInput from '@/components/common/DebouncedInput'
import { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import { toast } from 'react-toastify'
import axiosInstance from '@/libs/axios'
import Link from '@/components/Link'
import Grid from '@mui/material/Grid2'
import { Button, Card } from '@mui/material'
import Filter from './Filter'

const ManageLicensesRegistrations = () => {
    const [search, setSearch] = useState('')
    const [dataTable, setDataTable] = useState<LicenseRegistrationType>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [payload, setPayload] = useState<GetLicensesRegistrationsParams>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(10)
    const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
    const [examScheduleOptions, setExamScheduleOptions] = useState<{ label: any; value: any }[]>([])
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)

    // Filter states
    const [hasApprovedFilter, setHasApprovedFilter] = useState<boolean[]>([])
    const [licenseTypeFilter, setLicenseTypeFilter] = useState<number[]>([])
    const [examScheduleId, setExamScheduleId] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (payload) {
            getLicensesRegistrationsData(payload)
        }
    }, [payload, reloadDataTable])


    useEffect(() => {
        if (pageNumber && pageSize)
            setPayload((prev: any) => {
                return {
                    ...prev,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    search,
                    hasApproved: hasApprovedFilter.length > 0 ? hasApprovedFilter : undefined,
                    licenseType: licenseTypeFilter.length > 0 ? licenseTypeFilter : undefined,
                    examScheduleId
                }
            })
    }, [pageSize, pageNumber, search, hasApprovedFilter, licenseTypeFilter, examScheduleId])

    const getLicensesRegistrationsData = async (params: GetLicensesRegistrationsParams): Promise<void> => {
        try {
            setLoading(true)
            const res = await LicenseRegistrationAPI.getLicensesRegistrations(params)
            if (res?.data?.data) {
                const fetchedData = res?.data?.data || []
                setDataTable(fetchedData)
                setTotalItems(res?.data?.totalCount || 0)
            }
        } catch (error: any) {
            toast.error(error?.message)
        } finally {
            setLoading(false)
        }
    }

    const onChangeSearch = (value: string | number) => {
        setSearch(String(value))
    }

    const handleApplyFilters = (status: boolean[], licenseType: number[]) => {
        // Update state to trigger API call via useEffect
        setHasApprovedFilter(status)
        setLicenseTypeFilter(licenseType)
    }

    return <>
        <Card className='flex justify-between items-center p-2 mb-1'>
            <Grid container spacing={2} justifyContent={'space-between'} className='w-full'>
                <Grid size={{ xs: 12, sm: 2 }} className='flex items-center'>
                    <DebouncedInput
                        value={search}
                        className='w-full'
                        onDebounceChange={onChangeSearch}
                        placeholder='Tìm kiếm'
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 10 }}>
                    <div className='flex gap-4 items-center justify-end'>
                        <div className='flex gap-1 items-center'>
                            <Filter onApplyFilters={handleApplyFilters} />
                            <span>Lọc</span>
                        </div>
                        <Link href={'manage-licenses-registration/create'} passHref legacyBehavior>
                            <Button variant="contained" color="primary">
                                Thêm mới
                            </Button>
                        </Link>
                    </div>
                </Grid>
            </Grid>
        </Card>

        <Table
            data={dataTable}
            setData={setDataTable}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(page) => setPageNumber(page)}
            onPageSizeChange={(size) => setPageSize(size)}
            setReloadDataTable={setReloadDataTable}
        />
    </>
}
export default ManageLicensesRegistrations
