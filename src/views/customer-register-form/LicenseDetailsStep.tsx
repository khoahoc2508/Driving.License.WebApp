'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'

import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { Controller } from 'react-hook-form'

import Button from '@mui/material/Button'

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { FormControlLabel } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

import DirectionalIcon from '@/components/common/DirectionalIcon'
import type { Step } from './index'; // Import the Step type

import CONFIG from '@/configs/config'
import LicenseTypeAPI from '@/libs/api/licenseTypeApi'
import type { LicenseTypeDto } from '@/types/LicensesRegistrations'

// Define types based on your validation schema (adjust as needed)
type LicenseDetailsForm = {
  licenseType: string;
  hasCompletedHealthCheck: boolean;
  hasCarLicense: boolean;
}

type LicenseDetailsStepProps = {
  steps: Step[]; // Use the imported Step type
  handleBack: () => void;
  handleNext: () => void;
  vehicleTypePage?: string; // Update type to string since we're using codes
}

const LicenseDetailsStep = ({ steps, handleBack, handleNext, vehicleTypePage }: LicenseDetailsStepProps) => {
  const { control, formState: { errors }, handleSubmit, getValues } = useFormContext<LicenseDetailsForm>();
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([]);

  // Fetch license types when vehicle type changes
  useEffect(() => {
    const fetchLicenseTypes = async () => {
      if (!vehicleTypePage) return;

      try {
        const response = await LicenseTypeAPI.getAllLicenseTypes({
          VehicleTypeCode: vehicleTypePage
        });
        if (response.data.success) {
          setLicenseTypes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching license types:', error);
        toast.error('Lỗi khi tải danh sách bằng lái');
      }
    };

    fetchLicenseTypes();
  }, [vehicleTypePage]);

  // This function will be called by react-hook-form's handleSubmit with validated data
  const handleLicenseDetailsSubmit = () => {
    const currentLicenseType = getValues('licenseType');
    if (!currentLicenseType) {
      toast.error('Vui lòng chọn bằng lái');
      return;
    }

    const licenseTypeExists = licenseTypes.some(type => type.code === currentLicenseType);
    if (!licenseTypeExists) {
      toast.error('Loại bằng lái không hợp lệ');
      return;
    }

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
          <Controller
            name='licenseType'
            control={control}
            rules={{
              required: 'Vui lòng chọn bằng lái',
              validate: value => {
                if (!value) return 'Vui lòng chọn bằng lái';
                const exists = licenseTypes.some(type => type.code === value);
                if (!exists) return 'Loại bằng lái không hợp lệ';
                return true;
              }
            }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.licenseType}>
                <InputLabel>Bằng lái (*)</InputLabel>
                <Select {...field} label='Bằng lái (*)'>
                  {licenseTypes.map((type) => (
                    <MenuItem key={type.code} value={type.code}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.licenseType && (
                  <FormHelperText>{errors.licenseType.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography className='font-medium' color='text.primary'>
            THÔNG TIN KHÁC
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.hasCompletedHealthCheck}>
            <Controller
              name='hasCompletedHealthCheck'
              control={control}
              rules={{ required: 'Vui lòng chọn trạng thái sức khỏe' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.hasCompletedHealthCheck}>
                  <InputLabel>Sức khỏe (*) </InputLabel>
                  <Select
                    {...field}
                    label='Sức khỏe (*) '
                    value={field.value ? 1 : 0}
                    onChange={(event) => {
                      field.onChange(event.target.value === 1);
                    }}
                  >
                    {CONFIG.HasCompletedHealthCheckSelectOption.map((option) => (
                      <MenuItem key={String(option.value)} value={option.value ? 1 : 0}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.hasCompletedHealthCheck && (
              <FormHelperText>{errors.hasCompletedHealthCheck.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        {/* Bằng ô tô - chỉ hiển thị khi đăng ký xe máy */}
        {vehicleTypePage === CONFIG.VehicleTypeCode.Motorbike && (
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth error={!!errors.hasCarLicense}>
              <Controller
                name='hasCarLicense'
                control={control}
                rules={{ required: 'Vui lòng chọn trạng thái bằng ô tô' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.hasCarLicense}>
                    <InputLabel>Bằng ô tô (*)</InputLabel>
                    <Select
                      {...field}
                      label='Bằng ô tô (*) '
                      value={field.value ? 1 : 0}
                      onChange={(event) => {
                        field.onChange(event.target.value === 1);
                      }}
                    >
                      {CONFIG.HasCarLicenseSelectOption.map((option, index) => (
                        <MenuItem key={index} value={option.value ? 1 : 0}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {errors.hasCarLicense && (
                <FormHelperText>{errors.hasCarLicense.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}
        <Grid size={{ xs: 12 }} className='flex justify-between'>
          <Button
            variant='outlined'
            onClick={handleBack}
            color='secondary'
            startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
          >
            Quay lại
          </Button>
          <Button
            variant='contained'
            type='submit'
            endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
          >
            Tiếp theo
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default LicenseDetailsStep
