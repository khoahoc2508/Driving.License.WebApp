'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
    Box,
    Button,
    Card,
    CardHeader,
    Typography,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from '@mui/material'

// Component Imports
import { toast } from 'react-toastify'

// Form Imports
import { useForm } from 'react-hook-form'

// API Imports
import AddressConversionAPI from '@/libs/api/addressConversionAPI'

// Types Imports
import type { DropdownOption } from '@/types/addressesTypes'

// Local Component Imports
import {
    AddressInputPanel,
    type AddressData
} from '@/components/tool-address-sync'

type FormData = {
    oldProvince: string
    oldDistrict: string
    oldWard: string
    newProvince: string
    newWard: string
}

const ToolAddressSync = () => {
    // Form setup
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        defaultValues: {
            oldProvince: '',
            oldDistrict: '',
            oldWard: '',
            newProvince: '',
            newWard: ''
        },
        mode: 'onChange'
    })

    // Watch form values for cascade loading
    const watchedValues = watch()

    // States
    const [syncResult, setSyncResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    // API data states
    const [oldProvinces, setOldProvinces] = useState<DropdownOption[]>([])
    const [oldDistricts, setOldDistricts] = useState<DropdownOption[]>([])
    const [oldWards, setOldWards] = useState<DropdownOption[]>([])
    const [newProvinces, setNewProvinces] = useState<DropdownOption[]>([])
    const [newWards, setNewWards] = useState<DropdownOption[]>([])

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    // Load initial data from API (only provinces)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true)

                // Load only provinces data
                const [oldProvincesData, newProvincesData] = await Promise.all([
                    AddressConversionAPI.getOldProvinces(),
                    AddressConversionAPI.getProvinces()
                ])

                // Convert to dropdown options
                setOldProvinces(oldProvincesData.map(item => ({ label: item.name || '', value: item.id?.toString() || '' })))
                setNewProvinces(newProvincesData.map(item => ({ label: item.name || '', value: item.id?.toString() || '' })))

            } catch (error) {
                console.error('Error loading initial address data:', error)
                toast.error('Có lỗi xảy ra khi tải dữ liệu địa chỉ')
            } finally {
                setIsLoading(false)
            }
        }

        loadInitialData()
    }, [])

    // Watch form values for cascade loading
    useEffect(() => {
        if (watchedValues.oldProvince) {
            loadOldDistricts(watchedValues.oldProvince)
        }
    }, [watchedValues.oldProvince])

    useEffect(() => {
        if (watchedValues.oldDistrict) {
            loadOldWards(watchedValues.oldDistrict)
        }
    }, [watchedValues.oldDistrict])

    useEffect(() => {
        if (watchedValues.newProvince) {
            loadNewWards(watchedValues.newProvince)
        }
    }, [watchedValues.newProvince])

    // Load old districts when old province changes
    const loadOldDistricts = async (oldProvinceId: string) => {
        try {
            const oldDistrictsData = await AddressConversionAPI.getOldDistricts(oldProvinceId)
            setOldDistricts(oldDistrictsData.map(item => ({ label: item.name || '', value: item.id?.toString() || '' })))
            // Clear old wards when districts change
            setOldWards([])
            setValue('oldDistrict', '')
            setValue('oldWard', '')
        } catch (error) {
            console.error('Error loading old districts:', error)
            toast.error('Có lỗi xảy ra khi tải danh sách quận/huyện')
        }
    }

    // Load old wards when old district changes
    const loadOldWards = async (oldDistrictId: string) => {
        try {
            const oldWardsData = await AddressConversionAPI.getOldWards(oldDistrictId)
            setOldWards(oldWardsData.map(item => ({ label: item.name || '', value: item.id?.toString() || '' })))
            // Clear ward when district changes
            setValue('oldWard', '')
        } catch (error) {
            console.error('Error loading old wards:', error)
            toast.error('Có lỗi xảy ra khi tải danh sách xã/phường')
        }
    }

    // Load new wards when new province changes
    const loadNewWards = async (newProvinceId: string) => {
        try {
            const newWardsData = await AddressConversionAPI.getWards(newProvinceId)
            setNewWards(newWardsData.map(item => ({ label: item.name || '', value: item.id?.toString() || '' })))
            // Clear ward when province changes
            setValue('newWard', '')
        } catch (error) {
            console.error('Error loading new wards:', error)
            toast.error('Có lỗi xảy ra khi tải danh sách xã/phường mới')
        }
    }

    // Show confirmation dialog
    const handleShowConfirmDialog = (data: FormData) => {
        setShowConfirmDialog(true)
    }

    // Handle confirm update
    const handleConfirmUpdate = async () => {
        setShowConfirmDialog(false)
        const formData = watchedValues
        await onSubmit(formData)
    }

    // Handle cancel update
    const handleCancelUpdate = () => {
        setShowConfirmDialog(false)
    }

    // Form submit handler
    const onSubmit = async (data: FormData) => {
        try {
            // Prepare mapping data
            const mappingData = {
                oldProvinceId: data.oldProvince,
                oldDistrictId: data.oldDistrict,
                oldWardId: data.oldWard,
                newProvinceId: data.newProvince,
                newWardId: data.newWard
            }

            // Call API to upsert mapping
            const response = await AddressConversionAPI.upsertUserWardMapping(mappingData)

            const result = {
                oldAddress: {
                    province: data.oldProvince,
                    district: data.oldDistrict,
                    ward: data.oldWard
                },
                newAddress: {
                    province: data.newProvince,
                    district: '',
                    ward: data.newWard
                },
                syncStatus: 'success',
                message: 'Đồng bộ dữ liệu thành công',
                timestamp: new Date().toISOString(),
                response: response
            }

            setSyncResult(result)
            toast.success('Đồng bộ dữ liệu thành công')
        } catch (error: any) {
            console.error('Error syncing address mapping:', error)
            toast.error(error?.response?.data?.message || 'Có lỗi xảy ra trong quá trình đồng bộ')

            const result = {
                oldAddress: {
                    province: data.oldProvince,
                    district: data.oldDistrict,
                    ward: data.oldWard
                },
                newAddress: {
                    province: data.newProvince,
                    district: '',
                    ward: data.newWard
                },
                syncStatus: 'error',
                message: error?.response?.data?.message || 'Có lỗi xảy ra trong quá trình đồng bộ',
                timestamp: new Date().toISOString()
            }
            setSyncResult(result)
        }
    }

    const handleClearAll = () => {
        setValue('oldProvince', '')
        setValue('oldDistrict', '')
        setValue('oldWard', '')
        setValue('newProvince', '')
        setValue('newWard', '')
        setOldDistricts([])
        setOldWards([])
        setNewWards([])
        setSyncResult(null)
        toast.success('Đã xóa toàn bộ dữ liệu')
    }

    if (isLoading) {
        return (
            <Card className={`flex flex-col ${!isMobile ? 'h-[calc(100vh-116px)]' : 'h-full'} text-center`}>
                <CardHeader
                    title={
                        <Typography variant="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Đồng bộ dữ liệu sau sáp nhập thủ công
                        </Typography>
                    }
                    subheader={
                        <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                            Hãy chắc chắn việc cập nhật của bạn là chính xác
                        </Typography>
                    }
                    sx={{
                        py: 10,
                        flexShrink: 0
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    minHeight: 0
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <i className="ri-loader-4-line ri-animate-spin" style={{ fontSize: '48px', color: 'var(--mui-palette-primary-main)' }} />
                        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                            Đang tải dữ liệu địa chỉ...
                        </Typography>
                    </Box>
                </Box>
            </Card>
        )
    }

    return (
        <Card className={`flex flex-col ${!isMobile ? 'h-[calc(100vh-116px)]' : 'h-full'} text-center`}>
            <CardHeader
                title={
                    <Typography variant="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Đồng bộ dữ liệu sau sáp nhập thủ công
                    </Typography>
                }
                subheader={
                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
                        Hãy chắc chắn việc cập nhật là chính xác
                    </Typography>
                }
                sx={{
                    py: 10,
                    flexShrink: 0
                }}
            />

            {/* Main Content */}
            <form id="address-sync-form" onSubmit={handleSubmit(handleShowConfirmDialog)}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: 4,
                    mx: 4,
                    flex: 1,
                    minHeight: 0,
                    alignItems: 'start'
                }}>
                    {/* Left Column - Old Address */}
                    <AddressInputPanel
                        title="Địa chỉ cũ"
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        provinces={oldProvinces}
                        districts={oldDistricts}
                        wards={oldWards}
                        showDistrict={true}
                        fieldPrefix="old"
                    />

                    {/* Center - Correspondence Indicator */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        minHeight: '300px',
                    }}>
                        <Box>
                            <i className="ri-arrow-left-right-line text-primary"></i>
                        </Box>
                        <Typography variant="body2" sx={{
                            color: 'primary.main',
                            fontWeight: 500,
                            textAlign: 'center',
                            whiteSpace: 'nowrap'
                        }}>
                            TƯƠNG ỨNG
                        </Typography>
                    </Box>

                    {/* Right Column - New Address */}
                    <AddressInputPanel
                        title="Địa chỉ mới"
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        provinces={newProvinces}
                        districts={[]}
                        wards={newWards}
                        showDistrict={false}
                        fieldPrefix="new"
                    />
                </Box>
            </form>

            {/* Action Buttons */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 4,
                flexShrink: 0,
                gap: 2
            }}>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    form="address-sync-form"
                    disabled={isSubmitting}
                    className='min-w-[400px] rounded'
                    sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: 'primary.dark'
                        }
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <i className="ri-loader-4-line ri-animate-spin" style={{ marginRight: 8 }} />
                            Đang đồng bộ...
                        </>
                    ) : (
                        'CẬP NHẬT'
                    )}
                </Button>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={handleCancelUpdate}
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: 2,
                        p: 1
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pb: 2,
                        fontSize: '1.25rem',
                        fontWeight: 600
                    }}
                >
                    Bạn chắc chắn cập nhật?
                    <IconButton
                        onClick={handleCancelUpdate}
                        size="small"
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        <i className="ri-close-line" />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
                        Bạn đang cập nhật dữ liệu sau sáp nhập:
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                            <strong>Xã cũ:</strong>{' '}
                            <span style={{ color: '#1976d2', fontWeight: 500 }}>
                                {(() => {
                                    const oldProvince = oldProvinces.find(p => p.value === watchedValues.oldProvince)
                                    const oldDistrict = oldDistricts.find(d => d.value === watchedValues.oldDistrict)
                                    const oldWard = oldWards.find(w => w.value === watchedValues.oldWard)
                                    return `${oldWard?.label || ''} - ${oldDistrict?.label || ''} - ${oldProvince?.label || ''}`
                                })()}
                            </span>
                        </Typography>

                        <Typography variant="body2">
                            <strong>Xã mới:</strong>{' '}
                            <span style={{ color: '#1976d2', fontWeight: 500 }}>
                                {(() => {
                                    const newProvince = newProvinces.find(p => p.value === watchedValues.newProvince)
                                    const newWard = newWards.find(w => w.value === watchedValues.newWard)
                                    return `${newWard?.label || ''} - ${newProvince?.label || ''}`
                                })()}
                            </span>
                        </Typography>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                    <Button
                        onClick={handleCancelUpdate}
                        variant="outlined"
                        sx={{
                            minWidth: 100,
                            borderColor: '#e0e0e0',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: '#bdbdbd',
                                backgroundColor: 'action.hover'
                            }
                        }}
                    >
                        HỦY
                    </Button>
                    <Button
                        onClick={handleConfirmUpdate}
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            minWidth: 100,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="ri-loader-4-line ri-animate-spin" style={{ marginRight: 8 }} />
                                Đang cập nhật...
                            </>
                        ) : (
                            'XÁC NHẬN'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default ToolAddressSync
