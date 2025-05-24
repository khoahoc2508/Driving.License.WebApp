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
type PaymentInformationForm = {
    amount: number;
    isPaid: boolean;
    note?: string;
}

type PaymentInformationStepProps = {
    steps: Step[]; // Use the imported Step type
    handleBack: () => void;
    handleNext: (data?: any) => void;
}

const PaymentInformationStep = ({ steps, handleBack, handleNext }: PaymentInformationStepProps) => {
    const { control, formState: { errors }, handleSubmit } = useFormContext<PaymentInformationForm>();

    // This function will be called by react-hook-form's handleSubmit with validated data
    const handlePaymentInformationSubmit = (data: PaymentInformationForm) => {
        // Get all form data from all steps
        const allFormData = {
            ...data,
            // Add other form data from previous steps here
        };

        // Call the parent's onSubmit with all form data
        handleNext(allFormData);
    };

    return (
        <form key={3} onSubmit={handleSubmit(handlePaymentInformationSubmit)} className='h-full w-full'>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        {steps[3].title}
                    </Typography>
                    {steps[3].desc && <Typography variant='body2'>{steps[3].desc}</Typography>}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        THANH TOÁN
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Controller
                        name='amount'
                        control={control}
                        rules={{ required: 'Vui lòng nhập tổng tiền' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Tổng tiền (*)'
                                type='number'
                                error={!!errors.amount}
                                helperText={errors.amount?.message}
                                InputLabelProps={{ shrink: true }}
                                onChange={(event) => {
                                    const value = parseFloat(event.target.value);
                                    field.onChange(isNaN(value) ? '' : value);
                                }}
                            />
                        )}
                    />
                </Grid>
                {/* Trạng thái thanh toán */}
                <Grid size={{ xs: 12 }}>
                    <FormControl fullWidth error={!!errors.isPaid}>
                        <InputLabel>Trạng thái thanh toán (*)</InputLabel>
                        <Controller
                            name='isPaid'
                            control={control}
                            rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    label='Trạng thái thanh toán (*)'
                                    value={field.value ? 1 : 0}
                                    onChange={(event) => {
                                        field.onChange(event.target.value === 1);
                                    }}
                                >
                                    {CONFIG.IsPaidSelectOption.map((option) => (
                                        <MenuItem key={String(option.value)} value={option.value ? 1 : 0}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.isPaid && (
                            <FormHelperText>{errors.isPaid.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        GHI CHÚ
                    </Typography>
                </Grid>
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

                <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                        variant='outlined'
                        onClick={handleBack}
                        color='secondary'
                        startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                    >
                        Quay lại
                    </Button>
                    <Button variant='contained' type='submit' endIcon={<i className='ri-check-line' />}>
                        Lưu
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PaymentInformationStep 
