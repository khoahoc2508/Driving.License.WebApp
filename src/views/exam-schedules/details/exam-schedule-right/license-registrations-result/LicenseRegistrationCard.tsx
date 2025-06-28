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


import { Button, CardActions, Typography } from '@mui/material'

import DebouncedInput from '@/components/common/DebouncedInput'
import type { GetLicensesRegistrationsParams, LicenseRegistrationType } from '@/types/LicensesRegistrations'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import LicenseRegistrationTable from './LicenseRegistrationTable'
import ExamScheduleAPI from '@/libs/api/examScheduleAPI'
import type { UpdateLicenseRegistrationResultsType } from '@/types/examScheduleTypes'

type Props = {
  examScheduleId: string
}

const LicenseRegistrationCard = ({ examScheduleId }: Props) => {
  // table
  const [licenseRegistrationParams, setLicenseRegistrationParams] = useState<GetLicensesRegistrationsParams>({ pageNumber: 1, pageSize: 99999, search: '' })
  const [dataTable, setDataTable] = useState<LicenseRegistrationType>()
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Track result changes - Map to store licenseRegistrationId -> passed status
  const [resultChanges, setResultChanges] = useState<Map<string, boolean>>(new Map())

  // Track which IDs have been updated for UI feedback
  const [updatedIds, setUpdatedIds] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const fetchLicensesRegistrationsByExamScheduleId = async (params: GetLicensesRegistrationsParams): Promise<void> => {
    try {
      if (params.examScheduleId == null || params.examScheduleId == undefined) return
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
  }

  const handleResultChange = (licenseRegistrationId: string, passed: boolean) => {
    // Track the change in results
    setResultChanges(prev => {
      const newChanges = new Map(prev)

      newChanges.set(licenseRegistrationId, passed)

      return newChanges
    })

    // Track which IDs have been updated for UI feedback
    setUpdatedIds(prev => {
      const newUpdatedIds = new Set(prev)

      newUpdatedIds.add(licenseRegistrationId)

      return newUpdatedIds
    })
  }

  const handleSaveResults = async () => {
    if (resultChanges.size === 0) {
      toast.info('Không có thay đổi nào để lưu')

      return
    }

    try {
      setSaving(true)

      const results: UpdateLicenseRegistrationResultsType[] = Array.from(resultChanges.entries()).map(([licenseRegistrationId, passed]) => ({
        licenseRegistrationId,
        passed
      }))

      const response = await ExamScheduleAPI.updateExamScheduleResults({
        id: examScheduleId,
        results
      })

      if (response.data?.success) {
        toast.success('Lưu kết quả thi thành công')

        // Clear changes and updated IDs after successful save
        setResultChanges(new Map())
        setUpdatedIds(new Set())

        // Reload data to ensure consistency
        await fetchLicensesRegistrationsByExamScheduleId(licenseRegistrationParams)
      } else {
        toast.error(response.data?.message || 'Có lỗi xảy ra khi lưu kết quả')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi lưu kết quả')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset changes and updated IDs
    setResultChanges(new Map())
    setUpdatedIds(new Set())

    // Reload original data to reset any UI changes
    fetchLicensesRegistrationsByExamScheduleId(licenseRegistrationParams)
  }

  // Calculate pass rate
  const calculatePassRate = () => {
    if (!dataTable || dataTable.length === 0) return { passedCount: 0, totalCount: 0, percentage: 0 }

    let passedCount = 0

    dataTable.forEach(item => {
      // Use changed value if exists, otherwise use original value
      const passed = item.id && resultChanges.has(item.id)
        ? resultChanges.get(item.id)
        : item.passed ?? false

      if (passed) passedCount++
    })

    const percentage = dataTable.length > 0 ? Math.round((passedCount / dataTable.length) * 100) : 0

    return { passedCount, totalCount: dataTable.length, percentage }
  }

  useEffect(() => {
    if (examScheduleId != null && examScheduleId != undefined) {
      setLicenseRegistrationParams((prev) => ({ ...prev, examScheduleId: examScheduleId }))
    }
  }, [examScheduleId])

  useEffect(() => {
    if (examScheduleId != null && examScheduleId != undefined) {
      fetchLicensesRegistrationsByExamScheduleId(licenseRegistrationParams)
    }

  }, [JSON.stringify(licenseRegistrationParams)])

  return (
    <Card>
      <CardHeader
        title={`Danh sách học viên thi (${totalCount})`}
        className='flex flex-wrap pb-0'

      />
      <div className='flex justify-between flex-col items-start sm:flex-row sm:items-end gap-y-4 p-5'>
        <DebouncedInput
          value={licenseRegistrationParams?.search ?? ''}
          onDebounceChange={value => setLicenseRegistrationParams((prev) => ({ ...prev, search: value.toString() ?? '' }))}
          placeholder='Tìm kiếm'
          className='max-sm:is-full'
        />
        <div className='flex items-end max-sm:flex-col gap-4 max-sm:is-full is-auto'>
          {/* Pass Rate Display */}
          {(() => {
            const { passedCount, totalCount } = calculatePassRate()


            return (
              <div className='flex items-center gap-2'>
                <Typography variant='body2' color='text.secondary'>
                  Tỷ lệ đỗ: {passedCount}/{totalCount}
                </Typography>
              </div>
            )
          })()}

        </div>
      </div>

      <LicenseRegistrationTable
        data={dataTable}
        totalItems={totalCount}
        isLoading={loading}
        examScheduleId={examScheduleId}
        onResultChange={handleResultChange}
        updatedIds={updatedIds}
        resultChanges={resultChanges} />
      <CardActions>
        <Button
          variant='contained'
          onClick={handleSaveResults}
          disabled={saving || resultChanges.size === 0}
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleCancel}
          disabled={saving}
          className='mis-4'
        >
          Hủy
        </Button>
      </CardActions>
    </Card>
  )
}

export default LicenseRegistrationCard
