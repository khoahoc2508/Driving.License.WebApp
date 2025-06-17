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
import { GetLicensesRegistrationsParams, LicenseRegistrationType } from "@/types/LicensesRegistrations"
import DebouncedInput from "@/components/common/DebouncedInput"
import LicenseRegistrationAPI from "@/libs/api/licenseRegistrationAPI"
import LicenseRegistrationTable from "@/views/exam-schedules/list/assign-license-registrations/assign/LicenseRegistrationTable"

type Props = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
  examScheduleId?: string
}

const AssignLicenseRegistrationsDrawer = (props: Props) => {
  // Props
  const { open, handleClose, examScheduleId } = props
  const [search, setSearch] = useState('')

  // table
  const [licenseRegistrationParams, setLicenseRegistrationParams] = useState<GetLicensesRegistrationsParams>({ pageNumber: 1, pageSize: 10, search: '', isExamScheduled: false, isPaid: true })
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>()
  const [totalCount, setTotalCount] = useState(0)

  const [selectedLicenseRegistrationIds, setSelectedLicenseRegistrationIds] = useState<string[]>([]);

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedLicenseRegistrationIds(selectedIds);
  };


  const handleAssignToExamSchedule = async () => {
    if (selectedLicenseRegistrationIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất một đăng ký');
      return;
    }

    try {
      const response = await ExamScheduleAPI.setExamScheduleForBulkLicenseRegistrations({
        examScheduleId: examScheduleId,
        licenseRegistrationIds: selectedLicenseRegistrationIds
      });

      if (response.data?.success) {
        toast.success('Xếp lịch thi thành công');
        handleClose();
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error assigning license registrations:', error);
      toast.error('Có lỗi xảy ra khi xếp lịch thi');
    }
  };

  // Fetch data

  const fetchLicensesRegistrations = async (params: GetLicensesRegistrationsParams): Promise<void> => {
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

  const onChangeSearch = (value: string | number) => {
    setSearch(String(value))
  }

  useEffect(() => {
    if (open) {
      fetchLicensesRegistrations(licenseRegistrationParams)
    }
  }, [JSON.stringify(licenseRegistrationParams), open])

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
              <Typography variant='h5'>Thêm học viên ({selectedLicenseRegistrationIds.length})</Typography>
            </div>
            <div className='flex items-center gap-2'>

            </div>
            <div className='flex items-center gap-2'>

            </div>
          </div>
          <IconButton size='small' onClick={handleClose}>
            <i className='ri-close-line text-2xl' />
          </IconButton>
        </div>
        <Divider />
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
          <div className='p-5 flex flex-col gap-4'>

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
                  onClick={handleAssignToExamSchedule}
                  disabled={selectedLicenseRegistrationIds.length === 0}
                >
                  Thêm
                </Button>
              </div>
            </div>
            <LicenseRegistrationTable tableAction={CONFIG.TableAction.View} data={dataTable} setData={setDataTable} params={licenseRegistrationParams} setParams={setLicenseRegistrationParams} totalItems={totalCount} isLoading={false} onSelectionChange={handleSelectionChange} />
          </div>
        </PerfectScrollbar>
      </Drawer>
    </>
  )
}

export default AssignLicenseRegistrationsDrawer 
