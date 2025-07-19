import React, { useState } from 'react';
import LeftSide, { FormValues } from './left-side';
import RightSide from './right-side';
import Grid from '@mui/material/Grid';

const defaultForm: FormValues = {
    avatarUrl: '/images/avatars/1.png',
    name: '',
    shortDescription: '',
    description: '',
    email: '',
    phoneNumber: '',
    address: '',
    images: []
};

const BrandSetting = () => {
    const [form, setForm] = useState(defaultForm);

    return (
        <Grid container spacing={5}>
            <Grid item xs={12} md={8}>
                <LeftSide form={form} setForm={setForm} />
            </Grid>
            <Grid item xs={12} md={4}>
                <RightSide form={form} />
            </Grid>
        </Grid>
    );
};

export default BrandSetting;
