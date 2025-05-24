'use client'

import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'
import { Step } from './index' // Import the Step type
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import CONFIG from '@/configs/config'

// Define types based on your validation schema (adjust as needed)
type LicenseDetailsForm = {
    drivingLicenseType: string;
    healthCheck: string;
    carLicense: string;
}

type LicenseDetailsStepProps = {
    steps: Step[]; // Use the imported Step type
    handleBack: () => void;
    handleNext: () => void;
}

const LicenseDetailsStep = ({ steps, handleBack, handleNext }: LicenseDetailsStepProps) => {
    const { control, formState: { errors }, handleSubmit } = useFormContext<LicenseDetailsForm>();

    // This function will be called by react-hook-form's handleSubmit with validated data
    const handleLicenseDetailsSubmit = (data: LicenseDetailsForm) => {
        console.log('License Details Data:', data); // Process step 2 data
        handleNext(); // Call parent's handleNext to move to the next step
    };

    return (
        <form key={2} onSubmit={handleSubmit(handleLicenseDetailsSubmit)} className='h-full w-full'>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        {steps[2].title}
                    </Typography>
                    {steps[2].desc && <Typography variant='body2'>{steps[2].desc}</Typography>}
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        ĐĂNG KÝ
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
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

                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        THÔNG TIN KHÁC
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12 }}>
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

export default LicenseDetailsStep 
