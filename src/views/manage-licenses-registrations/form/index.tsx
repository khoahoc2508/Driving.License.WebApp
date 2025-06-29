'use client'

// React Imports
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

// Third-party Imports
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import LicenseRegistrationAPI from '@/libs/api/licenseRegistrationAPI'
import UploadAPI from '@/libs/api/uploadAPI'
import LicenseTypeAPI from '@/libs/api/licenseTypeApi'
import VehicleTypeAPI from '@/libs/api/vehicleTypeApi'

// Styled Component Imports
import type { SCREEN_TYPE } from '@/types/Common'
import type { LicenseRegistrationCreateResquest, LicenseRegistrationUpdateResquest, LicenseTypeDto, VehicleTypeDto } from '@/types/LicensesRegistrations'

import Address from './Address'
import CitizenCard from './CitizenCard'
import Contact from './Contact'
import Header from './Header'
import PersonalInformation from './PersonalInformation'
import CONFIG from '@/configs/config'

type LicenseRegistrationFormProps = {
  screenType: SCREEN_TYPE
  id?: string
}

type FormValues = {
  fullName: string
  birthday: Date | null | undefined
  gender: string
  country: string
  phoneNumber: string
  email: string
  province: string
  district: string
  ward: string
  street: string
  cccd: string
  citizenCardDateOfIssue: Date | null | undefined
  citizenCardPlaceOfIssue: string
  licenseType: string
  vehicleType: string
  amount: number | null | undefined
  paymentStatus: string
  healthCheck: string
  carLicense: string
  confirmationStatus: string
  photo3x4: (string | File)[]
  frontPhoto: (string | File)[]
  backPhoto: (string | File)[]
  note: string
}

const LicenseRegistrationForm = ({ id }: LicenseRegistrationFormProps) => {
  // States
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [vehicleTypes, setVehicleTypes] = useState<VehicleTypeDto[]>([])
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([])
  const router = useRouter()

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      birthday: null,
      gender: '',
      phoneNumber: '',
      email: '',
      province: '',
      district: '',
      ward: '',
      street: '',
      cccd: '',
      citizenCardDateOfIssue: null,
      citizenCardPlaceOfIssue: '',
      licenseType: '',
      vehicleType: '',
      amount: 0,
      paymentStatus: 'Chưa thanh toán',
      healthCheck: 'Chưa khám',
      carLicense: 'Chưa có',
      confirmationStatus: 'Chưa duyệt',
      photo3x4: [],
      frontPhoto: [],
      backPhoto: [],
      note: ''
    },
    mode: 'onChange'
  })

  const watchedVehicleType = watch('vehicleType');

  // Fetch vehicle types on component mount
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const response = await VehicleTypeAPI.getAllVehicleTypes({});

        if (response.data.success) {
          setVehicleTypes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        toast.error('Lỗi khi tải danh sách loại xe');
      }
    };

    fetchVehicleTypes();
  }, []);

  // Fetch license types when vehicle type changes
  useEffect(() => {
    const fetchLicenseTypes = async () => {
      if (!watchedVehicleType) return;

      try {
        const response = await LicenseTypeAPI.getAllLicenseTypes({
          VehicleTypeCode: watchedVehicleType
        });

        if (response.data.success) {
          const newLicenseTypes = response.data.data || [];

          setLicenseTypes(newLicenseTypes);

          const currentLicenseType = getValues('licenseType');
          const licenseTypeExists = newLicenseTypes.some((type: LicenseTypeDto) => type.code === currentLicenseType);

          if (!licenseTypeExists) {
            setValue('licenseType', '');
          }
        }
      } catch (error) {
        console.error('Error fetching license types:', error);
        toast.error('Lỗi khi tải danh sách bằng lái');
      }
    };

    fetchLicenseTypes();
  }, [watchedVehicleType]);

  // Fetch data when id exists (edit mode)
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await LicenseRegistrationAPI.getDetailLicensesRegistration(id)

          if (response.data.success) {
            const data = response.data.data

            // Set form values
            setValue('fullName', data.person.fullName)
            setValue('birthday', new Date(data.person.birthday))
            setValue('gender', data.person.sex === 1 ? 'Nam' : data.person.sex === 0 ? 'Nữ' : 'Khác')
            setValue('phoneNumber', data.person.phoneNumber)
            setValue('email', data.person.email)
            setValue('province', data.person.address.provinceCode)
            setValue('district', data.person.address.districtCode)
            setValue('ward', data.person.address.wardCode)
            setValue('street', data.person.address.addressDetail)
            setValue('cccd', data.person.citizenCardId)
            setValue('citizenCardDateOfIssue', data.person.citizenCardDateOfIssue ? new Date(data.person.citizenCardDateOfIssue) : null)
            setValue('citizenCardPlaceOfIssue', data.person.citizenCardPlaceOfIssue)
            setValue('licenseType', data.licenseType.code)
            setValue('vehicleType', data.vehicleType.code)
            setValue('amount', data.amount)
            setValue('paymentStatus', data.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán')
            setValue('healthCheck', data.hasCompletedHealthCheck ? 'Đã khám' : 'Chưa khám')
            setValue('carLicense', data.hasCarLicense ? 'Đã có' : 'Chưa có')
            setValue('confirmationStatus', data.hasApproved ? 'Đã duyệt' : 'Chưa duyệt')


            if (data?.person?.avatarUrl && data.person.avatarUrl !== '') {
              setValue('photo3x4', [`${data.person.avatarUrl}`])
            }

            if (data?.person?.citizenCardFrontImgUrl && data.person.citizenCardFrontImgUrl !== '') {
              setValue('frontPhoto', [`${data.person.citizenCardFrontImgUrl}`])
            }

            if (data?.person?.citizenCardBackImgUrl && data.person.citizenCardBackImgUrl !== '') {
              setValue('backPhoto', [`${data.person.citizenCardBackImgUrl}`])
            }

            setValue('note', data.note)

            // Fetch districts and wards based on province and district
            if (data.person.address.provinceCode) {
              await fetchDistricts(data.person.address.provinceCode)
              setValue('district', data.person.address.districtCode)

              if (data.person.address.districtCode) {
                await fetchWards(data.person.address.districtCode)
                setValue('ward', data.person.address.wardCode)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          toast.error('Có lỗi xảy ra khi tải dữ liệu')
        }
      }

      fetchData()
    }
  }, [id, setValue])

  // Fetch provinces on component mount
  useEffect(() => {
    fetchProvinces()
  }, [])

  // Watch for province changes to fetch districts
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'province' && value.province) {
        fetchDistricts(value.province)
      }

      if (name === 'district' && value.district) {
        fetchWards(value.district)
      }
    })


    return () => subscription.unsubscribe()
  }, [watch])

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
      setValue('district', '')
      setValue('ward', '')
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
      setValue('ward', '')
    } catch (error) {
      console.error('Error fetching wards:', error)
      toast.error('Lỗi khi tải danh sách phường/xã')
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const uploadFile = async (fileOrUrl: string | File | undefined): Promise<string | undefined> => {
      if (fileOrUrl instanceof File) {
        try {
          const response = await UploadAPI.uploadFiles([fileOrUrl]);


          return response?.data?.[0]?.relativeUrl;
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Lỗi khi tải lên ảnh");

          return undefined;
        }
      } else if (typeof fileOrUrl === 'string') {
        const uploadsIndex = fileOrUrl.indexOf('training/uploads/');

        if (uploadsIndex !== -1) {
          return fileOrUrl.substring(uploadsIndex);
        } else {
          return fileOrUrl;
        }
      }


      return undefined;
    };

    const uploadedPhoto3x4Url = await uploadFile(data.photo3x4?.[0]);
    const uploadedFrontPhotoUrl = await uploadFile(data.frontPhoto?.[0]);
    const uploadedBackPhotoUrl = await uploadFile(data.backPhoto?.[0]);

    try {
      const payload: LicenseRegistrationCreateResquest | LicenseRegistrationUpdateResquest = {
        vehicleTypeCode: data.vehicleType,
        licenseTypeCode: data.licenseType,
        hasCarLicense: data.carLicense === 'Đã có',
        hasCompletedHealthCheck: data.healthCheck === 'Đã khám',
        hasApproved: data.confirmationStatus === 'Đã duyệt',
        person: {
          avatarUrl: uploadedPhoto3x4Url || '',
          fullName: data.fullName,
          birthday: data.birthday ? `${data.birthday.getFullYear()}-${(data.birthday.getMonth() + 1).toString().padStart(2, '0')}-${data.birthday.getDate().toString().padStart(2, '0')}` : '',
          sex: data.gender === CONFIG.SexTypeMappingText[1] ? 1 :
            data.gender === CONFIG.SexTypeMappingText[0] ? 0 :
              2,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: {
            provinceCode: data.province.toString(),
            districtCode: data.district.toString(),
            wardCode: data.ward.toString(),
            addressDetail: data.street
          },
          citizenCardId: data.cccd,
          citizenCardDateOfIssue: data.citizenCardDateOfIssue ? `${data.citizenCardDateOfIssue.getFullYear()}-${(data.citizenCardDateOfIssue.getMonth() + 1).toString().padStart(2, '0')}-${data.citizenCardDateOfIssue.getDate().toString().padStart(2, '0')}` : '',
          citizenCardPlaceOfIssue: data.citizenCardPlaceOfIssue,
          citizenCardFrontImgUrl: uploadedFrontPhotoUrl || '',
          citizenCardBackImgUrl: uploadedBackPhotoUrl || '',
        },
        note: data.note,
        isPaid: data.paymentStatus === CONFIG.IsPaidSelectOption.find(opt => opt.value)?.label,
        amount: data.amount || 0,
        id: id
      }

      let response

      if (id) {
        // Edit mode
        response = await LicenseRegistrationAPI.updateLicensesRegistrations(payload)
      } else {
        // Create mode
        response = await LicenseRegistrationAPI.createLicensesRegistrations(payload)
      }

      if (response.data.success) {
        toast.success(id ? 'Cập nhật thành công' : 'Thêm mới thành công')
        router.push('/manage-licenses-registration')
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Có lỗi xảy ra khi đăng ký bằng lái')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Header onCancel={() => router.push('/manage-licenses-registration')} />
      </Grid>
      <form id="license-registration-form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <PersonalInformation
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  trigger={trigger}
                  watch={watch}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CitizenCard
                  control={control}
                  errors={errors}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={6}>
              <Grid size={{ xs: 12 }}>
                <Contact
                  control={control}
                  errors={errors}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Address
                  control={control}
                  errors={errors}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='ĐĂNG KÝ' />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Loại */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.vehicleType}>
                          <InputLabel>Loại (*)</InputLabel>
                          <Controller
                            name='vehicleType'
                            control={control}
                            rules={{ required: 'Vui lòng chọn loại bằng lái' }}
                            render={({ field }) => (
                              <Select {...field} label='Loại (*)'>
                                {vehicleTypes.map((type) => (
                                  <MenuItem key={type.code} value={type.code}>
                                    {type.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.vehicleType && (
                            <FormHelperText>{errors.vehicleType.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      {/* Bằng lái */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.licenseType}>
                          <InputLabel>Bằng lái (*)</InputLabel>
                          <Controller
                            name='licenseType'
                            control={control}
                            rules={{ required: 'Vui lòng chọn bằng lái' }}
                            render={({ field }) => (
                              <Select {...field} label='Bằng lái (*)'>
                                {licenseTypes.map((type) => (
                                  <MenuItem key={type.code} value={type.code}>
                                    {type.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.licenseType && (
                            <FormHelperText>{errors.licenseType.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='THÔNG TIN KHÁC' />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Sức khỏe */}
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                      <Grid size={{ xs: 12, sm: 6 }}>
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='THANH TOÁN' />
                  <CardContent>
                    <Grid container spacing={3}>
                      {/* Tổng tiền */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                          name='amount'
                          control={control}
                          rules={{
                            required: 'Vui lòng nhập tổng tiền',
                            validate: value => (value !== null && value !== undefined && Number(value) > 0) || 'Tổng tiền phải lớn hơn 0'
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label='Tổng tiền (*)'
                              type='text'
                              value={field.value ? Number(field.value).toLocaleString('vi-VN') : ''}
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, ''); // Remove thousands separators (dots)
                                const numberValue = rawValue ? Number(rawValue) : null;

                                field.onChange(numberValue);
                              }}
                              error={!!errors.amount}
                              helperText={errors.amount?.message}
                              InputLabelProps={{ shrink: true }}

                            />
                          )}
                        />
                      </Grid>
                      {/* Trạng thái thanh toán */}
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth error={!!errors.paymentStatus}>
                          <InputLabel>Trạng thái thanh toán (*)</InputLabel>
                          <Controller
                            name='paymentStatus'
                            control={control}
                            rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
                            render={({ field }) => (
                              <Select {...field} label='Trạng thái thanh toán (*)'>
                                {CONFIG.IsPaidSelectOption.map((option) => (
                                  <MenuItem key={String(option.value)} value={option.label}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.paymentStatus && (
                            <FormHelperText>{errors.paymentStatus.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='DUYỆT' />
                  <CardContent>
                    <Grid container spacing={5}>
                      {/* Xác nhận */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth error={!!errors.confirmationStatus}>
                          <InputLabel>Xác nhận (*)</InputLabel>
                          <Controller
                            name='confirmationStatus'
                            control={control}
                            rules={{ required: 'Vui lòng chọn trạng thái xác nhận' }}
                            render={({ field }) => (
                              <Select {...field} label='Xác nhận (*)'>
                                {CONFIG.ApprovedOption.map((option) => (
                                  <MenuItem key={String(option.value)} value={option.label}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.confirmationStatus && (
                            <FormHelperText>{errors.confirmationStatus.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardHeader title='GHI CHÚ' />
                  <CardContent>
                    <Grid container spacing={5}>
                      {/* Ghi chú */}
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
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
}

export default LicenseRegistrationForm
