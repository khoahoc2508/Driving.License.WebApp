'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// THird-party Imports

// Type Imports

// Component Imports

// Style Imports
import { toast } from 'react-toastify'

import { Button } from '@mui/material'

import DebouncedInput from '@/components/common/DebouncedInput'
import type { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import LicenseRegistrationTable from '@/views/exam-schedules/details/exam-schedule-right/assign-license-registrations/LicenseRegistrationTable'
import CONFIG from '@/configs/config'


import AssignLicenseRegistrationsDialog from '@/views/exam-schedules/details/exam-schedule-right/assign-license-registrations/dialog/AssignLicenseRegistrationsDialog'

type Props = {
  examScheduleId: string
}

const LicenseRegistrationCard = ({ examScheduleId }: Props) => {
  const [openAssignLicenseRegistrationsDialog, setOpenAssignLicenseRegistrationsDialog] = useState(false)

  // table
  const [licenseRegistrationParams, setLicenseRegistrationParams] = useState<GetLicensesRegistrationsParams>({ pageNumber: 1, pageSize: 9999999, search: '', examScheduleId: examScheduleId })
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>()
  const [totalCount, setTotalCount] = useState(0)
  const [reloadFlag, setReloadFlag] = useState(false)
  const [loading, setLoading] = useState(false)

  // Function to reload data
  const reloadData = () => {
    setReloadFlag(prev => !prev)
  }

  // Fetch data
  const fetchLicensesRegistrationsByExamScheduleId = async (params: GetLicensesRegistrationsParams): Promise<void> => {
    try {
      setLoading(true)
      const res = await LicenseRegistrationAPI.getLicensesRegistrations(params)

      if (res?.data?.data) {
        const fetchedData = res?.data?.data || []

        setDataTable(fetchedData)
        setTotalCount(res?.data?.totalCount || 0)
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      toast.error(error?.message)
    } finally {
      // setLoading(false)
    }
  }


  const handleOpenAssignLicenseRegistrationsDialog = () => {
    setOpenAssignLicenseRegistrationsDialog(true)
  }

  useEffect(() => {
    // if (examScheduleId) {
    //   setLicenseRegistrationParams((prev) => ({ ...prev, examScheduleId: examScheduleId }))
    // }
  }, [examScheduleId])

  useEffect(() => {
    if (examScheduleId !== null && examScheduleId !== undefined) {
      fetchLicensesRegistrationsByExamScheduleId(licenseRegistrationParams)
    }
  }, [JSON.stringify(licenseRegistrationParams), reloadFlag])

  return (
    <Card>
      <CardHeader
        title={`Danh sách học viên thi (${totalCount})`}
        className='flex flex-wrap pb-0'

      />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
        <DebouncedInput
          value={licenseRegistrationParams?.search ?? ''}
          onDebounceChange={value => setLicenseRegistrationParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
          placeholder='Tìm kiếm'
          className='max-sm:is-full'
        />
        <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>

          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            className='max-sm:is-full is-auto'
            onClick={handleOpenAssignLicenseRegistrationsDialog}
          >
            Thêm học viên
          </Button>
        </div>
      </div>

      <LicenseRegistrationTable
        tableAction={CONFIG.TableAction.View}
        data={dataTable} setData={setDataTable}
        params={licenseRegistrationParams}
        setParams={setLicenseRegistrationParams}
        totalItems={totalCount}
        reloadDataTable={reloadData}
        isLoading={loading}
        examScheduleId={examScheduleId} />

      <AssignLicenseRegistrationsDialog
        open={openAssignLicenseRegistrationsDialog ?? false}
        handleClose={() =>
          setOpenAssignLicenseRegistrationsDialog(false)
        }
        examScheduleId={examScheduleId}
        onSuccess={reloadData}
      />
    </Card>
  )
}

export default LicenseRegistrationCard
