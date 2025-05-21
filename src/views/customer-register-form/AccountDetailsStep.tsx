'use client'

import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'

// Define types based on your validation schema
type AccountDetailsForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type Step = { // Define a consistent Step type
    active: number;
    title: string;
    desc: string | null;
    Icon: any; // Use a more specific type if possible, e.g., React.ElementType
}

type AccountDetailsStepProps = {
    steps: Step[]; // Use the consistent Step type
    handleNext: () => void;
}

const AccountDetailsStep = ({ steps, handleNext }: AccountDetailsStepProps) => {
    const [isPasswordShown, setIsPasswordShown] = useState(false)
    const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

    const { control, formState: { errors }, handleSubmit } = useFormContext<AccountDetailsForm>();

    const handleClickShowPassword = () => setIsPasswordShown(show => !show)
    const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

    // This function will be called by react-hook-form's handleSubmit with validated data
    const handleAccountDetailsSubmit = (data: AccountDetailsForm) => {
        console.log('Account Details Data:', data); // Process step 0 data
        handleNext(); // Call parent's handleNext to move to the next step
    };

    return (
        // Pass the data handling function to handleSubmit
        // The button inside the form with type='submit' will trigger this handleSubmit
        <form onSubmit={handleSubmit(handleAccountDetailsSubmit)} className='h-full w-full'>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        {steps[0].title}
                    </Typography>
                    {steps[0].desc && <Typography variant='body2'>{steps[0].desc}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='username'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Username'
                                placeholder='johnDoe'
                                {...(errors.username && { error: true, helperText: errors.username.message })}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type='email'
                                label='Email'
                                placeholder='johndoe@gmail.com'
                                {...(errors.email && { error: true, helperText: errors.email.message })}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='password'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Password'
                                placeholder='············'
                                id='stepper-linear-validation-password'
                                type={isPasswordShown ? 'text' : 'password'}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    size='small'
                                                    edge='end'
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={e => e.preventDefault()}
                                                    aria-label='toggle password visibility'
                                                >
                                                    <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                                {...(errors.password && { error: true, helperText: errors.password.message })}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='confirmPassword'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Confirm Password'
                                placeholder='············'
                                id='stepper-linear-confirmPassword'
                                type={isConfirmPasswordShown ? 'text' : 'password'}
                                {...(errors['confirmPassword'] && { error: true, helperText: errors['confirmPassword'].message })}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    size='small'
                                                    edge='end'
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={e => e.preventDefault()}
                                                    aria-label='toggle password visibility'
                                                >
                                                    <i className={isConfirmPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                        variant='outlined'
                        disabled // Assuming back is disabled on the first step
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

export default AccountDetailsStep 
