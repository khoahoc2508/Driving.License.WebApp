'use client'


import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useFormContext } from 'react-hook-form'

import Button from '@mui/material/Button'

import DirectionalIcon from '@/components/common/DirectionalIcon'
import FileUploaderSingle from '@/components/common/FileUploaderSingle'

// Define types based on your validation schema
type AccountDetailsForm = {
  citizenCardId: string;
  citizenCardDateOfIssue: string;
  citizenCardPlaceOfIssue: string;
  citizenCardFrontImgUrl: string[];
  citizenCardBackImgUrl: string[];
}

type Step = { // Define a consistent Step type
  active: number;
  title: string;
  desc: string | null;
  Icon: any; // Use a more specific type if possible, e.g., React.ElementType
}

type CitizenCardProps = {
  steps: Step[]; // Use the consistent Step type
  handleNext: () => void;
}

const CitizenCard = ({ steps, handleNext }: CitizenCardProps) => {

  const { control, formState: { errors }, handleSubmit } = useFormContext<AccountDetailsForm>();


  // This function will be called by react-hook-form's handleSubmit with validated data
  const handleAccountDetailsSubmit = (data: AccountDetailsForm) => {
    console.log('Account Details Data:', data); // Process step 0 data
    handleNext(); // Call parent's handleNext to move to the next step
  };

  return (

    // Pass the data handling function to handleSubmit
    // The button inside the form with type='submit' will trigger this handleSubmit
    <form onSubmit={handleSubmit(handleAccountDetailsSubmit)} className='h-full w-full'>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12 }}>
          <Typography className='font-medium' color='text.primary'>
            {steps[0].title}
          </Typography>
          {steps[0].desc && <Typography variant='body2'>{steps[0].desc}</Typography>}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='citizenCardFrontImgUrl'
            control={control}
            render={({ field }) => (
              <FileUploaderSingle
                field={field}
                error={!!errors.citizenCardFrontImgUrl}
                helperText={errors.citizenCardFrontImgUrl?.message}
                description='Tải lên ảnh mặt trước CCCD'
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='citizenCardBackImgUrl'
            control={control}
            render={({ field }) => (
              <FileUploaderSingle
                field={field}
                error={!!errors.citizenCardBackImgUrl}
                helperText={errors.citizenCardBackImgUrl?.message}
                description='Tải lên ảnh mặt sau CCCD'
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='citizenCardId'
            control={control}
            rules={{ required: 'Vui lòng nhập số CCCD' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Số CCCD (*)'
                error={!!errors.citizenCardId}
                helperText={errors.citizenCardId?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Controller
            name='citizenCardDateOfIssue'
            control={control}
            rules={{ required: 'Vui lòng nhập ngày cấp' }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type='date'
                label='Ngày cấp (*)'
                InputLabelProps={{ shrink: true }}
                error={!!errors.citizenCardDateOfIssue}
                helperText={errors.citizenCardDateOfIssue?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
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
        <Grid size={{ xs: 12 }} className='flex justify-between'>
          <Button
            variant='outlined'
            disabled // Assuming back is disabled on the first step
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

export default CitizenCard
