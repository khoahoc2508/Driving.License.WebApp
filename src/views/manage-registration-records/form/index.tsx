'use client'

import CONFIG from "@/configs/config";
import { components } from "@/libs/api/client/schema";
import LicenseTypeAPI from "@/libs/api/licenseTypeApi";
import { SCREEN_TYPE } from "@/types/Common";
import { LicenseTypeDto } from "@/types/examSubmissionTypes";
import { VehicleTypeDto } from "@/types/LicensesRegistrations";
import { CreateRegistrationRecordCommand, GenderType } from "@/types/registrationRecords";
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
import { Button, Divider, Typography } from "@mui/material";

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
      gender: CONFIG.SexType.Male as GenderType,
      licenseTypeCode: '',
      avatarUrl: [],
      phone: '',
      email: '',
      address: '',
      citizenIdNumber: '',
      citizenIdFrontImageUrl: [],
      citizenIdBackImageUrl: [],
      receivedDate: null,
      healthCheckDate: null,
      staffAssigneeId: '',
      collaboratorId: '',
      note: ''
    },
    mode: 'onChange'
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


  const onSubmit: SubmitHandler<FormValues> = async () => {
  }

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <Button variant='outlined' color='secondary' onClick={() => router.push(`${CONFIG.Routers.ManageRegistrationRecords}/list`)}>
          Đóng
        </Button>
        <Typography variant='h4'>
          Thêm mới hồ sơ
        </Typography>
      </CardContent>
      <Divider />
      <CardContent className="p-4">
        <Typography variant='h4'>
          Thông tin chung
        </Typography>
        <form id="registration-record-form" onSubmit={handleSubmit(onSubmit)}>
          <PersonalInformation
            control={control}
            errors={errors}
            setValue={setValue}
            trigger={trigger}
            watch={watch}
          />
        </form>
      </CardContent>
    </Card>
  );
}

export default UpsertRegistrationRecord
