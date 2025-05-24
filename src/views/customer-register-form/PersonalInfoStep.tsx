'use client'

import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'
import { useFormContext } from 'react-hook-form'
import { FormControlLabel, RadioGroup, Radio } from '@mui/material'
import FileUploaderSingle from '@/components/common/FileUploaderSingle'
import CONFIG from '@/configs/config'

type PersonalInfoForm = {
    avatarUrl: string[];
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    street: string;
}

type Step = {
    active: number;
    title: string;
    desc: string | null;
    Icon: any;
}

type PersonalInfoStepProps = {
    steps: Step[];
    handleBack: () => void;
    handleNext: () => void;
    provinces: any[];
    districts: any[];
    wards: any[];
}

const PersonalInfoStep = ({ steps, handleBack, handleNext, provinces, districts, wards }: PersonalInfoStepProps) => {
    const { control, formState: { errors }, handleSubmit } = useFormContext<PersonalInfoForm>();

    const handlePersonalInfoSubmit = (data: PersonalInfoForm) => {
        console.log('PersonalInfo Data:', data);
        handleNext();
    };

    return (
        <form onSubmit={handleSubmit(handlePersonalInfoSubmit)} className='h-full w-full'>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        {steps[1].title}
                    </Typography>
                    {steps[1].desc && <Typography variant='body2'>{steps[1].desc}</Typography>}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='avatarUrl'
                        control={control}
                        rules={{ required: 'Vui lòng tải lên ảnh 3x4' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.avatarUrl} className='h-full'>
                                <FileUploaderSingle
                                    field={field}
                                    error={!!errors.avatarUrl}
                                    helperText={errors.avatarUrl?.message}
                                    description='Tải lên ảnh 3x4 (*)'
                                />
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='fullName'
                        control={control}
                        rules={{ required: 'Vui lòng nhập họ tên' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Họ tên (*)'
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='dateOfBirth'
                        control={control}
                        rules={{ required: 'Vui lòng chọn ngày sinh' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type='date'
                                label='Ngày sinh (*)'
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='gender'
                        control={control}
                        rules={{ required: 'Vui lòng chọn giới tính' }}
                        render={({ field }) => (
                            <FormControl error={!!errors.gender}>
                                <RadioGroup row {...field} name='gender-buttons-group'>
                                    {CONFIG.SexTypeSelectOption.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            value={option.label}
                                            control={<Radio />}
                                            label={option.label}
                                        />
                                    ))}
                                </RadioGroup>
                                {errors.gender && (
                                    <FormHelperText>{errors.gender.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        LIÊN HỆ
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='phoneNumber'
                        control={control}
                        rules={{ required: 'Vui lòng nhập số điện thoại' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Số điện thoại (*)'
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='email'
                        control={control}
                        rules={{ required: 'Vui lòng nhập email' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Email (*)'
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        ĐỊA CHỈ
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='province'
                        control={control}
                        rules={{ required: 'Vui lòng chọn tỉnh/thành phố' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.province}>
                                <InputLabel>Tỉnh/Thành phố (*)</InputLabel>
                                <Select {...field} label='Tỉnh/Thành phố (*)'>
                                    {provinces.map((province) => (
                                        <MenuItem key={province.code} value={province.code.toString()}>
                                            {province.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.province && (
                                    <FormHelperText>{errors.province.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='district'
                        control={control}
                        rules={{ required: 'Vui lòng chọn quận/huyện' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.district}>
                                <InputLabel>Quận/Huyện (*)</InputLabel>
                                <Select {...field} label='Quận/Huyện (*)'>
                                    {districts.map((district) => (
                                        <MenuItem key={district.code} value={district.code.toString()}>
                                            {district.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.district && (
                                    <FormHelperText>{errors.district.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='ward'
                        control={control}
                        rules={{ required: 'Vui lòng chọn phường/xã' }}
                        render={({ field }) => (
                            <FormControl fullWidth error={!!errors.ward}>
                                <InputLabel>Phường/Xã (*)</InputLabel>
                                <Select {...field} label='Phường/Xã (*)'>
                                    {wards.map((ward) => (
                                        <MenuItem key={ward.code} value={ward.code.toString()}>
                                            {ward.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.ward && (
                                    <FormHelperText>{errors.ward.message}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='street'
                        control={control}
                        rules={{ required: 'Vui lòng nhập địa chỉ' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Địa chỉ (*)'
                                error={!!errors.street}
                                helperText={errors.street?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                        variant='outlined'
                        onClick={handleBack}
                        color='secondary'
                        startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                    >
                        Back
                    </Button>
                    <Button
                        variant='contained'
                        type='submit'
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PersonalInfoStep 
