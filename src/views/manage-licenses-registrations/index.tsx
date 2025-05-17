'use client'

import { useEffect, useState } from 'react'
import Table from './Table'
import { Button, Card } from '@mui/material'
import DebouncedInput from '@/components/common/DebouncedInput'
import { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import { toast } from 'react-toastify'
import axiosInstance from '@/libs/axios'
import Link from '@/components/Link'

const ManageLicensesRegistrations = () => {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterLicense, setFilterLicense] = useState('')
    const [dataTable, setDataTable] = useState<LicenseRegistrationType>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [payload, setPayload] = useState<GetLicensesRegistrationsParams>()
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [isPaid, setIsPaid] = useState<boolean>()
    const [hasCompletedHealthCheck, setHasCompletedHealthCheck] = useState<boolean>()
    const [examScheduleId, setExamScheduleId] = useState<string>()
    const [totalPages, setTotalPages] = useState<number>(10)
    const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
    const [examScheduleOptions, setExamScheduleOptions] = useState<{ label: any; value: any }[]>([])
    const [hasNextPage, setHasNextPage] = useState<boolean>(false)

    useEffect(() => {
        if (payload) {
            getLicensesRegistrationsData(payload)
        }
    }, [payload])


    useEffect(() => {
        if (pageNumber && pageSize)
            setPayload((prev: any) => {
                return {
                    ...prev,
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    search,
                    isPaid,
                    hasCompletedHealthCheck,
                    examScheduleId
                }
            })
    }, [pageSize, pageNumber, search, isPaid, hasCompletedHealthCheck, examScheduleId])

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

    return <>
        <Card className='flex justify-between items-center mb-1 p-2'>
            <DebouncedInput
                value={search}
                onDebounceChange={onChangeSearch}
                placeholder='Tìm kiếm'
            />

            <div className='flex gap-4 items-center'>
                <div className='flex gap-1 items-center'>
                    <i className="ri-filter-2-line text-3xl"></i>
                    <span>Lọc</span>
                </div>
                <Link href={'manage-licenses-registration/create'} passHref legacyBehavior>
                    <Button variant="contained" color="primary" onClick={() => {/* Add your click handler here */ }} >
                        Thêm mới
                    </Button>
                </Link>

            </div>
        </Card>
        <Table
            data={dataTable}
            setData={setDataTable}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={(page) => setPageNumber(page)}
            onPageSizeChange={(size) => setPageSize(size)}
        />
    </>
}
export default ManageLicensesRegistrations
