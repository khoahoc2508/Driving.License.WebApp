'use client'

// React Imports
import { ReactNode, useState, useEffect } from 'react'

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
import { email, object, minLength, string, array, forward, pipe, nonEmpty, check, number, union, instance, boolean, minValue } from 'valibot'
import * as v from 'valibot'

// Component Imports
import StepperWrapper from '@core/styles/stepper'
import StepperCustomDot from '@components/stepper-dot'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Grid2 from '@mui/material/Grid2'

// Step Component Imports
import AccountDetailsStep from './CitizenCard'
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
import CitizendCard from './CitizenCard'

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
    citizenCardId: pipe(string(), nonEmpty('Vui lòng nhập số CCCD')),
    citizenCardDateOfIssue: pipe(string(), nonEmpty('Vui lòng nhập ngày cấp')),
    citizenCardPlaceOfIssue: pipe(string(), nonEmpty('Vui lòng nhập nơi cấp'))
})

const accountSchema = accountValidationSchema

const personalSchema = object({
    avatarUrl: pipe(array(union([string(), instance(File)])), nonEmpty('Vui lòng tải lên ảnh 3x4')),
    fullName: pipe(string(), nonEmpty('Vui lòng nhập họ tên')),
    dateOfBirth: pipe(string(), nonEmpty('Vui lòng chọn ngày sinh')),
    gender: pipe(string(), nonEmpty('Vui lòng chọn giới tính')),
    phoneNumber: pipe(string(), nonEmpty('Vui lòng nhập số điện thoại')),
    email: pipe(string(), nonEmpty('Vui lòng nhập email'), email('Email không hợp lệ')),
    province: pipe(string(), nonEmpty('Vui lòng chọn tỉnh/thành phố')),
    district: pipe(string(), nonEmpty('Vui lòng chọn quận/huyện')),
    ward: pipe(string(), nonEmpty('Vui lòng chọn phường/xã')),
    street: pipe(string(), nonEmpty('Vui lòng nhập địa chỉ'))
})


const licenseDetailsSchema = object({
    licenseType: pipe(number()),
    hasCompletedHealthCheck: pipe(boolean()),
    hasCarLicense: pipe(boolean())
});

type LicenseDetailsFormValues = {
    licenseType: number;
    hasCompletedHealthCheck: boolean;
    hasCarLicense: boolean;
};

const paymentInformationSchema = object({
    amount: pipe(number(), minValue(0, 'Tổng tiền phải lớn hơn 0')),
    isPaid: pipe(boolean()),
    note: string(),
});

type PaymentInformationFormValues = {
    amount: number;
    isPaid: boolean;
    note: string;
};

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
    const [provinces, setProvinces] = useState<any[]>([])
    const [districts, setDistricts] = useState<any[]>([])
    const [wards, setWards] = useState<any[]>([])

    // Hooks
    const citizenCardFormMethods = useForm({
        resolver: valibotResolver(accountSchema),
        defaultValues: {
            citizenCardId: '',
            citizenCardDateOfIssue: '',
            citizenCardPlaceOfIssue: '',
        }
    })

    const personalFormMethods = useForm({
        resolver: valibotResolver(personalSchema),
        defaultValues: {
            avatarUrl: [],
            fullName: '',
            dateOfBirth: '',
            gender: '',
            phoneNumber: '',
            email: '',
            province: '',
            district: '',
            ward: '',
            street: ''
        }
    })

    const licenseDetailsFormMethods = useForm<LicenseDetailsFormValues>({
        resolver: valibotResolver(licenseDetailsSchema),
        defaultValues: {
            licenseType: 0,
            hasCompletedHealthCheck: false,
            hasCarLicense: false
        }
    });

    const paymentInformationFormMethods = useForm<PaymentInformationFormValues>({
        resolver: valibotResolver(paymentInformationSchema),
        defaultValues: {
            amount: 0,
            isPaid: false,
            note: '',
        }
    });

    const socialFormMethods = useForm({
        resolver: valibotResolver(socialSchema),
        defaultValues: {
            twitter: '',
            facebook: '',
            google: '',
            linkedIn: ''
        }
    })

    // Fetch provinces on component mount
    useEffect(() => {
        fetchProvinces()
    }, [])

    // Watch for province changes to fetch districts
    useEffect(() => {
        const subscription = personalFormMethods.watch((value, { name }) => {
            if (name === 'province' && value.province) {
                fetchDistricts(value.province)
            }
            if (name === 'district' && value.district) {
                fetchWards(value.district)
            }
        })
        return () => subscription.unsubscribe()
    }, [personalFormMethods.watch])

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
            personalFormMethods.setValue('district', '')
            personalFormMethods.setValue('ward', '')
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
            personalFormMethods.setValue('ward', '')
        } catch (error) {
            console.error('Error fetching wards:', error)
            toast.error('Lỗi khi tải danh sách phường/xã')
        }
    }

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
        citizenCardFormMethods.reset({
            citizenCardId: '',
            citizenCardDateOfIssue: '',
            citizenCardPlaceOfIssue: '',
        })
        personalFormMethods.reset({
            avatarUrl: [],
            fullName: '',
            dateOfBirth: '',
            gender: '',
            phoneNumber: '',
            email: '',
            province: '',
            district: '',
            ward: '',
            street: ''
        })
        licenseDetailsFormMethods.reset({
            licenseType: 0,
            hasCompletedHealthCheck: false,
            hasCarLicense: false
        });
        paymentInformationFormMethods.reset({
            amount: 0,
            isPaid: false,
            note: '',
        });
        socialFormMethods.reset({ twitter: '', facebook: '', google: '', linkedIn: '' })
    }

    // // Main onSubmit function in index.tsx to trigger current step's validation
    // const onSubmit = async () => {
    //     let isValid = false;
    //     switch (activeStep) {
    //         case 0:
    //             isValid = await citizenCardFormMethods.trigger(); // Trigger validation
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
                    <FormProvider {...citizenCardFormMethods}>
                        <CitizendCard steps={steps} handleNext={handleNext} />
                    </FormProvider>
                )
            case 1:
                return (
                    <FormProvider {...personalFormMethods}>
                        <PersonalInfoStep
                            steps={steps}
                            handleBack={handleBack}
                            handleNext={handleNext}
                            provinces={provinces}
                            districts={districts}
                            wards={wards}
                        />
                    </FormProvider>
                )
            case 2:
                return (
                    <FormProvider {...licenseDetailsFormMethods}>
                        <LicenseDetailsStep steps={steps} handleBack={handleBack} handleNext={handleNext} />
                    </FormProvider>
                )
            case 3:
                return (
                    <FormProvider {...paymentInformationFormMethods}>
                        <PaymentInformationStep steps={steps} handleBack={handleBack} handleNext={handleNext} />
                    </FormProvider>
                )
            default:
                return <Typography color='text.primary'>Unknown stepIndex</Typography>
        }
    }


    return (
        <Card className='h-full flex w-full justify-center'>
            <Grid2 container width={{ xs: '100%', md: '60%' }}>
                <Grid size={{ xs: 0, md: 5 }}>
                    {/* Cột trái */}
                    <CardContent className='h-full hidden md:block pr-0'>
                        <div className='right h-full w-full flex bg-[#2289E61A]'>
                            <div className='intro__container mt-auto mb-auto h-[48px] w-full flex justify-start items-center bg-[#ffffff] p-3 gap-2'>
                                <div className='intro__name font-normal text-2xl text-[#425566]'>{titlePage}</div>
                            </div>
                        </div>
                    </CardContent>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
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
                                            (citizenCardFormMethods.formState.errors.citizenCardId ||
                                                citizenCardFormMethods.formState.errors.citizenCardDateOfIssue ||
                                                citizenCardFormMethods.formState.errors.citizenCardPlaceOfIssue) &&
                                            activeStep === 0
                                        ) {
                                            labelProps.error = true
                                        } else if (
                                            (personalFormMethods.formState.errors.avatarUrl ||
                                                personalFormMethods.formState.errors.fullName ||
                                                personalFormMethods.formState.errors.dateOfBirth ||
                                                personalFormMethods.formState.errors.gender ||
                                                personalFormMethods.formState.errors.phoneNumber ||
                                                personalFormMethods.formState.errors.email ||
                                                personalFormMethods.formState.errors.province ||
                                                personalFormMethods.formState.errors.district ||
                                                personalFormMethods.formState.errors.ward ||
                                                personalFormMethods.formState.errors.street) &&
                                            activeStep === 1
                                        ) {
                                            labelProps.error = true
                                        } else if ( /* Adjust error checking for new steps 2 and 3 */
                                            (licenseDetailsFormMethods.formState.errors.licenseType ||
                                                licenseDetailsFormMethods.formState.errors.hasCompletedHealthCheck ||
                                                licenseDetailsFormMethods.formState.errors.hasCarLicense) &&
                                            activeStep === 2
                                        ) {
                                            labelProps.error = true
                                        } else if ( /* Add error checking for step 3 (Payment Information) */
                                            (paymentInformationFormMethods.formState.errors.amount ||
                                                paymentInformationFormMethods.formState.errors.isPaid ||
                                                paymentInformationFormMethods.formState.errors.note) &&
                                            activeStep === 3
                                        ) {
                                            labelProps.error = true
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
                                    <Typography className='mlb-2 mli-1 text-center' color='text.primary'>
                                        Đăng ký thành công 🎉
                                    </Typography>
                                    <Typography className='mlb-2 mli-1 text-center' color='text.primary'>
                                        Chúng tôi đã nhận được đơn đăng ký của bạn. Chúng tôi sẽ liên hệ với bạn sớm nhất.
                                    </Typography>
                                    <Typography className='mlb-2 mli-1 text-center' color='text.primary'>
                                        Cảm ơn bạn đã tin tưởng và ủng hộ!
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
