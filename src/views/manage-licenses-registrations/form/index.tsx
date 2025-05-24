'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormLabel from '@mui/material/FormLabel'
import FormHelperText from '@mui/material/FormHelperText'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import Dropzone, { useDropzone } from 'react-dropzone'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import UploadAPI from '@/libs/api/uploadAPI'

// Styled Component Imports
import { SCREEN_TYPE } from '@/types/Common'
import { List, ListItem, Typography } from '@mui/material'
import Link from '@/components/Link'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomAvatar from '@/@core/components/mui/Avatar'
import ImageDropzonev2 from '@/components/common/ImageDropzonev2'
import CONFIG from '@/configs/config'
import { LicenseRegistrationCustomerResquest, LicenseRegistrationFormType, LicenseRegistrationCreateResquest, LicenseRegistrationUpdateResquest } from '@/types/LicensesRegistrations'

import { useUser } from '@/contexts/UserContext'
import PersonalInformation from './PersonalInformation'
import Header from './Header'
import CitizenCard from './CitizenCard'
import Contact from './Contact'
import Address from './Address'



type LicenseRegistrationFormProps = {
    screenType: SCREEN_TYPE
    id?: string
}

type FormValues = {
    fullName: string
    dateOfBirth: Date | null | undefined
    gender: string
    country: string
    phoneNumber: string
    email: string
    province: string
    district: string
    ward: string
    street: string
    cardType: string
    cccd: string
    drivingLicenseType: string
    licenseType: string
    totalAmount: number | null | undefined
    paymentStatus: string
    healthCheck: string
    carLicense: string
    confirmationStatus: string
    photo3x4: (string | File)[]
    frontPhoto: (string | File)[]
    backPhoto: (string | File)[]
    note: string
}

const LicenseRegistrationForm = ({ screenType, id }: LicenseRegistrationFormProps) => {
    // States
    const [provinces, setProvinces] = useState<any[]>([])
    const [districts, setDistricts] = useState<any[]>([])
    const [wards, setWards] = useState<any[]>([])
    const { user } = useUser()
    const router = useRouter()

    // Hooks
    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger
    } = useForm<FormValues>({
        defaultValues: {
            fullName: '',
            dateOfBirth: null,
            gender: '',
            country: 'Việt Nam',
            phoneNumber: '',
            email: '',
            province: '',
            district: '',
            ward: '',
            street: '',
            cardType: 'Căn cước công dân',
            cccd: '',
            drivingLicenseType: 'A1',
            licenseType: 'Xe máy',
            totalAmount: null,
            paymentStatus: 'Chưa thanh toán',
            healthCheck: 'Chưa khám',
            carLicense: 'Chưa có',
            confirmationStatus: 'Chưa duyệt',
            photo3x4: [],
            frontPhoto: [],
            backPhoto: [],
            note: ''
        },
        mode: 'onChange'
    })

    // Fetch data when id exists (edit mode)
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await LicenseRegistrationAPI.getDetailLicensesRegistration(id)
                    if (response.data.success) {
                        const data = response.data.data
                        // Set form values
                        setValue('fullName', data.person.fullName)
                        setValue('dateOfBirth', new Date(data.person.birthday))
                        setValue('gender', data.person.sex === 0 ? 'Nam' : data.person.sex === 1 ? 'Nữ' : 'Khác')
                        setValue('country', 'Việt Nam')
                        setValue('phoneNumber', data.person.phoneNumber)
                        setValue('email', data.person.email)
                        setValue('province', data.person.address.provinceCode)
                        setValue('district', data.person.address.districtCode)
                        setValue('ward', data.person.address.wardCode)
                        setValue('street', data.person.address.addressDetail)
                        setValue('cardType', 'Căn cước công dân')
                        setValue('cccd', data.person.citizenCardId)
                        setValue('drivingLicenseType', CONFIG.LicenseTypeSelectOption.find(opt => opt.value === data.licenseType)?.label || 'A1')
                        setValue('licenseType', data.vehicleType === 0 ? CONFIG.VehicleTypeMappingText[0] : CONFIG.VehicleTypeMappingText[1])
                        setValue('totalAmount', data.amount)
                        setValue('paymentStatus', data.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán')
                        setValue('healthCheck', data.hasCompletedHealthCheck ? 'Đã khám' : 'Chưa khám')
                        setValue('carLicense', data.hasCarLicense ? 'Đã có' : 'Chưa có')
                        setValue('confirmationStatus', data.hasApproved ? 'Đã duyệt' : 'Chưa duyệt')
                        setValue('photo3x4', [data.person.avatarUrl])
                        setValue('frontPhoto', [data.person.citizenCardFrontImgUrl])
                        setValue('backPhoto', [data.person.citizenCardBackImgUrl])
                        setValue('note', data.note)

                        // Fetch districts and wards based on province and district
                        if (data.person.address.provinceCode) {
                            await fetchDistricts(data.person.address.provinceCode)
                            setValue('district', data.person.address.districtCode)
                            if (data.person.address.districtCode) {
                                await fetchWards(data.person.address.districtCode)
                                setValue('ward', data.person.address.wardCode)
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error)
                    toast.error('Có lỗi xảy ra khi tải dữ liệu')
                }
            }
            fetchData()
        }
    }, [id, setValue])

    // Fetch provinces on component mount
    useEffect(() => {
        fetchProvinces()
    }, [])

    // Watch for province changes to fetch districts
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'province' && value.province) {
                fetchDistricts(value.province)
            }
            if (name === 'district' && value.district) {
                fetchWards(value.district)
            }
        })
        return () => subscription.unsubscribe()
    }, [watch])

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p')
            const data = await response.json()
            setProvinces(data)
        } catch (error) {
            console.error('Error fetching provinces:', error)
            toast.error('Lỗi khi tải danh sách tỉnh/thành phố')
        }
    }

    const fetchDistricts = async (provinceCode: string) => {
        if (!provinceCode) return
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
            const data = await response.json()
            setDistricts(data.districts)
            // Reset district and ward when province changes
            setValue('district', '')
            setValue('ward', '')
        } catch (error) {
            console.error('Error fetching districts:', error)
            toast.error('Lỗi khi tải danh sách quận/huyện')
        }
    }

    const fetchWards = async (districtCode: string) => {
        if (!districtCode) return
        try {
            const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
            const data = await response.json()
            setWards(data.wards)
            // Reset ward when district changes
            setValue('ward', '')
        } catch (error) {
            console.error('Error fetching wards:', error)
            toast.error('Lỗi khi tải danh sách phường/xã')
        }
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        debugger

        const uploadFile = async (fileOrUrl: string | File | undefined): Promise<string | undefined> => {
            if (fileOrUrl instanceof File) {
                try {
                    const response = await UploadAPI.uploadFiles([fileOrUrl]);
                    return response?.[0]?.url; // Return the URL from the upload response
                } catch (error) {
                    console.error("Error uploading file:", error);
                    toast.error("Lỗi khi tải lên ảnh");
                    return undefined; // Indicate upload failure
                }
            } else if (typeof fileOrUrl === 'string') {
                return fileOrUrl; // Keep existing URL
            }
            return undefined; // No file or URL
        };

        const uploadedPhoto3x4Url = await uploadFile(data.photo3x4?.[0]);
        const uploadedFrontPhotoUrl = await uploadFile(data.frontPhoto?.[0]);
        const uploadedBackPhotoUrl = await uploadFile(data.backPhoto?.[0]);

        // if (!data.photo3x4 || data.photo3x4.length === 0) {
        //     setValue('photo3x4', [], { shouldValidate: true })
        //     return
        // }

        try {
            const payload: LicenseRegistrationCreateResquest | LicenseRegistrationUpdateResquest = {
                vehicleType: data.licenseType === CONFIG.VehicleTypeMappingText[0] ? 0 : 1,
                licenseType: CONFIG.LicenseTypeSelectOption.find(opt => opt.label === data.drivingLicenseType)?.value as 0 | 1 | 2 | 3 || 0,
                hasCarLicense: data.carLicense === 'Đã có',
                hasCompletedHealthCheck: data.healthCheck === 'Đã khám',
                hasApproved: data.confirmationStatus === 'Đã duyệt',
                person: {
                    avatarUrl: uploadedPhoto3x4Url || '',
                    fullName: data.fullName,
                    birthday: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
                    sex: data.gender === CONFIG.SexTypeMappingText[1] ? 1 :
                        data.gender === CONFIG.SexTypeMappingText[0] ? 0 :
                            2,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    address: {
                        provinceCode: data.province.toString(),
                        districtCode: data.district.toString(),
                        wardCode: data.ward.toString(),
                        addressDetail: data.street
                    },
                    citizenCardId: data.cccd,
                    citizenCardFrontImgUrl: uploadedFrontPhotoUrl || '',
                    citizenCardBackImgUrl: uploadedBackPhotoUrl || '',
                },
                note: data.note,
                isPaid: data.paymentStatus === CONFIG.IsPaidSelectOption.find(opt => opt.value)?.label,
                amount: data.totalAmount || 0,
                ownerId: user?.id,
                id: id
            }

            let response
            if (id) {
                // Edit mode
                response = await LicenseRegistrationAPI.updateLicensesRegistrations(payload)
            } else {
                // Create mode
                response = await LicenseRegistrationAPI.createLicensesRegistrations(payload)
            }

            if (response.data.success) {
                toast.success(id ? 'Cập nhật thành công' : 'Thêm mới thành công')
                router.push('/manage-licenses-registration')
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            toast.error('Có lỗi xảy ra khi đăng ký bằng lái')
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <Header onCancel={() => router.push('/manage-licenses-registration')} />
            </Grid>
            <form id="license-registration-form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={6}>
                            <Grid size={{ xs: 12 }}>
                                <PersonalInformation
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                    trigger={trigger}
                                    watch={watch}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <CitizenCard
                                    control={control}
                                    errors={errors}
                                    setValue={setValue}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={6}>
                            <Grid size={{ xs: 12 }}>
                                <Contact
                                    control={control}
                                    errors={errors}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Address
                                    control={control}
                                    errors={errors}
                                    provinces={provinces}
                                    districts={districts}
                                    wards={wards}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Card>
                                    <CardHeader title='ĐĂNG KÝ' />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            {/* Bằng lái */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth error={!!errors.drivingLicenseType}>
                                                    <InputLabel>Bằng lái (*)</InputLabel>
                                                    <Controller
                                                        name='drivingLicenseType'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn bằng lái' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Bằng lái (*)'>
                                                                {CONFIG.LicenseTypeSelectOption.map((option) => (
                                                                    <MenuItem key={option.value} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.drivingLicenseType && (
                                                        <FormHelperText>{errors.drivingLicenseType.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            {/* Loại */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth error={!!errors.licenseType}>
                                                    <InputLabel>Loại (*)</InputLabel>
                                                    <Controller
                                                        name='licenseType'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn loại bằng lái' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Loại (*)'>
                                                                {CONFIG.VehicleTypeSelectOption.map((option) => (
                                                                    <MenuItem key={option.value} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.licenseType && (
                                                        <FormHelperText>{errors.licenseType.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Card>
                                    <CardHeader title='THÔNG TIN KHÁC' />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            {/* Sức khỏe */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth error={!!errors.healthCheck}>
                                                    <InputLabel>Sức khỏe (*)</InputLabel>
                                                    <Controller
                                                        name='healthCheck'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn trạng thái sức khỏe' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Sức khỏe (*)'>
                                                                {CONFIG.HasCompletedHealthCheckSelectOption.map((option) => (
                                                                    <MenuItem key={String(option.value)} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.healthCheck && (
                                                        <FormHelperText>{errors.healthCheck.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            {/* Bằng ô tô */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth error={!!errors.carLicense}>
                                                    <InputLabel>Bằng ô tô (*)</InputLabel>
                                                    <Controller
                                                        name='carLicense'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn trạng thái bằng ô tô' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Bằng ô tô (*)'>
                                                                {CONFIG.HasCarLicenseSelectOption.map((option) => (
                                                                    <MenuItem key={String(option.value)} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.carLicense && (
                                                        <FormHelperText>{errors.carLicense.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Card>
                                    <CardHeader title='THANH TOÁN' />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            {/* Tổng tiền */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name='totalAmount'
                                                    control={control}
                                                    rules={{ required: 'Vui lòng nhập tổng tiền' }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Tổng tiền (*)'
                                                            type='number'
                                                            error={!!errors.totalAmount}
                                                            helperText={errors.totalAmount?.message}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {/* Trạng thái thanh toán */}
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <FormControl fullWidth error={!!errors.paymentStatus}>
                                                    <InputLabel>Trạng thái thanh toán (*)</InputLabel>
                                                    <Controller
                                                        name='paymentStatus'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Trạng thái thanh toán (*)'>
                                                                {CONFIG.IsPaidSelectOption.map((option) => (
                                                                    <MenuItem key={String(option.value)} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.paymentStatus && (
                                                        <FormHelperText>{errors.paymentStatus.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Card>
                                    <CardHeader title='DUYỆT' />
                                    <CardContent>
                                        <Grid container spacing={5}>
                                            {/* Xác nhận */}
                                            <Grid size={{ xs: 12 }}>
                                                <FormControl fullWidth error={!!errors.confirmationStatus}>
                                                    <InputLabel>Xác nhận (*)</InputLabel>
                                                    <Controller
                                                        name='confirmationStatus'
                                                        control={control}
                                                        rules={{ required: 'Vui lòng chọn trạng thái xác nhận' }}
                                                        render={({ field }) => (
                                                            <Select {...field} label='Xác nhận (*)'>
                                                                {CONFIG.ApprovedOption.map((option) => (
                                                                    <MenuItem key={String(option.value)} value={option.label}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.confirmationStatus && (
                                                        <FormHelperText>{errors.confirmationStatus.message}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Card>
                                    <CardHeader title='GHI CHÚ' />
                                    <CardContent>
                                        <Grid container spacing={5}>
                                            {/* Ghi chú */}
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name='note'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            multiline
                                                            rows={4}
                                                            label='Ghi chú'
                                                            placeholder='Nhập ghi chú...'
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}

export default LicenseRegistrationForm
