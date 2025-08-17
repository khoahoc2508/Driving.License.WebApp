'use client'

import CONFIG from "@/configs/config";
import { components } from "@/libs/api/client/schema";
import LicenseTypeAPI from "@/libs/api/licenseTypeApi";
import assigneeAPI from "@/libs/api/assigneeAPI";
import { SCREEN_TYPE } from "@/types/Common";
import { LicenseTypeDto } from "@/types/examSubmissionTypes";
import { VehicleTypeDto } from "@/types/LicensesRegistrations";
import { CreateRegistrationRecordCommand, GenderType } from "@/types/registrationRecords";
import { AssigneeType } from "@/types/assigneeTypes";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from "react-toastify";
// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Header from "@/views/manage-licenses-registrations/form/Header";
import PersonalInformation from "./PersonalInformation";
import { useRouter } from 'next/navigation'
import { Button, Divider, Typography, useTheme } from "@mui/material";
import CitizenCard from "./CitizenCard";
import InfomationRegister from "./InfomationRegister";
import Autocomplete from '@mui/material/Autocomplete'


type UpsertRegistrationRecordProps = {
  screenType: SCREEN_TYPE
  id?: string
}


type FormValues = {
  fullname?: string;
  birthday?: Date | null | undefined;
  gender?: components["schemas"]["GenderType"];
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

const UpsertRegistrationRecord = ({ screenType, id }: UpsertRegistrationRecordProps) => {
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([])
  const [staffAssigneeOptions, setStaffAssigneeOptions] = useState<{ label: string; value: string }[]>([])
  const [collaboratorOptions, setCollaboratorOptions] = useState<{ label: string; value: string }[]>([])
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
      gender: undefined,
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
        const response = await LicenseTypeAPI.getAllLicenseTypes({
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log('Form data:', data)
    // Form sẽ tự động validate và hiển thị lỗi
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
          Thêm mới hồ sơ
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
        <Button variant='contained' color='primary' type='submit' form='registration-record-form'>
          Lưu thay dổi
        </Button>
      </CardContent>
    </Card>
  );
}

export default UpsertRegistrationRecord
