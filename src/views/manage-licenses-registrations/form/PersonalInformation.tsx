'use client'

import { Card, CardContent, CardHeader, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { Control, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import FileUploaderSingle from '@/components/common/FileUploaderSingle';
import CONFIG from '@/configs/config';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';

interface PersonalInformationProps {
  control: Control<any>
  errors: any
  setValue: UseFormSetValue<any>
  trigger: UseFormTrigger<any>
  watch: UseFormWatch<any>
}

const PersonalInformation = ({ control, errors }: PersonalInformationProps) => {
  // const [photo3x4File, setPhoto3x4File] = useState<File | null>(null)

  return (
    <Card>
      <CardHeader title='THÔNG TIN CÁ NHÂN' />
      <CardContent>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name='photo3x4'
              control={control}
              rules={{ required: 'Vui lòng tải lên ảnh 3x4' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.photo3x4} className='h-full'>
                  <FileUploaderSingle
                    field={field}
                    error={!!errors.photo3x4}
                    helperText={errors.photo3x4?.message}
                    description='Tải lên ảnh 3x4 (*)'
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='fullName'
                  control={control}
                  rules={{ required: 'Vui lòng nhập họ tên' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label='Họ tên (*)'
                      error={!!errors.fullName}
                      helperText={errors.fullName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='birthday'
                  control={control}
                  rules={{ required: 'Vui lòng chọn ngày sinh' }}
                  render={({ field }) => (
                    <AppReactDatepicker
                      boxProps={{ className: 'is-full' }}
                      selected={field.value ? new Date(field.value) : null}
                      showYearDropdown
                      showMonthDropdown
                      dateFormat='dd/MM/yyyy'
                      onChange={(date) => field.onChange(date)}
                      customInput={<TextField fullWidth size='medium' label='Ngày sinh (*)' {...(errors.birthday && { error: true, helperText: errors.birthday.message })} />}
                    />

                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='gender'
                  control={control}
                  rules={{ required: 'Vui lòng chọn giới tính' }}
                  render={({ field }) => (
                    <FormControl error={!!errors.gender}>
                      <RadioGroup row {...field} name='gender-buttons-group'>
                        {CONFIG.SexTypeSelectOption.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.label}
                            control={<Radio />}
                            label={option.label}
                          />
                        ))}
                      </RadioGroup>
                      {errors.gender && (
                        <FormHelperText>{errors.gender.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PersonalInformation
