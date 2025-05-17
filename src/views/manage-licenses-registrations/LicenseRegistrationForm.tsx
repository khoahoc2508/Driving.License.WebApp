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
import { useForm, Controller } from 'react-hook-form'
import Dropzone, { useDropzone } from 'react-dropzone'
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'

// Styled Component Imports
import { SCREEN_TYPE } from '@/types/Common'
import { List, ListItem, Typography } from '@mui/material'
import Link from '@/components/Link'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomAvatar from '@/@core/components/mui/Avatar'
import ImageDropzone from '@/components/common/ImageDropzone'
import CONFIG from '@/configs/config'
import { LicenseRegistrationCustomerResquest, LicenseRegistrationFormType, LicenseRegistrationCreateResquest, LicenseRegistrationUpdateResquest } from '@/types/LicensesRegistrations'

import { useUser } from '@/contexts/UserContext'


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
    photo3x4: string[]
    frontPhoto: string[]
    backPhoto: string[]
    note: string
}

type LicenseRegistrationFormProps = {
    screenType: SCREEN_TYPE
    id?: string
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
                                // Wait for wards state to be updated before setting ward value
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

    const onSubmit = handleSubmit(async (data) => {
        if (!data.photo3x4 || data.photo3x4.length === 0) {
            setValue('photo3x4', [], { shouldValidate: true })
            return
        }

        try {
            const payload: LicenseRegistrationCreateResquest | LicenseRegistrationUpdateResquest = {
                vehicleType: data.licenseType === CONFIG.VehicleTypeMappingText[0] ? 0 : 1,
                licenseType: CONFIG.LicenseTypeSelectOption.find(opt => opt.label === data.drivingLicenseType)?.value as 0 | 1 | 2 | 3 || 0,
                hasCarLicense: data.carLicense === 'Đã có',
                hasCompletedHealthCheck: data.healthCheck === 'Đã khám',
                hasApproved: data.confirmationStatus === 'Đã duyệt',
                person: {
                    avatarUrl: data.photo3x4[0] || '',
                    fullName: data.fullName,
                    birthday: data.dateOfBirth?.toISOString().split('T')[0] || '',
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
                    citizenCardFrontImgUrl: data.frontPhoto[0] || '',
                    citizenCardBackImgUrl: data.backPhoto[0] || '',
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
    })

    return (
        <>
            <Card className='flex justify-between items-center mb-1 p-2'>
                <Typography className='uppercase font-bold'>{id ? 'Chỉnh sửa học viên' : 'Thêm mới học viên'}</Typography>
                <Link href={'/manage-licenses-registration'}>
                    <IconButton size='small' edge='end' aria-label='close'>
                        <i className='ri-close-line' />
                    </IconButton>
                </Link>
            </Card>
            <Card>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Grid container spacing={5}>
                            {/* Left Column */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Grid container spacing={2}> {/* Inner container for two columns */}
                                    {/* Tải đại diện 3x4 */}
                                    <Grid size={{ xs: 12, sm: 6 }}> {/* Column 1 for photo */}
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name="photo3x4"
                                                control={control}
                                                rules={{
                                                    required: 'Vui lòng tải lên ảnh 3x4',
                                                    validate: value => (value && value.length > 0) || 'Vui lòng tải lên ảnh 3x4'
                                                }}
                                                render={({ field }) => (
                                                    <ImageDropzone
                                                        title="Kéo thả file ảnh 3x4"
                                                        onUpload={(response) => {
                                                            field.onChange(response.data)
                                                            trigger('photo3x4')
                                                        }}
                                                        required
                                                        error={Boolean(errors.photo3x4)}
                                                        helperText={errors.photo3x4?.message}
                                                        multiple={false}
                                                        maxFiles={1}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}> {/* Column 2 for personal info */}
                                        <Grid size={{ xs: 12 }} >
                                            {/* Họ tên */}
                                            <Grid size={{ xs: 12 }} className='mb-4'>
                                                <Controller
                                                    name='fullName'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Họ tên (*)'
                                                            placeholder='Nguyễn Văn A'
                                                            {...(errors.fullName && { error: true, helperText: 'Vui lòng nhập họ tên.' })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {/* Ngày sinh */}
                                            <Grid size={{ xs: 12 }} className='mb-4'>
                                                <Controller
                                                    name='dateOfBirth'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field: { value, onChange } }) => (
                                                        <AppReactDatepicker
                                                            selected={value}
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            onChange={onChange}
                                                            placeholderText='dd/MM/yyyy'
                                                            dateFormat='dd/MM/yyyy'
                                                            customInput={
                                                                <TextField
                                                                    value={value}
                                                                    onChange={onChange}
                                                                    fullWidth
                                                                    label='Ngày sinh'
                                                                    {...(errors.dateOfBirth && { error: true, helperText: 'Vui lòng nhập ngày sinh.' })}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {/* Giới tính */}
                                            <Grid size={{ xs: 12 }} className='mb-4'>
                                                <FormControl error={Boolean(errors.gender)}>
                                                    {/* <FormLabel>Giới tính</FormLabel> */}
                                                    <Controller
                                                        name='gender'
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <RadioGroup row {...field} name='gender-buttons-group'>
                                                                <FormControlLabel value='Nữ' control={<Radio />} label='Nữ' />
                                                                <FormControlLabel value='Nam' control={<Radio />} label='Nam' />
                                                                <FormControlLabel value='Khác' control={<Radio />} label='Khác' />
                                                            </RadioGroup>
                                                        )}
                                                    />
                                                    {errors.gender && <FormHelperText error>Vui lòng nhập giới tính.</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                            {/* Quốc gia */}
                                            <Grid size={{ xs: 12 }} className='mb-4'>
                                                <FormControl fullWidth>
                                                    <InputLabel error={Boolean(errors.country)}>Quốc gia</InputLabel>
                                                    <Controller
                                                        name='country'
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <Select label='Quốc gia' {...field} error={Boolean(errors.country)}>
                                                                <MenuItem value='Việt Nam'>Việt Nam</MenuItem>
                                                                {/* Add other countries if needed */}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.country && <FormHelperText error>Vui lòng nhập quốc gia.</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Right Column */}
                            <Grid size={{ xs: 12, sm: 6 }}>
                                {/* Liên hệ */}
                                {/* <Grid size={{ xs: 12 }}>
                                    <Typography variant='h6' className='mb-2'>Liên hệ</Typography>
                                </Grid> */}
                                {/* Số điện thoại */}
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <Controller
                                            name='phoneNumber'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Số điện thoại (*)'
                                                    {...(errors.phoneNumber && { error: true, helperText: 'Vui lòng nhập số điện thoại.' })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* Email */}
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <Controller
                                            name='email'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type='email'
                                                    label='Email'
                                                    placeholder='Nguyenvana@gmail.com'
                                                    {...(errors.email && { error: true, helperText: 'Vui lòng nhập email.' })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                {/* Địa chỉ */}
                                {/* <Grid size={{ xs: 12 }} className='mb-4'>
                                    <Typography variant='h6' className='mb-2'>Địa chỉ</Typography>
                                </Grid> */}
                                {/* Tỉnh/Thành phố */}
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.province)}>Tỉnh/Thành phố (*)</InputLabel>
                                            <Controller
                                                name='province'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Tỉnh/Thành phố (*)' {...field} error={Boolean(errors.province)}>
                                                        {provinces.map((province) => (
                                                            <MenuItem key={province.code} value={province.code}>
                                                                {province.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.province && <FormHelperText error>Vui lòng nhập tỉnh/thành phố.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Quận/Huyện */}
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.district)}>Quận/Huyện (*)</InputLabel>
                                            <Controller
                                                name='district'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Quận/Huyện (*)' {...field} error={Boolean(errors.district)}>
                                                        {districts.map((district) => (
                                                            <MenuItem key={district.code} value={district.code}>
                                                                {district.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.district && <FormHelperText error>Vui lòng nhập quận/huyện.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                {/* Xã/Phường */}
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.ward)}>Xã/Phường (*)</InputLabel>
                                            <Controller
                                                name='ward'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Xã/Phường (*)' {...field} error={Boolean(errors.ward)}>
                                                        {wards.map((ward) => (
                                                            <MenuItem key={ward.code} value={ward.code}>
                                                                {ward.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.ward && <FormHelperText error>Vui lòng nhập xã/phường.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Số nhà/Tên đường */}
                                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                                        <Controller
                                            name='street'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Số nhà/Tên đường (*)'
                                                    placeholder='Ngõ 15, Duy Tân'
                                                    {...(errors.street && { error: true, helperText: 'Vui lòng nhập số nhà/tên đường.' })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Full Width Sections */}
                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Mặt trước */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <ImageDropzone
                                            title="Kéo thả file để upload (Mặt trước)"
                                            onUpload={(response) => {
                                                setValue('frontPhoto', response.data)
                                            }}
                                        />
                                    </Grid>
                                    {/* Mặt sau */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <ImageDropzone
                                            title="Kéo thả file để upload (Mặt sau)"
                                            onUpload={(response) => {
                                                setValue('backPhoto', response.data)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Loại thẻ */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.cardType)}>Loại thẻ</InputLabel>
                                            <Controller
                                                name='cardType'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Loại thẻ' {...field} error={Boolean(errors.cardType)}>
                                                        <MenuItem value='Căn cước công dân'>Căn cước công dân</MenuItem>
                                                        {/* Add other card types if needed */}
                                                    </Select>
                                                )}
                                            />
                                            {errors.cardType && <FormHelperText error>Vui lòng nhập loại thẻ.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Số CCCD */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='cccd'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Số CCCD (*)'
                                                    {...(errors.cccd && { error: true, helperText: 'Vui lòng nhập số CCCD.' })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Bằng lái */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.drivingLicenseType)}>Bằng lái</InputLabel>
                                            <Controller
                                                name='drivingLicenseType'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Bằng lái' {...field} error={Boolean(errors.drivingLicenseType)}>
                                                        {CONFIG.LicenseTypeSelectOption.map((option) => (
                                                            <MenuItem key={option.value} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.drivingLicenseType && <FormHelperText error>Vui lòng nhập bằng lái.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Loại */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.licenseType)}>Loại</InputLabel>
                                            <Controller
                                                name='licenseType'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Loại' {...field} error={Boolean(errors.licenseType)}>
                                                        {CONFIG.VehicleTypeSelectOption.map((option) => (
                                                            <MenuItem key={option.value} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.licenseType && <FormHelperText error>Vui lòng nhập loại.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Tổng tiền */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name='totalAmount'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    type='number' // Assuming total amount is a number
                                                    label='Tổng tiền'
                                                    {...(errors.totalAmount && { error: true, helperText: 'Vui lòng nhập tổng tiền.' })}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* Trạng thái thanh toán */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.paymentStatus)}>Trạng thái thanh toán</InputLabel>
                                            <Controller
                                                name='paymentStatus'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Trạng thái thanh toán' {...field} error={Boolean(errors.paymentStatus)}>
                                                        {CONFIG.IsPaidSelectOption.map((option) => (
                                                            <MenuItem key={option.value.toString()} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.paymentStatus && <FormHelperText error>Vui lòng nhập trạng thái thanh toán.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Khám sức khỏe */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.healthCheck)}>Khám sức khỏe</InputLabel>
                                            <Controller
                                                name='healthCheck'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Khám sức khỏe' {...field} error={Boolean(errors.healthCheck)}>
                                                        {CONFIG.HasCompletedHealthCheckSelectOption.map((option) => (
                                                            <MenuItem key={option.value.toString()} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.healthCheck && <FormHelperText error>Vui lòng nhập trạng thái khám sức khỏe.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Bằng ô tô */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.carLicense)}>Bằng ô tô</InputLabel>
                                            <Controller
                                                name='carLicense'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Bằng ô tô' {...field} error={Boolean(errors.carLicense)}>
                                                        {CONFIG.HasCarLicenseSelectOption.map((option) => (
                                                            <MenuItem key={option.value.toString()} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.carLicense && <FormHelperText error>Vui lòng nhập trạng thái bằng ô tô.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Grid container spacing={5}>
                                    {/* Xác nhận */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <FormControl fullWidth>
                                            <InputLabel error={Boolean(errors.confirmationStatus)}>Xác nhận</InputLabel>
                                            <Controller
                                                name='confirmationStatus'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Select label='Xác nhận' {...field} error={Boolean(errors.confirmationStatus)}>
                                                        {CONFIG.ApprovedOption.map((option) => (
                                                            <MenuItem key={option.value.toString()} value={option.label}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                            {errors.confirmationStatus && <FormHelperText error>Vui lòng nhập trạng thái xác nhận.</FormHelperText>}
                                        </FormControl>
                                    </Grid>
                                    {/* Ghi chú */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
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
                            </Grid>

                            {/* Button Row */}
                            <Grid size={{ xs: 12 }} className='flex gap-4 justify-center'>
                                <Button variant='outlined' type='reset' onClick={() => reset()}> {/* Swapped button order */}
                                    Reset
                                </Button>
                                <Button variant='contained' type='submit'>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default LicenseRegistrationForm
