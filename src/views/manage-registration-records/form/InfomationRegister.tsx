'use client'

import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Controller, type Control } from 'react-hook-form';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';

interface InfomationRegisterProps {
    control: Control<any>
    errors: any
    licenseTypes: any[]
}

const InfomationRegister = ({ control, errors, licenseTypes }: InfomationRegisterProps) => {
    return (
        <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
                <Controller
                    name='licenseTypeCode'
                    control={control}
                    rules={{ required: 'Vui lòng chọn bằng lái' }}
                    render={({ field }) => (
                        <FormControl fullWidth error={!!errors.licenseTypeCode}>
                            <InputLabel>Hạng <span style={{ color: 'red' }}>(*)</span></InputLabel>
                            <Select {...field} label='Hạng (*)'>
                                {licenseTypes.map((type) => (
                                    <MenuItem key={type.code} value={type.code}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.licenseTypeCode && (
                                <FormHelperText>{errors.licenseTypeCode.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid container spacing={5} size={{ xs: 12 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name='receivedDate'
                        control={control}
                        rules={{ required: 'Vui lòng chọn ngày nhận hồ sơ' }}
                        render={({ field }) => (
                            <AppReactDatepicker
                                boxProps={{ className: 'is-full' }}
                                selected={field.value ? new Date(field.value) : null}
                                showYearDropdown
                                showMonthDropdown
                                dateFormat='dd/MM/yyyy'
                                onChange={(date) => field.onChange(date)}
                                customInput={<TextField
                                    fullWidth
                                    size='medium'
                                    label={
                                        <span>
                                            Ngày nhận hồ sơ <span style={{ color: 'red' }}>(*)</span>
                                        </span>
                                    }
                                    {...(errors.receivedDate && { error: true, helperText: errors.receivedDate.message })}
                                />}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name='healthCheckDate'
                        control={control}
                        render={({ field }) => (
                            <AppReactDatepicker
                                boxProps={{ className: 'is-full' }}
                                selected={field.value ? new Date(field.value) : null}
                                showYearDropdown
                                showMonthDropdown
                                dateFormat='dd/MM/yyyy'
                                onChange={(date) => field.onChange(date)}
                                customInput={<TextField
                                    fullWidth
                                    size='medium'
                                    label="Ngày khám sức khỏe"
                                />}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid size={{ xs: 12 }}>
                <Controller
                    name='note'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            multiline
                            rows={4}
                            label="Ghi chú"
                            error={!!errors.note}
                            helperText={errors.note?.message}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
}

export default InfomationRegister
