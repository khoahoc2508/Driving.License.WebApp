'use client'


import { Card, CardContent, CardHeader, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid2';

import FileUploaderSingle from '@/components/common/FileUploaderSingle';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';

interface CitizenCardProps {
  control: Control<any>
  errors: any
  setValue: UseFormSetValue<any>
}

const CitizenCard = ({ control, errors }: CitizenCardProps) => {
  // const [frontPhotoFile, setFrontPhotoFile] = useState<File | null>(null);
  // const [backPhotoFile, setBackPhotoFile] = useState<File | null>(null);

  return (
    <Card>
      <CardHeader title='CĂN CƯỚC CÔNG DÂN' />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='frontPhoto'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.frontPhoto}>
                  <FileUploaderSingle
                    field={field}
                    error={!!errors.frontPhoto}
                    helperText={errors.frontPhoto?.message}
                    description='Tải lên ảnh mặt trước CCCD'
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='backPhoto'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.backPhoto}>
                  <FileUploaderSingle
                    field={field}
                    error={!!errors.backPhoto}
                    helperText={errors.backPhoto?.message}
                    description='Tải lên ảnh mặt sau CCCD'
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='cccd'
              control={control}
              rules={{ required: 'Vui lòng nhập số CCCD' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Số CCCD (*)'
                  error={!!errors.cccd}
                  helperText={errors.cccd?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='citizenCardDateOfIssue'
              control={control}
              rules={{ required: 'Vui lòng nhập ngày cấp' }}
              render={({ field }) => (
                <AppReactDatepicker
                  boxProps={{ className: 'is-full' }}
                  selected={field.value ? new Date(field.value) : null}
                  showYearDropdown
                  showMonthDropdown
                  dateFormat='dd/MM/yyyy'
                  onChange={(date) => field.onChange(date)}
                  customInput={<TextField fullWidth size='medium' label='Ngày cấp (*)' {...(errors.citizenCardDateOfIssue && { error: true, helperText: errors.citizenCardDateOfIssue.message })} />}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='citizenCardPlaceOfIssue'
              control={control}
              rules={{ required: 'Vui lòng nhập nơi cấp' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Nơi cấp (*)'
                  error={!!errors.citizenCardPlaceOfIssue}
                  helperText={errors.citizenCardPlaceOfIssue?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CitizenCard;
