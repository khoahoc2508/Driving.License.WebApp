import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// Dùng lại type FormValues từ LeftSide
import { FormValues } from '../left-side';

type RightSideProps = {
    form: FormValues;
};

const RightSide: React.FC<RightSideProps> = ({ form }) => {
    return (
        <Card>
            <Typography variant="h6" fontSize={"17px"} sx={{ p: 3, pb: 0 }}>
                Xem trước
            </Typography>
            <Divider />
            <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <img src={form.avatarUrl || '/images/avatars/1.png'} alt="avatar" width={80} height={80} style={{ borderRadius: '50%' }} />
                    < Typography variant="h6" fontWeight={600}>{form.name ? String(form.name) : 'Tên thương hiệu'}</Typography>
                    <Typography color="text.secondary">{form.shortDescription || 'Mô tả ngắn'}</Typography>
                </div>
                <div style={{ marginTop: 24 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>THÔNG TIN</Typography>
                    <Typography color="text.secondary">{form.description || '...'}</Typography>
                </div>
                <div style={{ marginTop: 24 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>LIÊN HỆ</Typography>
                    <Typography color="text.secondary">{form.email || 'Email'}</Typography><br />
                    <Typography color="text.secondary">{form.phoneNumber || 'Số điện thoại'}</Typography><br />
                    <Typography color="text.secondary">{form.address || 'Địa chỉ'}</Typography>
                </div>
            </CardContent>
        </Card >
    );
};

export default RightSide; 
