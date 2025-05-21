'use client'

import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'
import { Step } from './index' // Import the Step type

// Define types based on your validation schema (adjust as needed)
type LicenseDetailsForm = {
    // Add fields for license details here, e.g., licenseNumber, issueDate, expiryDate
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
                {/* Add form fields for license details here */}
                {/* Example: */}
                {/*
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='licenseNumber'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='License Number'
                placeholder='ABC-12345'
                {...(errors.licenseNumber && { error: true, helperText: errors.licenseNumber.message })}
              />
            )}
          />
        </Grid>
        */}
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
