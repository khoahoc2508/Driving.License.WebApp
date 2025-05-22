'use client'

import { Card, CardContent, CardHeader, TextField, FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import { Controller, Control, UseFormSetValue } from 'react-hook-form';
import ImageDropzonev2 from '@/components/common/ImageDropzonev2';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';

interface CitizenCardProps {
    control: Control<any>
    errors: any
    setValue: UseFormSetValue<any>
}

const CitizenCard = ({ control, errors, setValue }: CitizenCardProps) => {
    const [frontPhotoFile, setFrontPhotoFile] = useState<File | null>(null);
    const [backPhotoFile, setBackPhotoFile] = useState<File | null>(null);

    return (
        <Card>
            <CardHeader title='CĂN CƯỚC CÔNG DÂN' />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name='frontPhoto'
                            control={control}
                            rules={{ required: 'Vui lòng tải lên ảnh mặt trước CCCD' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.frontPhoto}>
                                    {/* <ImageDropzonev2
                                        file={frontPhotoFile}
                                        setFile={setFrontPhotoFile}
                                        imageUrl={field.value?.[0]}
                                        setImageUrl={(url) => {
                                            field.onChange(url ? [url] : [])
                                        }}
                                        isWarning={false}
                                        description='Tải lên ảnh mặt trước CCCD'
                                    /> */}
                                    {errors.frontPhoto && (
                                        <FormHelperText>{errors.frontPhoto.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name='backPhoto'
                            control={control}
                            rules={{ required: 'Vui lòng tải lên ảnh mặt sau CCCD' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.backPhoto}>
                                    {/* <ImageDropzonev2
                                        file={backPhotoFile}
                                        setFile={setBackPhotoFile}
                                        imageUrl={field.value?.[0]}
                                        setImageUrl={(url) => {
                                            field.onChange(url ? [url] : [])
                                        }}
                                        isWarning={false}
                                        description='Tải lên ảnh mặt sau CCCD'
                                    /> */}
                                    {errors.backPhoto && (
                                        <FormHelperText>{errors.backPhoto.message}</FormHelperText>
                                    )}
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
