'use client'


import { Card, CardContent, CardHeader, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import type { Control, UseFormSetValue } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid2';

import FileUploaderSingle from '@/components/common/FileUploaderSingle';

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
              name='cardType'
              control={control}
              rules={{ required: 'Vui lòng chọn loại giấy tờ' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.cardType}>
                  <InputLabel>Loại giấy tờ (*)</InputLabel>
                  <Select {...field} label='Loại giấy tờ (*)'>
                    <MenuItem value='Căn cước công dân'>Căn cước công dân</MenuItem>
                  </Select>
                  {errors.cardType && (
                    <FormHelperText>{errors.cardType.message}</FormHelperText>
                  )}
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
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CitizenCard;
