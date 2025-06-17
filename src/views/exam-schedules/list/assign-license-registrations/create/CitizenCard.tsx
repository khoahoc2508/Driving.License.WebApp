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

  // const handleGetInfoFromCitizenCard = async () => {
  //   const frontPhoto = watch('frontPhoto');
  //   const backPhoto = watch('backPhoto');

  //   if (!frontPhoto || frontPhoto.length === 0 || !(frontPhoto[0] instanceof File)) {
  //     toast.error('Vui lòng tải lên ảnh mặt trước CCCD.');

  //     return;
  //   }

  //   if (!backPhoto || backPhoto.length === 0 || !(backPhoto[0] instanceof File)) {
  //     toast.error('Vui lòng tải lên ảnh mặt sau CCCD.');

  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append('formFile', frontPhoto[0]);
  //   formData.append('formFile', backPhoto[0]);

  //   try {
  //     const response = await PersonAPI.postCitizenByFiles(formData);

  //     if (response.data?.success && response.data.data && response.data.data.length > 0) {

  //       const citizenData = response.data.data[0];
  //       const frontData = citizenData.front;
  //       const backData = citizenData.back;

  //       // Fill the form fields
  //       setValue('cccd', citizenData.id || '');

  //       if (frontData) {
  //         setValue('fullName', frontData.fullName || '');
  //         setValue('birthday', frontData.birthday ? new Date(frontData.birthday) : null);
  //         setValue('gender', frontData.sex === 1 ? 'Nam' : frontData.sex === 0 ? 'Nữ' : 'Khác');
  //       }

  //       if (backData) {
  //         setValue('citizenCardDateOfIssue', backData.issuedDate ? new Date(backData.issuedDate) : null);
  //         setValue('citizenCardPlaceOfIssue', backData.issuedBy || '');
  //       }

  //       toast.success('Lấy thông tin CCCD thành công!');
  //     } else {
  //       toast.error(response.data?.message || 'Không thể nhận dạng thông tin từ ảnh CCCD.');
  //     }
  //   } catch (error) {
  //     console.error('Error recognizing citizen card:', error);
  //     toast.error('Đã xảy ra lỗi khi lấy thông tin CCCD.');
  //   }
  // };

  return (
    <Card>
      <CardHeader title='CĂN CƯỚC CÔNG DÂN' />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='frontPhoto'
              control={control}
              rules={{ required: 'Vui lòng tải lên ảnh mặt trước CCCD' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.frontPhoto}>
                  <FileUploaderSingle
                    field={field}
                    error={!!errors.frontPhoto}
                    helperText={errors.frontPhoto?.message}
                    description='Tải lên ảnh mặt trước CCCD (*)'
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='backPhoto'
              control={control}
              rules={{ required: 'Vui lòng tải lên ảnh mặt sau CCCD' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.backPhoto}>
                  <FileUploaderSingle
                    field={field}
                    error={!!errors.backPhoto}
                    helperText={errors.backPhoto?.message}
                    description='Tải lên ảnh mặt sau CCCD (*)'
                  />
                </FormControl>
              )}
            />
          </Grid>
          {/* <Grid size={{ xs: 12 }}>
            <Button variant='outlined' color='info' className='w-full' disabled onClick={handleGetInfoFromCitizenCard}>
              Lấy thông tin từ CCCD
            </Button>
          </Grid> */}
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
