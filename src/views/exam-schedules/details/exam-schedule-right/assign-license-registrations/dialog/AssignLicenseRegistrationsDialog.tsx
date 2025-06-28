'use client'

// React Imports
import { forwardRef, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import type { ReactElement, Ref } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Slide from '@mui/material/Slide'
import type { SlideProps } from '@mui/material/Slide'

import Button from '@mui/material/Button'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
import { toast } from 'react-toastify'

import type { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations';
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'

// Styled Component Imports

import DebouncedInput from '@/components/common/DebouncedInput'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import LicenseRegistrationTable from './LicenseRegistrationTable'

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

type Props = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
  examScheduleId?: string
}

const AssignLicenseRegistrationsDialog = (props: Props) => {
  // Props
  const { open, handleClose, onSuccess, examScheduleId } = props

  // Initial states
  const initialParams = { pageNumber: 1, pageSize: 10, search: '', isExamScheduled: false, isPaid: true }

  // table
  const [licenseRegistrationParams, setLicenseRegistrationParams] = useState<GetLicensesRegistrationsParams>(initialParams)
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>()
  const [totalCount, setTotalCount] = useState(0)
  const [selectedLicenseRegistrationIds, setSelectedLicenseRegistrationIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Reset function để reset toàn bộ trạng thái
  const resetDialogState = () => {
    setLicenseRegistrationParams(initialParams)
    setDataTable(undefined)
    setTotalCount(0)
    setSelectedLicenseRegistrationIds([])
  }

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedLicenseRegistrationIds(selectedIds);
  }


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
        resetDialogState(); // Reset trạng thái trước khi đóng
        handleClose();
        if (onSuccess) onSuccess()
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xếp lịch thi');
    }
  };

  // Fetch data với useCallback để tránh tạo function mới mỗi lần render
  const fetchLicensesRegistrations = useCallback(async (params: GetLicensesRegistrationsParams): Promise<void> => {
    try {
      setLoading(true)
      const res = await LicenseRegistrationAPI.getLicensesRegistrations(params)

      if (res?.data?.data) {
        const fetchedData = res?.data?.data || []

        setDataTable(fetchedData)
        setTotalCount(res?.data?.totalCount || 0)
      }
    } catch (error: any) {
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoize params để tránh re-render không cần thiết
  const memoizedParams = useMemo(() => licenseRegistrationParams, [
    licenseRegistrationParams.pageNumber,
    licenseRegistrationParams.pageSize,
    licenseRegistrationParams.search,
    licenseRegistrationParams.isExamScheduled,
    licenseRegistrationParams.isPaid
  ])

  useEffect(() => {
    if (open) {
      fetchLicensesRegistrations(memoizedParams)
    } else {
      // Reset toàn bộ trạng thái khi dialog đóng
      resetDialogState()
    }
  }, [memoizedParams, open, fetchLicensesRegistrations])

  // Sử dụng useRef để lưu trữ data trước đó và so sánh
  const prevDataRef = useRef<LicenseRegistrationType>()

  // Memoize dataTable để tránh re-render không cần thiết khi data không thực sự thay đổi
  const memoizedDataTable = useMemo(() => {
    if (!dataTable || !Array.isArray(dataTable)) return []

    // So sánh với data trước đó
    if (prevDataRef.current &&
      Array.isArray(prevDataRef.current) &&
      prevDataRef.current.length === dataTable.length &&
      prevDataRef.current.every((item, index) => item.id === dataTable[index]?.id)) {
      return prevDataRef.current
    }

    prevDataRef.current = dataTable

    return dataTable
  }, [dataTable])

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
        closeAfterTransition={true}
      >
        <DialogTitle id='alert-dialog-slide-title'> - Danh sách học viên</DialogTitle>
        <DialogContent>
          <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>
            <div className='p-2 flex flex-col gap-4'>

              <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4'>
                <DebouncedInput
                  value={licenseRegistrationParams?.search ?? ''}
                  onDebounceChange={value => setLicenseRegistrationParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
                  placeholder='Tìm kiếm'
                  className='max-sm:is-full'
                />

              </div>
              <LicenseRegistrationTable
                data={memoizedDataTable}
                params={licenseRegistrationParams}
                setParams={setLicenseRegistrationParams}
                totalItems={totalCount}
                isLoading={loading}
                onSelectionChange={handleSelectionChange}
                openDialog={open} />
            </div>
          </PerfectScrollbar>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='secondary'>
            Hủy
          </Button>
          <Button type='submit' variant='contained'
            onClick={handleAssignToExamSchedule}
            disabled={selectedLicenseRegistrationIds.length === 0}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AssignLicenseRegistrationsDialog
