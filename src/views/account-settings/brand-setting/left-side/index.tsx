import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Divider, TextField, Box } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import MultiFileUploader from '@/components/common/MultiFileUploader';

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
};

const LeftSide: React.FC<LeftSideProps> = ({ form, setForm }) => {
    const [imgSrc, setImgSrc] = React.useState<string>(form.avatarUrl || '/images/avatars/1.png');
    const [fileInput, setFileInput] = React.useState<string>('');

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        defaultValues: form,
        mode: 'onChange'
    });

    const onSubmit = (data: FormValues) => {
        setForm(prev => ({ ...prev, ...data }));
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
                        onUpload={({ data }) => setForm(prev => ({ ...prev, images: data }))}
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
