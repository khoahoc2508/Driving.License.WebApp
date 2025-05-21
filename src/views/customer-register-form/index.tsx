'use client'

// React Imports
import { ReactNode, useState } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MuiStepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import type { StepperProps } from '@mui/material/Stepper'

// Third-party Imports
import { toast } from 'react-toastify'
import { Controller, useForm, FormProvider, useFormContext } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, array, forward, pipe, nonEmpty, check } from 'valibot'

// Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Grid2 from '@mui/material/Grid2'

// Step Component Imports
import AccountDetailsStep from './AccountDetailsStep'
import PersonalInfoStep from './PersonalInfoStep'
import LicenseDetailsStep from './LicenseDetailsStep'
import PaymentInformationStep from './PaymentInformationStep'

import {
    IconBookUpload,
    IconCertificate2,
    IconCreditCardPay,
    IconExclamationCircle,
    IconUserEdit
} from '@tabler/icons-react'

// Define a consistent Step type used across components
export type Step = {
    active: number;
    title: string;
    desc: string | null; // Can be string or null
    Icon: any; // Use a more specific type if possible, e.g., React.ElementType
}

// Vars
const steps: Step[] = [
    {
        active: 0,
        title: 'Tải lên CCCD',
        desc: 'Căn cước chụp rõ mặt trước',
        Icon: IconBookUpload
    },
    {
        active: 1,
        title: 'Cập nhật thông tin',
        desc: null,
        Icon: IconUserEdit
    },
    {
        active: 2,
        title: 'Thông tin bằng lái',
        desc: null,
        Icon: IconCertificate2
    },
    { active: 3, title: 'Thông tin thanh toán', desc: null, Icon: IconCreditCardPay }
]

// Styled Components
const Stepper = styled(MuiStepper)<StepperProps>(({ theme }) => ({
    justifyContent: 'center',
    '& .MuiStep-root': {
        '&:first-of-type': {
            paddingInlineStart: 0
        },
        '&:last-of-type': {
            paddingInlineEnd: 0
        },
        [theme.breakpoints.down('md')]: {
            paddingInline: 0
        }
    }
}))

// Validation Schemas (moved outside the component)
const accountValidationSchema = object({
    username: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    email: pipe(string(), nonEmpty('This field is required'), email('Please enter a valid email address')),
    password: pipe(
        string(),
        nonEmpty('This field is required'),
        minLength(8, 'Password must be at least 8 characters long')
    ),
    confirmPassword: pipe(string(), nonEmpty('This field is required'), minLength(1))
})

const accountSchema = pipe(
    accountValidationSchema,
    forward(
        check(input => input.password === input.confirmPassword, 'Passwords do not match.'),
        ['confirmPassword']
    )
)

const personalSchema = object({
    firstName: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    lastName: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    country: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    language: pipe(array(string()), nonEmpty('This field is required'), minLength(1))
})

const socialSchema = object({
    twitter: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    facebook: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    google: pipe(string(), nonEmpty('This field is required'), minLength(1)),
    linkedIn: pipe(string(), nonEmpty('This field is required'), minLength(1))
})

type Props = {
    titlePage: ReactNode
    vehicleTypePage: any
    ownerId?: string
}

// Main Component
const index = ({ titlePage, vehicleTypePage, ownerId }: Props) => {

    // States
    const [activeStep, setActiveStep] = useState(0)

    // Hooks
    const accountFormMethods = useForm({
        resolver: valibotResolver(accountSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const personalFormMethods = useForm({
        resolver: valibotResolver(personalSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            country: '',
            language: []
        }
    })

    const socialFormMethods = useForm({
        resolver: valibotResolver(socialSchema),
        defaultValues: {
            twitter: '',
            facebook: '',
            google: '',
            linkedIn: ''
        }
    }) // Note: socialSchema was used for the 3rd step in the original code, but the new steps define 4. Adjust schema for step 3 and 4 as needed.

    // Function to handle moving to the next step
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        // Optionally, collect and process form data here after successful validation of the current step
        if (activeStep === steps.length - 1) {
            toast.success('Form Submitted')
            // Final submission logic here
        }
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
        accountFormMethods.reset({ email: '', username: '', password: '', confirmPassword: '' })
        personalFormMethods.reset({ firstName: '', lastName: '', country: '', language: [] })
        socialFormMethods.reset({ twitter: '', facebook: '', google: '', linkedIn: '' }) // Adjust based on actual step 4 schema
    }

    // // Main onSubmit function in index.tsx to trigger current step's validation
    // const onSubmit = async () => {
    //     let isValid = false;
    //     switch (activeStep) {
    //         case 0:
    //             isValid = await accountFormMethods.trigger(); // Trigger validation
    //             if (isValid) handleNext();
    //             break;
    //         case 1:
    //             isValid = await personalFormMethods.trigger(); // Trigger validation
    //             if (isValid) handleNext();
    //             break;
    //         case 2:
    //             // Assuming socialFormMethods for step 2 for now, adjust later
    //             isValid = await socialFormMethods.trigger(); // Trigger validation
    //             if (isValid) handleNext();
    //             break;
    //         case 3:
    //             // Assuming socialFormMethods for step 3 for now, adjust later
    //             isValid = await socialFormMethods.trigger(); // Trigger validation
    //             if (isValid) { /* Optionally handle final submission here */ handleNext(); } // Last step submits
    //             break;
    //         default:
    //             break;
    //     }
    // };

    const renderStepContent = (activeStep: number) => {
        switch (activeStep) {
            case 0:
                return (
                    <FormProvider {...accountFormMethods}>
                        <AccountDetailsStep steps={steps} handleNext={handleNext} />
                    </FormProvider>
                )
            case 1:
                return (
                    <FormProvider {...personalFormMethods}>
                        <PersonalInfoStep steps={steps} handleBack={handleBack} handleNext={handleNext} Languages={Languages} />
                    </FormProvider>
                )
            case 2:
                return (
                    <FormProvider {...socialFormMethods}> {/* Assuming socialFormMethods will be used for step 2 (License Details) */}
                        <LicenseDetailsStep steps={steps} handleBack={handleBack} handleNext={handleNext} />
                    </FormProvider>
                )
            case 3:
                return (
                    <FormProvider {...socialFormMethods}> {/* Placeholder, replace with actual form methods for step 3 (Payment Information) */}
                        <PaymentInformationStep steps={steps} handleBack={handleBack} handleNext={handleNext} />
                    </FormProvider>
                )
            default:
                return <Typography color='text.primary'>Unknown stepIndex</Typography>
        }
    }

    // Vars (moved outside the component or kept if needed)
    const Languages = ['English', 'French', 'Spanish', 'Portuguese', 'Italian', 'German', 'Arabic'] // Keep if used here, otherwise move to component

    return (
        <Card className='h-full flex w-full'>
            <Grid2 container width={'100%'}>
                <Grid size={{ xs: 0, md: 3 }}>
                    {/* Cột trái */}
                    <CardContent className='h-full hidden md:block'>
                        <div className='right h-full w-full flex bg-[#2289E61A]'>
                            <div className='intro__container mt-auto mb-auto h-[48px] w-full flex justify-start items-center bg-[#ffffff] p-3 gap-2'>
                                <div className='intro__name font-normal text-2xl text-[#425566]'>{titlePage}</div>
                            </div>
                        </div>
                    </CardContent>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    {/* Cột phải */}
                    <CardContent className='flex-1 w-full pl-0'> {/* Removed padding classes here */}
                        <StepperWrapper>
                            <Stepper activeStep={activeStep} orientation="horizontal" className='p-4'>
                                {steps.map((label, index) => {
                                    const labelProps: {
                                        error?: boolean
                                    } = {}

                                    // Error logic based on active step and form errors
                                    // Trigger validation on step change or button click to update errors
                                    // This part might need more complex logic if you want to show errors for previous steps
                                    if (index === activeStep) {
                                        if (
                                            (accountFormMethods.formState.errors.email ||
                                                accountFormMethods.formState.errors.username ||
                                                accountFormMethods.formState.errors.password ||
                                                accountFormMethods.formState.errors['confirmPassword']) &&
                                            activeStep === 0
                                        ) {
                                            labelProps.error = true
                                        } else if (
                                            (personalFormMethods.formState.errors.firstName ||
                                                personalFormMethods.formState.errors.lastName ||
                                                personalFormMethods.formState.errors.country ||
                                                personalFormMethods.formState.errors.language) &&
                                            activeStep === 1
                                        ) {
                                            labelProps.error = true
                                        } else if ( /* Adjust error checking for new steps 2 and 3 */
                                            (socialFormMethods.formState.errors.google || socialFormMethods.formState.errors.twitter || socialFormMethods.formState.errors.facebook || socialFormMethods.formState.errors.linkedIn) && // This still uses old social errors
                                            activeStep === 2
                                        ) {
                                            labelProps.error = true
                                        } else if ( /* Add error checking for step 3 (Payment Information) */
                                            // Add logic for step 3 errors here
                                            activeStep === 3
                                        ) {
                                            // labelProps.error = true; // Set to true if errors exist
                                        }
                                        else {
                                            labelProps.error = false
                                        }
                                    } else if (index < activeStep) {
                                        // Optionally mark past steps with errors if needed
                                    } else {
                                        // Future steps
                                    }

                                    return (
                                        <Step key={index}>
                                            <StepLabel
                                                {...labelProps}
                                                slots={{
                                                    stepIcon: StepperCustomDot
                                                }}
                                            >
                                                <div className='step-label'>
                                                    {<label.Icon size={30} />}
                                                </div>
                                            </StepLabel>
                                        </Step>
                                    )
                                })}
                            </Stepper>
                        </StepperWrapper>

                        <Divider />
                        <CardContent className='h-full'>
                            {activeStep === steps.length ? (
                                <>
                                    <Typography className='mlb-2 mli-1' color='text.primary'>
                                        All steps are completed!
                                    </Typography>
                                    <div className='flex justify-end mt-4'>
                                        <Button variant='contained' onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                renderStepContent(activeStep)
                            )}
                        </CardContent>
                    </CardContent>
                </Grid>
            </Grid2>
        </Card>
    )
}

export default index
