// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import type { SelectChangeEvent } from '@mui/material/Select'
import Select from '@mui/material/Select'
import { toast } from 'react-toastify'

import LicenseTypeAPI from '@/libs/api/licenseTypeApi'
import type { LicenseTypeDto } from '@/types/LicensesRegistrations'
import CONFIG from '@/configs/config'

// Type Imports
interface TableFiltersProps {
  onApplyFilters: (status: boolean[], licenseTypeCodes: string[]) => void;
}

const TableFilters = ({ onApplyFilters }: TableFiltersProps) => {
  // States
  const [selectedStatus, setSelectedStatus] = useState<boolean[]>([])
  const [selectedLicenseType, setSelectedLicenseType] = useState<string[]>([])
  const [licenseTypes, setLicenseTypes] = useState<LicenseTypeDto[]>([])

  // Fetch license types on component mount
  useEffect(() => {
    const fetchLicenseTypes = async () => {
      try {
        const response = await LicenseTypeAPI.getAllLicenseTypes({});

        if (response.data.success) {
          setLicenseTypes(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching license types:', error);
        toast.error('Lỗi khi tải danh sách bằng lái');
      }
    };

    fetchLicenseTypes();
  }, []);

  // Handlers for filter selection
  const handleStatusSelect = (event: SelectChangeEvent<boolean[]>) => {
    const value = event.target.value as boolean[]

    setSelectedStatus(value)
    onApplyFilters(value, selectedLicenseType)
  }

  const handleLicenseTypeSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[]

    setSelectedLicenseType(value)
    onApplyFilters(selectedStatus, value)
  }

  return (
    <CardContent>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Trạng thái</InputLabel>
            <Select
              fullWidth
              id='select-status'
              value={selectedStatus}
              onChange={handleStatusSelect}
              label='Trạng thái'
              labelId='status-select'
              multiple
            >
              <MenuItem value={CONFIG.ApprovedOption[0].value.toString()}>Đã duyệt</MenuItem>
              <MenuItem value={CONFIG.ApprovedOption[1].value.toString()}>Chưa duyệt</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id='license-type-select'>Loại bằng</InputLabel>
            <Select
              fullWidth
              id='select-license-type'
              value={selectedLicenseType}
              onChange={handleLicenseTypeSelect}
              label='Loại bằng'
              labelId='license-type-select'
              multiple
            >
              {licenseTypes.map((type) => (
                <MenuItem key={type.code} value={type.code}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
