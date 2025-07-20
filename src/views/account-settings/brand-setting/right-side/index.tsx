import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { TextField } from '@mui/material';
import { useSession } from 'next-auth/react';

import type { FormValues } from '../left-side';
import BrandSettingPreview from './BrandSettingPreview';

type RightSideProps = {
    form: FormValues;
    imgSrc: string
};


const RightSide: React.FC<RightSideProps> = ({ form, imgSrc }) => {

    const { data } = useSession()

    return (
        <>
            <Card>
                <Typography variant="h6" fontSize={"17px"} sx={{ p: 5 }}>
                    Xem trước
                </Typography>
                <Divider />
                <CardContent>
                    <BrandSettingPreview form={form} imgSrc={imgSrc} />
                </CardContent>
            </Card>
            <Card style={{ marginTop: 24 }}>
                <Typography variant="h6" fontSize={"17px"} sx={{ p: 5 }}>
                    Chia sẻ
                </Typography>
                <Divider />
                <CardContent>
                    <div style={{ marginBottom: 16 }}>
                        <TextField
                            fullWidth
                            label='Đăng ký xe máy'
                            multiline
                            minRows={2}
                            value={(process.env.NEXT_PUBLIC_WEB_DANG_KY_BANG_LAI_XE_MAY ?? '').replace('{0}', data?.user?.email ?? '')}
                            InputProps={{ readOnly: true }}
                            sx={{ mb: 3, '& .MuiInputBase-input': { whiteSpace: 'pre-line' } }}
                        />
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            label='Đăng ký ô tô'
                            multiline
                            minRows={2}
                            value={(process.env.NEXT_PUBLIC_WEB_DANG_KY_BANG_LAI_OTO ?? '').replace('{0}', data?.user?.email ?? '')}
                            InputProps={{ readOnly: true }}
                            sx={{ mb: 3, '& .MuiInputBase-input': { whiteSpace: 'pre-line' } }}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default RightSide; 
