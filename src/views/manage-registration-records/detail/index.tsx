'use client'

import { useEffect, useState, useRef } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Avatar, Box, Button, Card, CardContent, Switch, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";

import { toast } from "react-toastify";

import CONFIG from "@/configs/config";


import registrationRecordsAPI from "@/libs/api/registrationRecordsAPI";
import type { RegistrationRecordBasicInfoDto } from "@/types/registrationRecords";
import OverviewTab from "./overview/OverviewTab";
import PaymentsTab from "./payments/PaymentsTab";
import ProcessingTab, { type ProcessingTabRef } from "./processes/ProcessingTab";
import { formatCurrency } from "@/utils/helpers";

type RegistrationRecordDetailProps = {
  id?: string
}

const RegistrationRecordDetail = ({ id }: RegistrationRecordDetailProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const [isApproved, setIsApproved] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const tabKeys = [
    CONFIG.RegistrationRecordDetailTabs.Overview,
    CONFIG.RegistrationRecordDetailTabs.Payments,
    CONFIG.RegistrationRecordDetailTabs.Processes
  ] as const

  const [basicInfo, setBasicInfo] = useState<RegistrationRecordBasicInfoDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const processingTabRef = useRef<ProcessingTabRef>(null)


  const isMobile = useMediaQuery(theme.breakpoints.down('md'))


  const fetchBasicInfo = async (id: string) => {
    try {
      const basicRes = await registrationRecordsAPI.GetRegistrationRecordBasicInfo(id)

      setBasicInfo(basicRes?.data?.data || null)
      setIsApproved(basicRes?.data?.data?.isApproved || false)
    } catch (error) {
      setBasicInfo(null)
    }
  }

  const fetchAllData = async (id: string) => {
    try {
      setIsLoading(true)
      await fetchBasicInfo(id)
    } finally {
      setIsLoading(false)
    }
  }


  const refreshBasicInfo = () => {
    if (id) {
      fetchBasicInfo(id)
    }
  }

  useEffect(() => {
    if (!id) return
    fetchAllData(id)
  }, [id])

  // Sync active tab from URL query param
  useEffect(() => {
    const tabParam = searchParams.get('tab') || CONFIG.RegistrationRecordDetailTabs.Overview
    const idx = tabKeys.indexOf(tabParam as typeof tabKeys[number])

    setActiveTab(idx >= 0 ? idx : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])



  const handleApprovedChange = async (_: any, checked: boolean) => {
    setIsApproved(checked)

    if (id) {
      try {
        await registrationRecordsAPI.UpdateRegistrationRecordIsApproved({
          id,
          isApproved: checked
        })

        if (checked) {
          toast.success('Duyệt hồ sơ thành công')

          if (processingTabRef.current) {
            processingTabRef.current.refreshSteps()
            processingTabRef.current.refreshTasks()
            processingTabRef.current.refreshStepOverview()
          }
        } else {
          toast.success('Bỏ duyệt hồ sơ thành công')

          if (processingTabRef.current) {
            processingTabRef.current.refreshSteps()
            processingTabRef.current.refreshTasks()
            processingTabRef.current.refreshStepOverview()
          }
        }
      } catch (error: any) {
        setIsApproved(!checked)

        if (checked) {
          toast.error(error?.response?.data?.message as string || 'Duyệt hồ sơ thất bại')
        } else {
          toast.error(error?.response?.data?.message as string || 'Bỏ duyệt hồ sơ thất bại')
        }

      }
    }
  }

  const headerFullName = basicInfo?.fullName || ''
  const headerLicenseType = basicInfo?.licenseTypeName ? ` - Hạng ${basicInfo.licenseTypeName}` : ''
  const phoneNumber = basicInfo?.phone || ''


  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outlined" color="primary"
            onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`)}
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '20px', color: theme.palette.primary.main }} />
          </Button>
          <Button variant="outlined" color="primary" onClick={() => id && router.push(`${CONFIG.Routers.ManageRegistrationRecords}/edit/${id}?from=detail`)}>
            CHỈNH SỬA
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={isApproved}
            onChange={handleApprovedChange}
            color="primary"
          />
          {!isMobile && (
            <Typography variant="body1" sx={{ opacity: 0.5 }}>
              Duyệt hồ sơ
            </Typography>
          )}
        </div>
      </div>

      {/* Header summary */}
      <Card sx={{ mt: 3, flex: 1 }}>
        <CardContent className="h-full flex flex-col pb-0">
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, minHeight: 80 }}>
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'action.hover' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                <Box sx={{ width: 200, height: 24, bgcolor: 'action.hover', borderRadius: 1 }} />
                <Box sx={{ width: 150, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                <Box sx={{ width: 300, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
              </Box>
            </Box>
          ) : (
            <div className="flex items-center gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
              <Avatar
                src={basicInfo?.avatarUrl ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${basicInfo.avatarUrl}` : undefined}
                sx={{ width: 56, height: 56 }}
              />
              <div className="flex flex-col gap-1">
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {headerFullName}{headerLicenseType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Số điện thoại: <span className="text-primary">{phoneNumber || 'Chưa có dữ liệu'}</span>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng phí: {basicInfo?.totalAmount ? formatCurrency(basicInfo?.totalAmount) : 'Chưa có dữ liệu'} | Đã thu: {basicInfo?.paidAmount ? formatCurrency(basicInfo?.paidAmount) : 'Chưa có dữ liệu'} | Còn lại: <span className="text-red-500">{basicInfo?.remainingAmount ? formatCurrency(basicInfo?.remainingAmount) : 'Chưa có dữ liệu'}</span>
                </Typography>
              </div>
            </div>
          )}

          <Tabs
            value={activeTab}
            className="w-full"
            onChange={(_, v) => {
              setActiveTab(v)
              const nextTab = tabKeys[v] || CONFIG.RegistrationRecordDetailTabs.Overview
              const qs = new URLSearchParams(Array.from(searchParams.entries()))

              qs.set('tab', nextTab)
              router.replace(`${pathname}?${qs.toString()}`)
            }}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            allowScrollButtonsMobile={isMobile}
            sx={{
              mt: 4,
              '& .MuiTabs-scrollButtons': {
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className="ri-information-line" style={{ fontSize: '18px' }} />
                  TỔNG QUAN
                </Box>
              }
              sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className="ri-bank-card-line" style={{ fontSize: '18px' }} />
                  THANH TOÁN
                </Box>
              }
              sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className="ri-hourglass-line" style={{ fontSize: '18px' }} />
                  XỬ LÝ HỒ SƠ
                </Box>
              }
              sx={{ minWidth: isMobile ? 'auto' : 'auto' }}
            />
          </Tabs>
          {activeTab === 0 && (
            <OverviewTab registrationRecordId={id} />
          )}
          {!isLoading && activeTab === 1 && (
            <PaymentsTab registrationRecordId={id} onDataChange={refreshBasicInfo} />
          )}
          {!isLoading && activeTab === 2 && (
            <ProcessingTab ref={processingTabRef} registrationRecordId={id} setIsApproved={setIsApproved}
              refreshBasicInfo={refreshBasicInfo} />
          )}
        </CardContent>
      </Card>


    </div>
  );
};

export default RegistrationRecordDetail
