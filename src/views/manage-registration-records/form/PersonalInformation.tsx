'use client'

import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField } from '@mui/material';
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
  return (
    <>
      <Grid container spacing={5}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 3 }} className='h-[270px]'>
          <Controller
            name='avatarUrl'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.avatarUrl} className='h-full'>
                <FileUploaderSingle
                  field={field}
                  error={!!errors.avatarUrl}
                  helperText={errors.avatarUrl?.message}
                  description={
                    <span>
                      Tải lên ảnh 3x4
                    </span>
                  }
                  enableCrop={true}
                  aspect={3 / 4}
                  quality={0.9}
                />
              </FormControl>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='fullname'
                control={control}
                rules={{ required: 'Vui lòng nhập họ tên' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={
                      <span>
                        Họ tên <span style={{ color: 'red' }}>(*)</span>
                      </span>
                    }
                    error={!!errors.fullname}
                    helperText={errors.fullname?.message}
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
                    maxDate={new Date()}
                    customInput={<TextField fullWidth size='medium' label={
                      <span>
                        Ngày sinh <span style={{ color: 'red' }}>(*)</span>
                      </span>
                    } {...(errors.birthday && { error: true, helperText: errors.birthday.message })} />}
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
                    <RadioGroup
                      row
                      value={field.value}
                      onChange={field.onChange}
                      name='gender-buttons-group'
                    >
                      {CONFIG.SexTypeSelectOption.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                      ))}
                    </RadioGroup>
                    {errors.gender && (
                      <FormHelperText className='ml-4'>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={5} className='my-4'>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='phone'
            control={control}
            rules={{ required: 'Vui lòng nhập số điện thoại' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                error={!!errors.phone}
                label={
                  <span>
                    Số điện thoại <span style={{ color: 'red' }}>(*)</span>
                  </span>
                }
                helperText={errors.phone?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='citizenIdNumber'
            control={control}
            rules={{ required: 'Vui lòng nhập số CCCD' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={
                  <span>
                    Số CCCD <span style={{ color: 'red' }}>(*)</span>
                  </span>
                }
                error={!!errors.citizenIdNumber}
                helperText={errors.citizenIdNumber?.message}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='email'
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name='address'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Địa chỉ"
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default PersonalInformation
