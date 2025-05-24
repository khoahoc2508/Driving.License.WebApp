'use client'

import { Card, CardContent, CardHeader, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import Grid from '@mui/material/Grid2'
import { Controller, Control } from 'react-hook-form'

interface ContactProps {
    control: Control<any>
    errors: any
}

const Contact = ({ control, errors }: ContactProps) => {
    return (
        <Card>
            <CardHeader title='LIÊN HỆ' />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                        <Controller
                            name='phoneNumber'
                            control={control}
                            rules={{ required: 'Vui lòng nhập số điện thoại' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Số điện thoại (*)'
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} className='mb-4'>
                        <Controller
                            name='email'
                            control={control}
                            rules={{ required: 'Vui lòng nhập email' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type='email'
                                    label='Email (*)'
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default Contact
