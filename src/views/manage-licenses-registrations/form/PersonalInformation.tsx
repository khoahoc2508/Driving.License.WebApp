'use client'

import { Card, CardContent, CardHeader, TextField, Typography, FormControl, FormHelperText, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem } from '@mui/material';
import { GetServerSideProps } from 'next';
import Grid from '@mui/material/Grid2'
import { Controller, Control, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import ImageDropzonev2 from '@/components/common/ImageDropzonev2'
import { useState } from 'react'
import CONFIG from '@/configs/config'

interface PersonalInformationProps {
    control: Control<any>
    errors: any
    setValue: UseFormSetValue<any>
    trigger: UseFormTrigger<any>
    watch: UseFormWatch<any>
}

const PersonalInformation = ({ control, errors, setValue, trigger, watch }: PersonalInformationProps) => {
    const [photo3x4File, setPhoto3x4File] = useState<File | null>(null)

    return (
        <Card>
            <CardHeader title='THÔNG TIN CÁ NHÂN' />
            <CardContent>
                <Grid container spacing={5}>
                    {/* Left Column */}
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name='photo3x4'
                            control={control}
                            rules={{ required: 'Vui lòng tải lên ảnh 3x4' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.photo3x4}>
                                    {/* <ImageDropzonev2
                                        file={photo3x4File}
                                        setFile={setPhoto3x4File}
                                        imageUrl={field.value?.[0]}
                                        setImageUrl={(url) => {
                                            field.onChange(url ? [url] : [])
                                            trigger('photo3x4')
                                        }}
                                        isWarning={false}
                                        description='Tải lên ảnh 3x4'
                                    /> */}
                                    {errors.photo3x4 && (
                                        <FormHelperText>{errors.photo3x4.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
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
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name='dateOfBirth'
                            control={control}
                            rules={{ required: 'Vui lòng chọn ngày sinh' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type='date'
                                    label='Ngày sinh (*)'
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name='country'
                            control={control}
                            rules={{ required: 'Vui lòng chọn quốc gia' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.country}>
                                    <InputLabel>Quốc gia (*)</InputLabel>
                                    <Select {...field} label='Quốc gia (*)'>
                                        <MenuItem value='Việt Nam'>Việt Nam</MenuItem>
                                    </Select>
                                    {errors.country && (
                                        <FormHelperText>{errors.country.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default PersonalInformation
