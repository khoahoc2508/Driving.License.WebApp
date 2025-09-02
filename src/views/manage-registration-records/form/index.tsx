'use client'

import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation'

import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form'

import { toast } from "react-toastify";

import Card from '@mui/material/Card'

import CardContent from '@mui/material/CardContent'


import Grid from '@mui/material/Grid2'

import TextField from '@mui/material/TextField'

import { Button, Divider, Typography, useTheme } from "@mui/material";

import Autocomplete from '@mui/material/Autocomplete'

import CONFIG from "@/configs/config";
import type { components } from "@/libs/api/client/schema";
import LicenseTypeAPI from "@/libs/api/licenseTypeApi";
import assigneeAPI from "@/libs/api/assigneeAPI";
import UploadAPI from "@/libs/api/uploadAPI";
import type { LicenseTypeDto } from "@/types/examSubmissionTypes";
import type { CreateRegistrationRecordCommand, UpdateRegistrationRecordCommand } from "@/types/registrationRecords";
import type { AssigneeType } from "@/types/assigneeTypes";

// MUI Imports

import PersonalInformation from "./PersonalInformation";



import CitizenCard from "./CitizenCard";
import InfomationRegister from "./InfomationRegister";


import registrationRecordsAPI from "@/libs/api/registrationRecordsAPI";


type UpsertRegistrationRecordProps = {
  id?: string
}


type FormValues = {
  fullname?: string;
  birthday?: Date | null | undefined;
  gender?: components["schemas"]["GenderType"] | null;
  licenseTypeCode?: string;
  avatarUrl?: (string | File)[]
  phone?: string;
  email?: string | null;
  address?: string | null;
  citizenIdNumber?: string;
  citizenIdFrontImageUrl?: (string | File)[]
  citizenIdBackImageUrl?: (string | File)[]
  receivedDate?: Date | null | undefined;
  healthCheckDate?: Date | null | undefined
  staffAssigneeId?: string | null;
  collaboratorId?: string | null;
  note?: string | null;
}

const UpsertRegistrationRecord = ({ id }: UpsertRegistrationRecordProps) => {
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([])
  const [staffAssigneeOptions, setStaffAssigneeOptions] = useState<{ label: string; value: string }[]>([])
  const [collaboratorOptions, setCollaboratorOptions] = useState<{ label: string; value: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const router = useRouter()

  // Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues
  } = useForm<FormValues>({
    defaultValues: {
      fullname: '',
      birthday: null,
      gender: null,
      licenseTypeCode: '',
      avatarUrl: [],
      phone: '',
      email: '',
      address: '',
      citizenIdNumber: '',
      citizenIdFrontImageUrl: [],
      citizenIdBackImageUrl: [],
      receivedDate: new Date(),
      healthCheckDate: null,
      staffAssigneeId: '',
      collaboratorId: '',
      note: ''
    },
    mode: 'onSubmit'
  })

  useEffect(() => {
    const fetchLicenseTypes = async () => {

      try {
        const response = await LicenseTypeAPI.getAllLicenseTypesAvailable({
        });

        if (response.data.success) {
          const newLicenseTypes = response.data.data || [];

          setLicenseTypes(newLicenseTypes);

          const currentLicenseType = getValues('licenseTypeCode');
          const licenseTypeExists = newLicenseTypes.some((type: LicenseTypeDto) => type.code === currentLicenseType);

          if (!licenseTypeExists) {
            setValue('licenseTypeCode', '');
          }
        }
      } catch (error) {
        console.error('Error fetching license types:', error);
        toast.error('Lỗi khi tải danh sách bằng lái');
      }
    };

    fetchLicenseTypes();
  }, []);

  useEffect(() => {
    // Fetch initial staff assignees and collaborators
    fetchStaffAssignees()
    fetchCollaborators()
  }, []);

  // Fetch data when id exists (edit mode)
  useEffect(() => {
    if (id) {
      fetchRegistrationRecordData()
    }
  }, [id]);

  const fetchStaffAssignees = async () => {
    try {
      const res = await assigneeAPI.GetAssignees({
        assigneeType: CONFIG.AssigneeTypes.Employee as AssigneeType,
        pageNumber: 1,
        pageSize: 9999
      })

      if (res?.data?.data) {
        const options = res.data.data.map((assignee: any) => ({
          label: assignee.fullName || 'Unknown',
          value: assignee.id || ''
        }))

        setStaffAssigneeOptions(options)
      }
    } catch (error: any) {
      console.error('Error fetching staff assignees:', error)
      setStaffAssigneeOptions([])
    }
  }

  const fetchCollaborators = async () => {
    try {
      const res = await assigneeAPI.GetAssignees({
        assigneeType: CONFIG.AssigneeTypes.Collaborator as AssigneeType,
        pageNumber: 1,
        pageSize: 9999
      })

      if (res?.data?.data) {
        const options = res.data.data.map((assignee: any) => ({
          label: assignee.fullName || 'Unknown',
          value: assignee.id || ''
        }))

        setCollaboratorOptions(options)
      }
    } catch (error: any) {
      console.error('Error fetching collaborators:', error)
      setCollaboratorOptions([])
    }
  }

  const fetchRegistrationRecordData = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      const response = await registrationRecordsAPI.GetRegistrationRecordById(id)

      if (response.data.success) {
        const data = response.data.data

        setValue('fullname', data.fullname || '')
        setValue('birthday', data.birthday ? new Date(data.birthday) : null)

        const genderValue = data.gender !== undefined && data.gender !== null ? Number(data.gender) as 0 | 1 | 2 : null

        setValue('gender', genderValue)

        setValue('licenseTypeCode', data?.licenseTypeCode || '')
        setValue('phone', data.phone || '')
        setValue('email', data.email || '')
        setValue('address', data.address || '')
        setValue('citizenIdNumber', data.citizenIdNumber || '')
        setValue('receivedDate', data.receivedDate ? new Date(data.receivedDate) : new Date())
        setValue('healthCheckDate', data.healthCheckDate ? new Date(data.healthCheckDate) : null)
        setValue('staffAssigneeId', data.staffAssigneeId || '')
        setValue('collaboratorId', data.collaboratorId || '')
        setValue('note', data.note || '')

        if (data.avatarUrl && data.avatarUrl !== '') {
          setValue('avatarUrl', [data.avatarUrl])
        }

        if (data.citizenIdFrontImageUrl && data.citizenIdFrontImageUrl !== '') {
          setValue('citizenIdFrontImageUrl', [data.citizenIdFrontImageUrl])
        }

        if (data.citizenIdBackImageUrl && data.citizenIdBackImageUrl !== '') {
          setValue('citizenIdBackImageUrl', [data.citizenIdBackImageUrl])
        }
      }
    } catch (error) {
      console.error('Error fetching registration record data:', error)
      toast.error('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const uploadFile = async (fileOrUrl: string | File | undefined): Promise<string | undefined> => {
      if (fileOrUrl instanceof File) {
        try {
          const response = await UploadAPI.uploadFiles([fileOrUrl]);


          return response?.data?.[0]?.relativeUrl;
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Lỗi khi tải lên ảnh");

          return undefined;
        }
      } else if (typeof fileOrUrl === 'string') {
        const uploadsIndex = fileOrUrl.indexOf('training/uploads/');

        if (uploadsIndex !== -1) {
          return fileOrUrl.substring(uploadsIndex);
        } else {
          return fileOrUrl;
        }
      }


      return undefined;
    };

    try {
      // Upload files
      const uploadedAvatarUrl = await uploadFile(data.avatarUrl?.[0]);
      const uploadedCitizenIdFrontUrl = await uploadFile(data.citizenIdFrontImageUrl?.[0]);
      const uploadedCitizenIdBackUrl = await uploadFile(data.citizenIdBackImageUrl?.[0]);

      // Prepare payload based on mode
      const basePayload = {
        fullname: data.fullname,
        birthday: data.birthday ? `${data.birthday.getFullYear()}-${(data.birthday.getMonth() + 1).toString().padStart(2, '0')}-${data.birthday.getDate().toString().padStart(2, '0')}` : '',
        gender: data.gender !== null ? Number(data.gender) as 0 | 1 | 2 : undefined,
        licenseTypeCode: data.licenseTypeCode,
        avatarUrl: uploadedAvatarUrl || '',
        phone: data.phone,
        email: data.email,
        address: data.address,
        citizenIdNumber: data.citizenIdNumber,
        citizenIdFrontImageUrl: uploadedCitizenIdFrontUrl || '',
        citizenIdBackImageUrl: uploadedCitizenIdBackUrl || '',
        receivedDate: data.receivedDate ? new Date(data.receivedDate.getFullYear(), data.receivedDate.getMonth(), data.receivedDate.getDate()).toISOString() : '',
        healthCheckDate: data.healthCheckDate ? new Date(data.healthCheckDate.getFullYear(), data.healthCheckDate.getMonth(), data.healthCheckDate.getDate()).toISOString() : null,
        staffAssigneeId: data.staffAssigneeId || null,
        collaboratorId: data.collaboratorId || null,
        note: data.note
      };

      if (id) {
        // Edit mode - use UpdateRegistrationRecordCommand
        const updatePayload: UpdateRegistrationRecordCommand = basePayload as UpdateRegistrationRecordCommand;

        await registrationRecordsAPI.UpdateRegistrationRecord(id, updatePayload);
      } else {
        // Create mode - use CreateRegistrationRecordCommand
        const createPayload: CreateRegistrationRecordCommand = basePayload as CreateRegistrationRecordCommand;

        await registrationRecordsAPI.CreateRegistrationRecord(createPayload);
      }

      toast.success(id ? 'Cập nhật thành công!' : 'Lưu thông tin thành công!');
      router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    }
  }

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`)}
          className="w-10 h-10 border-2 border-primary"
        >
          <i className="ri-arrow-left-line" style={{ fontSize: '20px', color: theme.palette.primary.main }} />
        </Button>
        <Typography variant='h4'>
          {id ? 'Chỉnh sửa hồ sơ' : 'Thêm mới hồ sơ'}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent className="p-4">
        <form id="registration-record-form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='h5' className="mb-4">
            Thông tin chung
          </Typography>
          <PersonalInformation
            control={control}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
          />
          <Divider className="my-4" />
          <Typography variant='h5' className="my-4">
            Căn cước công dân
          </Typography>
          <CitizenCard
            control={control}
            errors={errors}
          />
          <Divider className="my-4" />
          <Typography variant='h5' className="my-4">
            Thông tin đăng ký
          </Typography>
          <InfomationRegister
            control={control}
            errors={errors}
            licenseTypes={licenseTypes}
          />
          <Divider className="my-4" />
          <Typography variant='h5' className="my-4">
            Giao việc
          </Typography>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='staffAssigneeId'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={staffAssigneeOptions.find(opt => opt.value === field.value) || null}
                    options={staffAssigneeOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    onChange={(_event, newValue) => {
                      field.onChange(newValue ? newValue.value : '')
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Người phụ trách"
                        error={!!errors.staffAssigneeId}
                        helperText={errors.staffAssigneeId?.message}
                      />
                    )}
                    noOptionsText='Không có dữ liệu'
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider className="my-4" />
          <Typography variant='h5' className="my-4">
            Thông tin thêm
          </Typography>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='collaboratorId'
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    value={collaboratorOptions.find(opt => opt.value === field.value) || null}
                    options={collaboratorOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    onChange={(_event, newValue) => {
                      field.onChange(newValue ? newValue.value : '')
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cộng tác viên"
                        error={!!errors.collaboratorId}
                        helperText={errors.collaboratorId?.message}
                      />
                    )}
                    noOptionsText='Không có dữ liệu'
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Divider />
      <CardContent className="flex gap-4 p-4 justify-end">
        <Button variant='outlined' color='secondary' onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`)}>
          Hủy
        </Button>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          form='registration-record-form'
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default UpsertRegistrationRecord
