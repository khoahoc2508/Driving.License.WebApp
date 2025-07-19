import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Divider, TextField, Box } from '@mui/material';
import type { ChangeEvent } from 'react'
import { Controller, useForm } from 'react-hook-form';
import MultiFileUploader from '@/components/common/MultiFileUploader';


export type FormValues = {
    avatarUrl: string
    name: string,
    shortDescription: string
    description: string
    email: string
    phoneNumber: string
    address: string,
    images: []
}

type LeftSideProps = {
    form: FormValues;
    setForm: React.Dispatch<React.SetStateAction<FormValues>>;
};

const LeftSide: React.FC<LeftSideProps> = ({ form, setForm }) => {
    const [imgSrc, setImgSrc] = useState<string>(form.avatarUrl || '/images/avatars/1.png');
    const [fileInput, setFileInput] = useState<string>('');

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
        getValues,
        reset
    } = useForm<FormValues>({
        defaultValues: form,
        mode: 'onChange'
    });

    // Đồng bộ form khi props.form thay đổi
    useEffect(() => {
        reset(form);
        setImgSrc(form.avatarUrl || '/images/avatars/1.png');
    }, [form, reset]);

    // Khi form thay đổi, cập nhật lên cha
    useEffect(() => {
        const subscription = watch((values) => {
            setForm((prev) => ({ ...prev, ...values }));
        });
        return () => subscription.unsubscribe();
    }, [watch, setForm]);

    const handleFileInputChange = (file: ChangeEvent) => {
        const reader = new FileReader()
        const { files } = file.target as HTMLInputElement

        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result as string)
            reader.readAsDataURL(files[0])

            if (reader.result !== null) {
                setFileInput(reader.result as string)
            }
        }
    }

    const handleFileInputReset = () => {
        setFileInput('')
        setImgSrc('/images/avatars/1.png')
    }


    return (
        <Card>
            <Typography variant="h6" fontSize={"17px"} sx={{ p: 5 }}>
                Cấu hình
            </Typography>
            <Divider />
            <CardContent>
                <Typography variant="h6">
                    Thông tin chung
                </Typography>
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
                    name='name'
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
                        />
                    )}
                />
                <Controller
                    name='shortDescription'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label='Mô tả ngắn'
                            sx={{ mb: 3 }}
                        />
                    )}
                />
                <Controller
                    name='description'
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
                        />
                    )}
                />
            </CardContent>

            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Liên hệ
                </Typography>
                <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label='Email'
                            sx={{ mb: 3 }}
                        />
                    )}
                />
                <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label='Số điện thoại'
                            sx={{ mb: 3 }}
                        />
                    )}
                />
                <Controller
                    name='address'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            label='Địa chỉ'
                        />
                    )}
                />
            </CardContent>

            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Hình ảnh
                </Typography>
                <MultiFileUploader />
            </CardContent>
            <CardContent>
                <Box display="flex" justifyContent="center">
                    <Button variant='contained'>LƯU THAY ĐỔI</Button>
                </Box>
            </CardContent >
        </Card >
    );
};

export default LeftSide; 
