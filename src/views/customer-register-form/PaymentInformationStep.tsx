'use client'

import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'
import { Step } from './index' // Import the Step type

// Define types based on your validation schema (adjust as needed)
type PaymentInformationForm = {
    // Add fields for payment information here, e.g., cardNumber, expiryDate, cvv
}

type PaymentInformationStepProps = {
    steps: Step[]; // Use the imported Step type
    handleBack: () => void;
    handleNext: () => void;
}

const PaymentInformationStep = ({ steps, handleBack, handleNext }: PaymentInformationStepProps) => {
    const { control, formState: { errors }, handleSubmit } = useFormContext<PaymentInformationForm>();

    // This function will be called by react-hook-form's handleSubmit with validated data
    const handlePaymentInformationSubmit = (data: PaymentInformationForm) => {
        console.log('Payment Information Data:', data); // Process step 3 data
        handleNext(); // Call parent's handleNext to move to the next step (or final submission)
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
                <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                        variant='outlined'
                        onClick={handleBack}
                        color='secondary'
                        startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                    >
                        Back
                    </Button>
                    <Button variant='contained' type='submit' endIcon={<i className='ri-check-line' />}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PaymentInformationStep 
