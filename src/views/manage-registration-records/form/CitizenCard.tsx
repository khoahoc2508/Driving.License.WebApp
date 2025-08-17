'use client'


import { Card, CardContent, CardHeader, FormControl, TextField } from '@mui/material';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid2';


import FileUploaderSingle from '@/components/common/FileUploaderSingle';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';

interface CitizenCardProps {
  control: Control<any>
  errors: any
}

const CitizenCard = ({ control, errors }: CitizenCardProps) => {

  return (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12, md: 6 }} className='h-[270px]'>
        <Controller
          name='citizenIdFrontImageUrl'
          control={control}
          rules={{ required: 'Vui lòng tải lên ảnh mặt trước CCCD' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.citizenIdFrontImageUrl} className='h-full'>
              <FileUploaderSingle
                field={field}
                error={!!errors.citizenIdFrontImageUrl}
                helperText={errors.citizenIdFrontImageUrl?.message}
                description={
                  <span>
                    Tải lên ảnh mặt trước CCCD <span style={{ color: 'red' }}>(*)</span>
                  </span>
                }
              />
            </FormControl>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} className='h-[270px]'>
        <Controller
          name='citizenIdBackImageUrl'
          control={control}
          rules={{ required: 'Vui lòng tải lên ảnh mặt sau CCCD' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.citizenIdBackImageUrl} className='h-full'>
              <FileUploaderSingle
                field={field}
                error={!!errors.citizenIdBackImageUrl}
                helperText={errors.citizenIdBackImageUrl?.message}
                description={
                  <span>
                    Tải lên ảnh mặt sau CCCD <span style={{ color: 'red' }}>(*)</span>
                  </span>
                }
              />
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default CitizenCard;
