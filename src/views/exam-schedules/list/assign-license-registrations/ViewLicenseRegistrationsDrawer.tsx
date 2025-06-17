'use client'

import { useEffect, useState } from "react"

import { Divider, Drawer, IconButton, Typography } from "@mui/material"

// MUI Imports
import Button from '@mui/material/Button'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { toast } from 'react-toastify'

// Styled Component Imports

import CONFIG from '@/configs/config'
import ExamScheduleAPI from "@/libs/api/examScheduleAPI"
import type { ExamScheduleType } from "@/types/examScheduleTypes"
import type { GetLicensesRegistrationsParams, LicenseRegistrationType } from "@/types/LicensesRegistrations"
import DebouncedInput from "@/components/common/DebouncedInput"
import LicenseRegistrationTable from "@/views/exam-schedules/list/assign-license-registrations/list/LicenseRegistrationTable"
import LicenseRegistrationAPI from "@/libs/api/licenseRegistrationAPI"
import AssignLicenseRegistrationsDrawer from "@/views/exam-schedules/list/assign-license-registrations/assign/AssignLicenseRegistrationsDrawer"

type Props = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
  examScheduleId?: string
}


const ViewLicenseRegistrationsDrawer = (props: Props) => {
  // Props
  const { open, handleClose, examScheduleId } = props
  const [examSchedule, setExamSchedule] = useState<ExamScheduleType>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [search, setSearch] = useState('')

  const [openAssignLicenseRegistrationsDrawer, setOpenAssignLicenseRegistrationsDrawer] = useState(false)

  // table
  const [licenseRegistrationParams, setLicenseRegistrationParams] = useState<GetLicensesRegistrationsParams>({ pageNumber: 1, pageSize: 10, search: '' })
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>()
  const [totalCount, setTotalCount] = useState(0)
  const [reloadFlag, setReloadFlag] = useState(false)

  // Function to reload data
  const reloadData = () => {
    setReloadFlag(prev => !prev)
  }

  // Fetch data
  const fetchExamScheduleById = async (id: string) => {
    try {

      const response = await ExamScheduleAPI.getExamScheduleById(id)

      const examScheduleRes = response.data.data as ExamScheduleType

      if (examScheduleRes) {
        setExamSchedule(examScheduleRes)
      }
    } catch (error) {
      console.error('Error fetching exam schedule by id:', error)
    }
  }

  const fetchLicensesRegistrationsByExamScheduleId = async (params: GetLicensesRegistrationsParams): Promise<void> => {
    try {
      // setLoading(true)
      const res = await LicenseRegistrationAPI.getLicensesRegistrations(params)

      if (res?.data?.data) {
        const fetchedData = res?.data?.data || []

        setDataTable(fetchedData)
        setTotalCount(res?.data?.totalCount || 0)
      }
    } catch (error: any) {
      toast.error(error?.message)
    } finally {
      // setLoading(false)
    }
  }


  const handleOpenAssignLicenseRegistrationsDrawer = () => {
    setOpenAssignLicenseRegistrationsDrawer(true)
  }

  useEffect(() => {
    if (examScheduleId && open) {
      fetchExamScheduleById(examScheduleId)
      setLicenseRegistrationParams((prev) => ({ ...prev, examScheduleId: examScheduleId }))
    }
  }, [examScheduleId])

  useEffect(() => {
    if (open) {
      fetchLicensesRegistrationsByExamScheduleId(licenseRegistrationParams)
    }
  }, [JSON.stringify(licenseRegistrationParams), reloadFlag, open])

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={() => { }}
        ModalProps={{ keepMounted: false }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: "90%", sm: "70%" } } }}
      >

        <div className='flex items-center justify-between pli-5 plb-4'>

          <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
            <div className='flex items-center gap-2'>
              <Typography variant='h5'>{"Lịch thi"}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <i className='ri-map-pin-2-line text-textSecondary' />
              <Typography className='font-medium'>{examSchedule?.examAddress?.fullAddress}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <i className='ri-calendar-line text-textSecondary' />
              <Typography className='font-medium'>{examSchedule?.dateTime ? new Date(examSchedule?.dateTime).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : ''}</Typography>
            </div>
          </div>
          <IconButton size='small' onClick={handleClose}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
        <Divider />
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
          <div className='p-5 flex flex-col gap-4'>
            {/* <div className='flex justify-end gap-4 flex-col items-start sm:flex-row sm:items-center'>
            <div className='w-full'>
              <DebouncedInput
                value={search}
                className='w-full'
                // onDebounceChange={onChangeSearch}
                onDebounceChange={value => setLicenseRegistrationParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
                placeholder='Tìm kiếm'
              />
            </div>
          </div> */}
            <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
              <DebouncedInput
                value={search}

                // className='w-full'
                // onDebounceChange={onChangeSearch}
                onDebounceChange={value => setLicenseRegistrationParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
                placeholder='Tìm kiếm'
                className='max-sm:is-full'
              />
              <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>

                <Button
                  variant='contained'
                  startIcon={<i className='ri-add-line' />}
                  className='max-sm:is-full is-auto'
                  onClick={handleOpenAssignLicenseRegistrationsDrawer}
                >
                  Thêm
                </Button>
              </div>
            </div>
            <LicenseRegistrationTable tableAction={CONFIG.TableAction.View} data={dataTable} setData={setDataTable} params={licenseRegistrationParams} setParams={setLicenseRegistrationParams} totalItems={totalCount} reloadDataTable={reloadData} isLoading={false} examScheduleId={examScheduleId} />
          </div>
        </PerfectScrollbar>
      </Drawer>

      <AssignLicenseRegistrationsDrawer
        open={openAssignLicenseRegistrationsDrawer}
        handleClose={() => {
          setOpenAssignLicenseRegistrationsDrawer(false)
          reloadData()
        }

        }
        examScheduleId={examScheduleId}

      />
    </>
  )
}

export default ViewLicenseRegistrationsDrawer 
