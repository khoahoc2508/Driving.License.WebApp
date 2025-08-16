'use client'

import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'


import { Button, Card, CardHeader, Divider } from '@mui/material'

import DebouncedInput from '@/components/common/DebouncedInput'
import Link from '@/components/Link'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import type { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations'
import Table from './Table'


import TableFilters from './TableFilters'

const ManageLicensesRegistrations = () => {
  const [search, setSearch] = useState('')
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>([])
  const [payload, setPayload] = useState<GetLicensesRegistrationsParams>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [reloadDataTable, setReloadDataTable] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)

  // Filter states
  const [hasApprovedFilter, setHasApprovedFilter] = useState<boolean[]>([])
  const [licenseTypeFilter, setLicenseTypeFilter] = useState<string[]>([])
  const [examScheduleId] = useState<string | undefined>(undefined)

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
          licenseTypeCodes: licenseTypeFilter.length > 0 ? licenseTypeFilter : undefined,
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

  const handleApplyFilters = (status: boolean[], licenseTypeCodes: string[]) => {
    setHasApprovedFilter(status)
    setLicenseTypeFilter(licenseTypeCodes)
  }

  return <>
    <Card>
      <CardHeader title='Lọc' />
      <TableFilters onApplyFilters={handleApplyFilters} />
      <Divider />
      <div className='flex justify-end p-5 gap-4 flex-col items-start sm:flex-row sm:items-center'>
        <div className='flex items-center gap-x-4 gap-4 flex-col max-sm:is-full sm:flex-row'>
          <DebouncedInput
            value={search}
            className='w-full'
            onDebounceChange={onChangeSearch}
            placeholder='Tìm kiếm'
          />
          <Link href={'manage-licenses-registration/create'} passHref legacyBehavior className='max-sm:is-full'>
            <Button variant="contained" color="primary" className='w-full'>
              THÊM MỚI
            </Button>
          </Link>
        </div>
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
      />
    </Card>
  </>
}

export default ManageLicensesRegistrations
