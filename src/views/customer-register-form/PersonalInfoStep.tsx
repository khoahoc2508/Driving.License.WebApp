'use client'

import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import DirectionalIcon from '@/components/common/DirectionalIcon'
import Button from '@mui/material/Button'
import { useFormContext } from 'react-hook-form'

type PersonalInfoForm = {
    firstName: string;
    lastName: string;
    country: string;
    language: string[];
}

type Step = {
    active: number;
    title: string;
    desc: string | null;
    Icon: any;
}

type PersonalInfoStepProps = {
    steps: Step[];
    handleBack: () => void;
    handleNext: () => void;
    Languages: string[];
}

const PersonalInfoStep = ({ steps, handleBack, handleNext, Languages }: PersonalInfoStepProps) => {
    const { control, formState: { errors }, handleSubmit } = useFormContext<PersonalInfoForm>();

    const handlePersonalInfoSubmit = (data: PersonalInfoForm) => {
        console.log('PersonalInfo Data:', data);
        handleNext();
    };

    return (
        <form key={1} onSubmit={handleSubmit(handlePersonalInfoSubmit)} className='h-full w-full'>
            <Grid container spacing={5}>
                <Grid size={{ xs: 12 }}>
                    <Typography className='font-medium' color='text.primary'>
                        {steps[1].title}
                    </Typography>
                    {steps[1].desc && <Typography variant='body2'>{steps[1].desc}</Typography>}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='firstName'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='First Name'
                                placeholder='John'
                                {...(errors.firstName && { error: true, helperText: errors.firstName.message })}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Controller
                        name='lastName'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Last Name'
                                placeholder='Doe'
                                {...(errors.lastName && { error: true, helperText: errors.lastName.message })}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel error={Boolean(errors.country)}>Country</InputLabel>
                        <Controller
                            name='country'
                            control={control}
                            render={({ field }) => (
                                <Select label='Country' {...field} error={Boolean(errors.country)}>
                                    <MenuItem value='UK'>UK</MenuItem>
                                    <MenuItem value='USA'>USA</MenuItem>
                                    <MenuItem value='Australia'>Australia</MenuItem>
                                    <MenuItem value='Germany'>Germany</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.country && <FormHelperText error>country is a required field</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                        <InputLabel error={Boolean(errors.language)}>Language</InputLabel>
                        <Controller
                            name='language'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                                <Select
                                    multiple
                                    label='Language'
                                    value={Array.isArray(value) ? value : []}
                                    onChange={onChange}
                                    error={Boolean(errors.language)}
                                >
                                    {Languages.map(language => (
                                        <MenuItem key={language} value={language}>
                                            {language}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.language && <FormHelperText error>language is a required field</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }} className='flex justify-between'>
                    <Button
                        variant='outlined'
                        onClick={handleBack}
                        color='secondary'
                        startIcon={<DirectionalIcon ltrIconClass='ri-arrow-left-line' rtlIconClass='ri-arrow-right-line' />}
                    >
                        Back
                    </Button>
                    <Button
                        variant='contained'
                        type='submit'
                        endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PersonalInfoStep 
