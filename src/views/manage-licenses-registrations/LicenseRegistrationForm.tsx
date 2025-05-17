'use client'

// React Imports
import { useState } from 'react'

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

// Styled Component Imports
import { SCREEN_TYPE } from '@/types/Common'
import { List, ListItem, Typography } from '@mui/material'
import Link from '@/components/Link'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import CustomAvatar from '@/@core/components/mui/Avatar'
import ImageDropzone from '@/components/common/ImageDropzone'
// import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'

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
    photo3x4: File[]
    frontPhoto: File[]
    backPhoto: File[]
}

type LicenseRegistrationFormProps = {
    screenType: SCREEN_TYPE
    id?: string
}

const LicenseRegistrationForm = ({ screenType, id }: LicenseRegistrationFormProps) => {
    // States
    // const [isPasswordShown, setIsPasswordShown] = useState(false) // Password field is removed
    const [fileAvatar, setFileAvatar] = useState<File[]>([])

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
            country: 'Việt Nam', // Default to Vietnam based on image
            phoneNumber: '',
            email: '',
            province: '',
            district: '',
            ward: '',
            street: '',
            cardType: 'Căn cước công dân', // Default based on image
            cccd: '',
            drivingLicenseType: 'A1', // Default based on image
            licenseType: 'Xe máy', // Default based on image
            totalAmount: null,
            paymentStatus: 'Chưa thanh toán', // Default based on image
            healthCheck: 'Chưa khám', // Default based on image
            carLicense: 'Chưa có', // Default based on image
            confirmationStatus: 'Chưa duyệt', // Default based on image
            photo3x4: [],
            frontPhoto: [],
            backPhoto: []
        },
        mode: 'onChange'
    })

    const photo3x4 = watch('photo3x4')

    const onSubmit = handleSubmit((data) => {
        if (!data.photo3x4 || data.photo3x4.length === 0) {
            setValue('photo3x4', [], { shouldValidate: true })
            return
        }
        toast.success('Form Submitted')
    })

    return (
        <>
            <Card className='flex justify-between items-center mb-1 p-2'>
                <Typography className='uppercase font-bold'>Thêm mới học viên</Typography>{/* Updated title */}
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
                                                        onUpload={(files) => {
                                                            field.onChange(files || [])
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
                                                        {/* Add province options here */}
                                                        <MenuItem value='Option1'>Option 1</MenuItem>
                                                        <MenuItem value='Option2'>Option 2</MenuItem>
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
                                                        {/* Add district options here */}
                                                        <MenuItem value='Option1'>Option 1</MenuItem>
                                                        <MenuItem value='Option2'>Option 2</MenuItem>
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
                                                        {/* Add ward options here */}
                                                        <MenuItem value='Option1'>Option 1</MenuItem>
                                                        <MenuItem value='Option2'>Option 2</MenuItem>
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
                                            onUpload={(files) => setFileAvatar(files)}
                                        />
                                    </Grid>
                                    {/* Mặt sau */}
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <ImageDropzone
                                            title="Kéo thả file để upload (Mặt sau)"
                                            onUpload={(files) => setFileAvatar(files)}
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
                                                        <MenuItem value='A1'>A1</MenuItem>
                                                        {/* Add other license types if needed */}
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
                                                        <MenuItem value='Xe máy'>Xe máy</MenuItem>
                                                        {/* Add other types if needed */}
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
                                                        <MenuItem value='Chưa thanh toán'>Chưa thanh toán</MenuItem>
                                                        <MenuItem value='Đã thanh toán'>Đã thanh toán</MenuItem>
                                                        {/* Add other statuses if needed */}
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
                                                        <MenuItem value='Chưa khám'>Chưa khám</MenuItem>
                                                        <MenuItem value='Đã khám'>Đã khám</MenuItem>
                                                        {/* Add other statuses if needed */}
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
                                                        <MenuItem value='Chưa có'>Chưa có</MenuItem>
                                                        <MenuItem value='Đã có'>Đã có</MenuItem>
                                                        {/* Add other statuses if needed */}
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
                                                        <MenuItem value='Chưa duyệt'>Chưa duyệt</MenuItem>
                                                        <MenuItem value='Đã duyệt'>Đã duyệt</MenuItem>
                                                        {/* Add other statuses if needed */}
                                                    </Select>
                                                )}
                                            />
                                            {errors.confirmationStatus && <FormHelperText error>Vui lòng nhập trạng thái xác nhận.</FormHelperText>}
                                        </FormControl>
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
