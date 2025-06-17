'use client'

import { Card, CardContent, CardHeader, TextField, FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid2';

interface AddressProps {
    control: Control<any>
    errors: any
    provinces: any[]
    districts: any[]
    wards: any[]
}

const Address = ({ control, errors, provinces, districts, wards }: AddressProps) => {
    return (
        <Card>
            <CardHeader title='ĐỊA CHỈ' />
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name='province'
                            control={control}
                            rules={{ required: 'Vui lòng chọn tỉnh/thành phố' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.province}>
                                    <InputLabel>Tỉnh/Thành phố (*)</InputLabel>
                                    <Select {...field} label='Tỉnh/Thành phố (*)'>
                                        {provinces.map((province) => (
                                            <MenuItem key={province.code} value={province.code}>
                                                {province.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.province && (
                                        <FormHelperText>{errors.province.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name='district'
                            control={control}
                            rules={{ required: 'Vui lòng chọn quận/huyện' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.district}>
                                    <InputLabel>Quận/Huyện (*)</InputLabel>
                                    <Select {...field} label='Quận/Huyện (*)'>
                                        {districts.map((district) => (
                                            <MenuItem key={district.code} value={district.code}>
                                                {district.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.district && (
                                        <FormHelperText>{errors.district.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name='ward'
                            control={control}
                            rules={{ required: 'Vui lòng chọn phường/xã' }}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.ward}>
                                    <InputLabel>Phường/Xã (*)</InputLabel>
                                    <Select {...field} label='Phường/Xã (*)'>
                                        {wards.map((ward) => (
                                            <MenuItem key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.ward && (
                                        <FormHelperText>{errors.ward.message}</FormHelperText>
                                    )}
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name='street'
                            control={control}
                            rules={{ required: 'Vui lòng nhập số nhà, tên đường' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Số nhà, tên đường (*)'
                                    error={!!errors.street}
                                    helperText={errors.street?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Address;
