'use client'

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Avatar, Box, Button, Card, CardContent, Switch, Tab, Tabs, Typography, useTheme } from "@mui/material";

import CONFIG from "@/configs/config";


import registrationRecordsAPI from "@/libs/api/registrationRecordsAPI";
import type { RegistrationRecordBasicInfoDto, RegistrationRecordOverviewDto } from "@/types/registrationRecords";
import OverviewTab from "./overview/OverviewTab";
import PaymentsTab from "./payments/PaymentsTab";
import ProcessingTab from "./processes/ProcessingTab";
import { toast } from "react-toastify";


type RegistrationRecordDetailProps = {
    id?: string
}

const RegistrationRecordDetail = ({ id }: RegistrationRecordDetailProps) => {
    const router = useRouter();
    const theme = useTheme();
    const [isApproved, setIsApproved] = useState(false)
    const [activeTab, setActiveTab] = useState(0)

    const [basicInfo, setBasicInfo] = useState<RegistrationRecordBasicInfoDto | null>(null)
    const [overview, setOverview] = useState<RegistrationRecordOverviewDto | null>(null)
    const [isLoading, setIsLoading] = useState(false)


    const refreshData = () => {
        if (id) {
            fetchData(id)
        }
    }

    useEffect(() => {
        if (!id) return
        fetchData(id)
    }, [id])

    const fetchData = async (id: string) => {
        try {
            setIsLoading(true)

            const [basicRes, overviewRes] = await Promise.all([
                registrationRecordsAPI.GetRegistrationRecordBasicInfo(id),
                registrationRecordsAPI.GetRegistrationRecordOverview(id)
            ])

            setBasicInfo(basicRes?.data?.data || null)
            setIsApproved(basicRes?.data?.data?.isApproved || false)
            setOverview(overviewRes?.data?.data || null)
        } catch (error) {
            setBasicInfo(null)
            setOverview(null)
        } finally {
            setIsLoading(false)
        }
    }


    const handleApprovedChange = async (_: any, checked: boolean) => {
        setIsApproved(checked)
        if (id) {
            try {
                await registrationRecordsAPI.UpdateRegistrationRecordIsApproved({
                    id,
                    isApproved: checked
                })
                toast.success('Cập nhật thành công')
            } catch (error) {
                toast.error((error as any).response.data.message)
            }
        }
    }

    const headerFullName = basicInfo?.fullName || ''
    const headerLicenseType = basicInfo?.licenseTypeName ? ` - Hạng ${basicInfo.licenseTypeName}` : ''
    const phoneNumber = basicInfo?.phone || ''

    const currency = (value?: number | null) => {
        if (value === undefined || value === null) return 'Chưa có dữ liệu'

        return new Intl.NumberFormat('vi-VN').format(value)
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`)}
                        className="w-10 h-10 border-2 border-primary"
                    >
                        <i className="ri-arrow-left-line" style={{ fontSize: '20px', color: theme.palette.primary.main }} />
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => id && router.push(`${CONFIG.Routers.ManageRegistrationRecords}/edit/${id}`)}>
                        CHỈNH SỬA
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <Switch
                        checked={isApproved}
                        onChange={handleApprovedChange}
                        color="primary"
                    />
                    <Typography variant="body1" sx={{ opacity: 0.5 }}>
                        Duyệt hồ sơ
                    </Typography>
                </div>
            </div>

            {/* Header summary */}
            <Card sx={{ mt: 3, flex: 1 }}>
                <CardContent className="h-full flex flex-col">
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
                        <div className="flex items-center gap-4">
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
                                    Tổng phí: {currency(basicInfo?.totalAmount)} | Đã thu: {currency(basicInfo?.paidAmount)} | Còn lại: <span className="text-red-500">{currency(basicInfo?.remainingAmount)}</span>
                                </Typography>
                            </div>
                        </div>
                    )}

                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mt: 4 }}>
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <i className="ri-information-line" style={{ fontSize: '18px' }} />
                                    TỔNG QUAN
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <i className="ri-money-dollar-circle-line" style={{ fontSize: '18px' }} />
                                    THANH TOÁN
                                </Box>
                            }
                        />
                        <Tab
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <i className="ri-time-line" style={{ fontSize: '18px' }} />
                                    XỬ LÝ HỒ SƠ
                                </Box>
                            }
                        />
                    </Tabs>
                    {!isLoading && activeTab === 0 && (
                        <OverviewTab overview={overview} />
                    )}
                    {!isLoading && activeTab === 1 && (
                        <PaymentsTab registrationRecordId={id} onDataChange={refreshData} />
                    )}
                    {!isLoading && activeTab === 2 && (
                        <ProcessingTab registrationRecordId={id} />
                    )}
                    {isLoading && (
                        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Box sx={{ width: 150, height: 28, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }} />
                                <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 2, columnGap: 2 }}>
                                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                    <Box sx={{ width: 200, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                    <Box sx={{ width: 300, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                    <Box sx={{ width: 120, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                    <Box sx={{ width: 100, height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                                </Box>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>


        </div>
    );
};

export default RegistrationRecordDetail
