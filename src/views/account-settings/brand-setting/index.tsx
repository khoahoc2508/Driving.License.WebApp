import React, { useState } from 'react';

import Grid from '@mui/material/Grid';

import type { FormValues } from './left-side';
import LeftSide from './left-side';
import RightSide from './right-side';


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
    const [imgSrc, setImgSrc] = React.useState<string>(form.avatarUrl || '/images/avatars/1.png');

    return (
        <Grid container spacing={5}>
            <Grid item xs={12} md={8}>
                <LeftSide form={form} setForm={setForm} imgSrc={imgSrc} setImgSrc={setImgSrc} />
            </Grid>
            <Grid item xs={12} md={4}>
                <RightSide form={form} imgSrc={imgSrc} />
            </Grid>
        </Grid>
    );
};

export default BrandSetting;
