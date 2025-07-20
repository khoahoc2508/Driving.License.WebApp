import { Typography } from '@mui/material';

import type { FormValues } from '../left-side';


const BrandSettingPreview = ({ form, imgSrc }: { form: FormValues, imgSrc: string }) => (
    <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <img src={imgSrc} alt="avatar" width={80} height={80} style={{ borderRadius: '50%' }} />
            <Typography variant="h6" fontWeight={600}>{form.name ? String(form.name) : 'Tên thương hiệu'}</Typography>
            <Typography color="text.secondary">{form.shortDescription || 'Mô tả ngắn'}</Typography>
        </div>
        <div style={{ marginTop: 30 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>THÔNG TIN</Typography>
            <Typography color="text.secondary">{form.description || '...'}</Typography>
        </div>
        <div style={{ marginTop: 30 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>LIÊN HỆ</Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
                <i className="ri-mail-line" style={{ color: '#888', fontSize: 18 }} />
                <Typography color="text.secondary">{form.email || 'Email'}</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
                <i className="ri-phone-line" style={{ color: '#888', fontSize: 18 }} />
                <Typography color="text.secondary">{form.phoneNumber || 'Số điện thoại'}</Typography>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
                <i className="ri-map-pin-line" style={{ color: '#888', fontSize: 18 }} />
                <Typography color="text.secondary">{form.address || 'Địa chỉ'}</Typography>
            </div>
        </div>
        <div style={{ marginTop: 30 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>HÌNH ẢNH</Typography>
            {Array.isArray(form.images) && form.images.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 4,
                    marginTop: 8,
                    maxHeight: 340,
                    overflowY: 'auto',
                }}>
                    {form.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img.startsWith('blob:') ? img : `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${img}`}
                            alt={`gallery-${idx}`}
                            style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
                        />
                    ))}
                </div>
            ) : (
                <Typography color="text.secondary" fontSize={14}>Chưa có hình ảnh</Typography>
            )}
        </div>
    </>
);

export default BrandSettingPreview
