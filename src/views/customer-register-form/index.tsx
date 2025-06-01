'use client'

// React Imports
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

// MUI Imports
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import type { StepperProps } from '@mui/material/Stepper';
import MuiStepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Third-party Imports
import { valibotResolver } from '@hookform/resolvers/valibot';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { array, boolean, email, instance, minLength, nonEmpty, number, object, pipe, string, union, null_, custom, undefined_, nan } from 'valibot';

// Component Imports
import Grid2 from '@mui/material/Grid2';

import {
  IconBookUpload,
  IconCertificate2,
  IconCreditCardPay,
  IconUserEdit
} from '@tabler/icons-react';

import StepperCustomDot from '@components/stepper-dot';
import StepperWrapper from '@core/styles/stepper';

// Step Component Imports
import LicenseDetailsStep from './LicenseDetailsStep';
import PaymentInformationStep from './PaymentInformationStep';
import PersonalInfoStep from './PersonalInfoStep';


import CONFIG from '@/configs/config';
import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI';
import UploadAPI from '@/libs/api/uploadAPI';
import type { LicenseRegistrationCustomerResquest } from '@/types/LicensesRegistrations';
import CitizendCard from './CitizenCard';

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

const accountValidationSchema = object({
  citizenCardFrontImgUrl: pipe(array(union([string(), instance(File)])), nonEmpty('Vui lòng tải lên ảnh mặt trước CCCD')),
  citizenCardBackImgUrl: pipe(array(union([string(), instance(File)])), nonEmpty('Vui lòng tải lên ảnh mặt sau CCCD')),
  citizenCardId: pipe(string(), nonEmpty('Vui lòng nhập số CCCD')),
  citizenCardDateOfIssue: pipe(
    union([string(), instance(Date), null_()]),
    custom<string | Date | null>((value) => {
      if (value === null || (typeof value === 'string' && value.trim() === '')) {
        return false;
      }


      return true;
    }, 'Vui lòng nhập ngày cấp')
  ),
  citizenCardPlaceOfIssue: pipe(string(), nonEmpty('Vui lòng nhập nơi cấp'))
})

const accountSchema = accountValidationSchema

const personalSchema = object({
  avatarUrl: pipe(array(union([string(), instance(File)])), nonEmpty('Vui lòng tải lên ảnh 3x4')),
  fullName: pipe(string(), nonEmpty('Vui lòng nhập họ tên')),
  birthday: pipe(
    union([string(), instance(Date), null_()]),
    custom<string | Date | null>((value) => {
      if (value === null || (typeof value === 'string' && value.trim() === '')) {
        return false;
      }


      return true;
    }, 'Vui lòng chọn ngày sinh')
  ),
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
  amount: pipe(
    union([number(), null_(), undefined_(), nan()]),
    custom<number | null | undefined>((value) => {
      if (value === null || value === undefined) {
        return false;
      }

      if (typeof value !== 'number' || isNaN(value) || value <= 0) {
        return false;
      }


      return true;
    }, 'Vui lòng nhập tổng tiền hợp lệ và lớn hơn 0')
  ),
  isPaid: pipe(boolean()),
  note: string(),
});

type PaymentInformationFormValues = {
  amount: number | null | undefined;
  isPaid: boolean;
  note: string;
};

const socialSchema = object({
  twitter: pipe(string(), nonEmpty('This field is required'), minLength(1)),
  facebook: pipe(string(), nonEmpty('This field is required'), minLength(1)),
  google: pipe(string(), nonEmpty('This field is required'), minLength(1)),
  linkedIn: pipe(string(), nonEmpty('This field is required'), minLength(1))
})

type FormValues = {

  // Citizen Card fields
  citizenCardId: string;
  citizenCardDateOfIssue: Date | null | undefined;
  citizenCardPlaceOfIssue: string;
  citizenCardFrontImgUrl: File[];
  citizenCardBackImgUrl: File[];

  // Personal Info fields
  avatarUrl: File[];
  fullName: string;
  birthday: Date | null | undefined;
  gender: string;
  phoneNumber: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  street: string;

  // License Details fields
  licenseType: number;
  hasCompletedHealthCheck: boolean;
  hasCarLicense: boolean;

  // Payment Information fields
  amount: number | null | undefined;
  isPaid: boolean;
  note: string;
};

type Props = {
  titlePage: ReactNode
  vehicleTypePage: any
}

// Main Component
const Page = ({ titlePage, vehicleTypePage }: Props) => {
  const searchParams = useSearchParams()
  const urlOwnerId = searchParams.get('ownerId')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false)
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormValues | null>(null)

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
      citizenCardDateOfIssue: null,
      citizenCardPlaceOfIssue: '',
      citizenCardFrontImgUrl: [],
      citizenCardBackImgUrl: [],
    }
  })

  const personalFormMethods = useForm({
    resolver: valibotResolver(personalSchema),
    defaultValues: {
      avatarUrl: [],
      fullName: '',
      birthday: null,
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
      hasCarLicense: vehicleTypePage === CONFIG.VehicleType.Car ? true : false
    }
  });

  const paymentInformationFormMethods = useForm<PaymentInformationFormValues>({
    resolver: valibotResolver(paymentInformationSchema),
    defaultValues: {
      amount: undefined,
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

  // Set default values based on vehicle type
  useEffect(() => {
    if (vehicleTypePage === CONFIG.VehicleType.Car) {
      licenseDetailsFormMethods.setValue('hasCarLicense', true);
    }
  }, [vehicleTypePage]);

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
  const handleNext = (data?: any) => {
    if (activeStep === steps.length - 1) {
      // On the last step, collect all form data and submit
      const allFormData = {
        ...citizenCardFormMethods.getValues(),
        ...personalFormMethods.getValues(),
        ...licenseDetailsFormMethods.getValues(),
        ...paymentInformationFormMethods.getValues(),
        ...data // Include any additional data from the last step
      };

      setFormDataToSubmit(allFormData)
      setOpenConfirmDialog(true)
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    citizenCardFormMethods.reset({
      citizenCardId: '',
      citizenCardDateOfIssue: null,
      citizenCardPlaceOfIssue: '',
      citizenCardFrontImgUrl: [],
      citizenCardBackImgUrl: [],
    })
    personalFormMethods.reset({
      avatarUrl: [],
      fullName: '',
      birthday: null,
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
      hasCarLicense: vehicleTypePage === CONFIG.VehicleType.Car ? true : false
    });
    paymentInformationFormMethods.reset({
      amount: undefined,
      isPaid: false,
      note: '',
    });
    socialFormMethods.reset({ twitter: '', facebook: '', google: '', linkedIn: '' })
  }

  const handleConfirmSubmit = () => {
    if (formDataToSubmit) {
      onSubmit(formDataToSubmit)
    }

    setOpenConfirmDialog(false)
  }

  const handleCancelSubmit = () => {
    setOpenConfirmDialog(false)
    setFormDataToSubmit(null)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const [avatarResult, frontImgResult, backImgResult] = await Promise.all([
        data.avatarUrl?.length > 0 ? UploadAPI.uploadFiles(data.avatarUrl) : Promise.resolve(null),
        data.citizenCardFrontImgUrl?.length > 0 ? UploadAPI.uploadFiles(data.citizenCardFrontImgUrl) : Promise.resolve(null),
        data.citizenCardBackImgUrl?.length > 0 ? UploadAPI.uploadFiles(data.citizenCardBackImgUrl) : Promise.resolve(null)
      ]);

      debugger;

      const apiData: LicenseRegistrationCustomerResquest = {
        licenseType: CONFIG.LicenseTypeSelectOption.find(opt => opt.value === data.licenseType)?.value as 0 | 1 | 2 | 3 || 0,
        hasCarLicense: data.hasCarLicense,
        hasCompletedHealthCheck: data.hasCompletedHealthCheck,
        hasApproved: false,
        ownerId: urlOwnerId || '',
        person: {
          avatarUrl: avatarResult?.data[0]?.relativeUrl || '',
          fullName: data.fullName,
          birthday: data.birthday ? `${data.birthday.getFullYear()}-${(data.birthday.getMonth() + 1).toString().padStart(2, '0')}-${data.birthday.getDate().toString().padStart(2, '0')}` : '',
          sex: data.gender === CONFIG.SexTypeMappingText[1] ? 1 :
            data.gender === CONFIG.SexTypeMappingText[0] ? 0 :
              2,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: {
            provinceCode: data.province,
            districtCode: data.district,
            wardCode: data.ward,
            addressDetail: data.street
          },
          citizenCardId: data.citizenCardId,
          citizenCardDateOfIssue: data.citizenCardDateOfIssue ? `${data.citizenCardDateOfIssue.getFullYear()}-${(data.citizenCardDateOfIssue.getMonth() + 1).toString().padStart(2, '0')}-${data.citizenCardDateOfIssue.getDate().toString().padStart(2, '0')}` : '',
          citizenCardPlaceOfIssue: data.citizenCardPlaceOfIssue,
          citizenCardFrontImgUrl: frontImgResult?.data[0]?.relativeUrl || '',
          citizenCardBackImgUrl: backImgResult?.data[0]?.relativeUrl || ''
        },
        note: data.note,
        isPaid: data.isPaid,
        amount: data.amount ?? undefined,
        vehicleType: vehicleTypePage
      };

      const response = await LicenseRegistrationAPI.createLicensesRegistrationsForCustomer(apiData);

      if (response.data?.success) {
        toast.success('Đăng ký thành công!');
        setOpenSuccessDialog(true);
      } else {
        toast.error(response.data?.message || 'Đăng ký thất bại.');
      }

    } catch (error) {
      console.error('API call failed:', error);
      toast.error('Đã xảy ra lỗi khi đăng ký.');
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    handleReset();
  };

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
            <LicenseDetailsStep
              steps={steps}
              handleBack={handleBack}
              handleNext={handleNext}
              vehicleTypePage={vehicleTypePage}
            />
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
    <>
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
                        (
                          citizenCardFormMethods.formState.errors.citizenCardFrontImgUrl ||
                          citizenCardFormMethods.formState.errors.citizenCardBackImgUrl ||
                          citizenCardFormMethods.formState.errors.citizenCardId ||
                          citizenCardFormMethods.formState.errors.citizenCardDateOfIssue ||
                          citizenCardFormMethods.formState.errors.citizenCardPlaceOfIssue) &&
                        activeStep === 0
                      ) {
                        labelProps.error = true
                      } else if (
                        (personalFormMethods.formState.errors.avatarUrl ||
                          personalFormMethods.formState.errors.fullName ||
                          personalFormMethods.formState.errors.birthday ||
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
                        Làm mới
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

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelSubmit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác Nhận Đăng Ký
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn xác nhận thông tin đăng ký chính xác. Hoàn thành đăng ký?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelSubmit} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title" className="text-center">
          Đăng ký thành công 🎉
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description" className="text-center">
            <Typography component="span" className='mb-2' color='text.primary'>
              Chúng tôi đã nhận được đơn đăng ký của bạn. Chúng tôi sẽ liên hệ với bạn sớm nhất.
            </Typography>
            <Typography component="span" color='text.primary'>
              Cảm ơn bạn đã tin tưởng và ủng hộ!
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="justify-center">
          <Button onClick={handleCloseSuccessDialog} variant="contained" color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Page
