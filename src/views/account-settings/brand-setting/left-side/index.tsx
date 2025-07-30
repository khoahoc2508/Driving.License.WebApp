import React from 'react';

import type { ChangeEvent } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Divider, TextField, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import { toast } from 'react-toastify';

import MultiFileUploader from '@/components/common/MultiFileUploader';
import brandSettingAPI from '@/libs/api/brandSettingAPI';
import UploadAPI from '@/libs/api/uploadAPI';

export type FormValues = {
    avatarUrl: string;
    name: string;
    shortDescription: string;
    description: string;
    email: string;
    phoneNumber: string;
    address: string;
    images: string[];
};

type LeftSideProps = {
    form: FormValues;
    setForm: React.Dispatch<React.SetStateAction<FormValues>>;
    imgSrc: string;
    setImgSrc: React.Dispatch<React.SetStateAction<string>>;
};

// Utility to convert base64 dataURL to File
function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const match = arr[0].match(/:(.*?);/);
    const mime = match ? match[1] : '';
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    
return new File([u8arr], filename, { type: mime });
}

async function blobUrlToFile(blobUrl: string, filename: string): Promise<File> {
    const res = await fetch(blobUrl);
    const blob = await res.blob();


    // Lấy mime type từ blob nếu cần
    return new File([blob], filename, { type: blob.type });
}

const LeftSide: React.FC<LeftSideProps> = ({ form, setForm, imgSrc, setImgSrc }) => {
    const [fileInput, setFileInput] = React.useState<string>('');

    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormValues>({
        defaultValues: form,
        mode: 'onChange'
    });

    React.useEffect(() => {
        const fetchBrandSetting = async () => {
            try {
                const res = await brandSettingAPI.GetBrandsetting();

                if (res.data?.success && res.data?.data) {
                    setForm(prev => ({ ...prev, ...res.data.data }));
                    reset(res.data.data);
                    setImgSrc(res.data.data?.avatarUrl ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${res.data.data?.avatarUrl}` : imgSrc)
                }
            } catch (error) {
            }
        };

        fetchBrandSetting();
    }, []);

    const onSubmit = async (data: FormValues) => {
        // setForm(prev => ({ ...prev, ...data }));
        try {
            let avatarUrl = data.avatarUrl;

            if (typeof avatarUrl === 'string' && avatarUrl.startsWith('data:image/')) {
                // Convert base64 to File
                const file = dataURLtoFile(avatarUrl, 'avatar.jpg');
                const avatarRes = await UploadAPI.uploadFiles([file]);

                avatarUrl = avatarRes?.data?.[0]?.relativeUrl || avatarUrl;
            }

            let images = form.images;
            const blobUrls = images.filter(img => typeof img === 'string' && img.startsWith('blob:'));
            const filesToUpload: File[] = [];

            for (let i = 0; i < blobUrls.length; i++) {
                const file = await blobUrlToFile(blobUrls[i], `image_${i}.jpg`);

                filesToUpload.push(file);
            }

            if (filesToUpload.length > 0) {
                const imagesRes = await UploadAPI.uploadFiles(filesToUpload);
                let uploadedIdx = 0;

                images = images.map(img => {
                    if (typeof img === 'string' && img.startsWith('blob:')) {
                        const url = imagesRes?.data?.[uploadedIdx]?.relativeUrl;

                        uploadedIdx++;
                        
return url || '';
                    }

                    
return img;
                });
            }

            const payload = {
                ...data,
                avatarUrl,
                images
            };

            const res = await brandSettingAPI.UpsertBrandSetting(payload);

            if (res.data?.success) {
                setImgSrc(form.avatarUrl ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${payload.avatarUrl}` : imgSrc)
                toast.success('Lưu thay đổi thành công!');
            } else {
                toast.error(res.data?.message || 'Lưu thay đổi thất bại!');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Đã xảy ra lỗi khi lưu thay đổi!');
        }
    };

    const handleFileInputChange = (file: ChangeEvent) => {
        const reader = new FileReader();
        const { files } = file.target as HTMLInputElement;

        if (files && files.length !== 0) {
            reader.onload = () => {
                setImgSrc(reader.result as string);
                setValue('avatarUrl', reader.result as string, { shouldValidate: true });
                setForm(prev => ({ ...prev, avatarUrl: reader.result as string })); // Thêm dòng này
            };

            reader.readAsDataURL(files[0]);
            setFileInput('');
        }
    };

    const handleFileInputReset = () => {
        setFileInput('');
        setImgSrc('/images/avatars/1.png');
        setValue('avatarUrl', '/images/avatars/1.png', { shouldValidate: true });
        setForm(prev => ({ ...prev, avatarUrl: '/images/avatars/1.png' })); // Thêm dòng này
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <Typography variant="h6" fontSize={"17px"} sx={{ p: 5 }}>
                    Cấu hình
                </Typography>
                <Divider />
                <CardContent>
                    <Typography variant="h6">Thông tin chung</Typography>
                </CardContent>
                <CardContent className='mbe-5'>
                    <div className='flex max-sm:flex-col items-center gap-6'>
                        <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
                        <div className='flex flex-grow flex-col gap-4'>
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <Button component='label' size='small' variant='contained' htmlFor='account-settings-upload-image'>
                                    Tải ảnh mới
                                    <input
                                        hidden
                                        type='file'
                                        value={fileInput}
                                        accept='image/png, image/jpeg'
                                        onChange={handleFileInputChange}
                                        id='account-settings-upload-image'
                                    />
                                </Button>
                                <Button size='small' variant='outlined' color='error' onClick={handleFileInputReset}>
                                    Xóa
                                </Button>
                            </div>
                            <Typography>Bạn nên chọn ảnh kích thước vuông</Typography>
                        </div>
                    </div>
                </CardContent>
                <CardContent>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Vui lòng nhập tên thương hiệu' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label={<span>Tên thương hiệu <span style={{ color: 'red' }}>*</span></span>}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ mb: 3 }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, name: e.target.value }));
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="shortDescription"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Mô tả ngắn'
                                sx={{ mb: 3 }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, shortDescription: e.target.value }));
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Thông tin'
                                multiline
                                minRows={3}
                                sx={{
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#a259ff',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#a259ff',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#a259ff',
                                        },
                                    },
                                }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, description: e.target.value }));
                                }}
                            />
                        )}
                    />
                </CardContent>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Liên hệ
                    </Typography>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email không hợp lệ',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Email'
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ mb: 3 }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, email: e.target.value }));
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{
                            pattern: {
                                value: /^\d{10,11}$/,
                                message: 'Số điện thoại không hợp lệ',
                            },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Số điện thoại'
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                                sx={{ mb: 3 }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, phoneNumber: e.target.value }));
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Địa chỉ'
                                sx={{ mb: 3 }}
                                onChange={e => {
                                    field.onChange(e);
                                    setForm(prev => ({ ...prev, address: e.target.value }));
                                }}
                            />
                        )}
                    />
                </CardContent>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Hình ảnh
                    </Typography>
                    <MultiFileUploader
                        onFilesChange={files => setForm(prev => ({
                            ...prev,
                            images: files.map(file => URL.createObjectURL(file))
                        }))}
                        defaultImages={form.images.map(img => img && !img.startsWith('blob:') ? `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}${img}` : undefined).filter(Boolean) as string[]}
                    />
                </CardContent>
                <CardContent>
                    <Box display="flex" justifyContent="center">
                        <Button type="submit" variant='contained'>LƯU THAY ĐỔI</Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default LeftSide; 
