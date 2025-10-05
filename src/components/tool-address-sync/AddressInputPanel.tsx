'use client'

// React Imports

// MUI Imports
import {
  Card,
  CardContent,
  CardHeader,
  Autocomplete,
  TextField,
  Typography
} from '@mui/material'

// Form Imports
import { Controller } from 'react-hook-form'

// Types
import type { DropdownOption } from './index'

interface AddressInputPanelProps {
  title: string
  control: any
  setValue: any
  watch: any
  provinces: DropdownOption[]
  districts: DropdownOption[]
  wards: DropdownOption[]
  showDistrict: boolean
  fieldPrefix: 'old' | 'new'
  showAddressDetail?: boolean
}

const AddressInputPanel = ({
  title,
  control,
  setValue,
  watch,
  provinces,
  districts,
  wards,
  showDistrict,
  fieldPrefix,
  showAddressDetail = false
}: AddressInputPanelProps) => {
  // Watch form values for disabled state
  const provinceValue = watch(`${fieldPrefix}Province`)
  const districtValue = watch(`${fieldPrefix}District`)
  const wardValue = watch(`${fieldPrefix}Ward`)

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h5">
            {title}
          </Typography>
        }
        className='text-left py-3 mb-4'
        style={{
          borderBottom: '1px solid #e0e0e0',
        }}
        sx={{ flexShrink: 0 }}
      />
      <CardContent sx={{
        p: 4,
        pt: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }}>
        {/* Province Field */}
        <Controller
          name={`${fieldPrefix}Province` as any}
          control={control}
          rules={{ required: `Vui lòng chọn tỉnh/thành phố ${fieldPrefix === 'old' ? 'cũ' : 'mới'}` }}
          render={({ field, fieldState }) => (
            <Autocomplete
              value={provinces.find(p => p.value === field.value) || null}
              onChange={(_, newValue) => {
                field.onChange(newValue?.value || '')


                // Clear district and ward when province changes
                if (showDistrict) {
                  setValue(`${fieldPrefix}District`, '')
                }

                setValue(`${fieldPrefix}Ward`, '')
              }}
              options={provinces}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<span>Tỉnh/Thành phố <span style={{ color: 'red' }}>(*)</span></span>}
                  placeholder="Chọn tỉnh/thành phố"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
              noOptionsText='Không có dữ liệu'
            />
          )}
        />

        {/* District Field - Only show if showDistrict is true */}
        {showDistrict && (
          <Controller
            name={`${fieldPrefix}District` as any}
            control={control}
            rules={{ required: 'Vui lòng chọn quận/huyện cũ' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                value={districts.find(d => d.value === field.value) || null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.value || '')

                  // Clear ward when district changes
                  setValue(`${fieldPrefix}Ward`, '')
                }}
                options={districts}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={!provinceValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<span>Quận/Huyện <span style={{ color: 'red' }}>(*)</span></span>}
                    placeholder="Chọn quận/huyện"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
                noOptionsText='Không có dữ liệu'
              />
            )}
          />
        )}

        {/* Ward Field */}
        <Controller
          name={`${fieldPrefix}Ward` as any}
          control={control}
          rules={{ required: `Vui lòng chọn xã/phường ${fieldPrefix === 'old' ? 'cũ' : 'mới'}` }}
          render={({ field, fieldState }) => (
            <Autocomplete
              value={wards.find(w => w.value === field.value) || null}
              onChange={(_, newValue) => field.onChange(newValue?.value || '')}
              options={wards}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              disabled={showDistrict ? !districtValue : !provinceValue}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<span>Xã/Phường <span style={{ color: 'red' }}>(*)</span></span>}
                  placeholder="Chọn xã/phường"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
              noOptionsText='Không có dữ liệu'
            />
          )}
        />

        {/* Address Detail Field - Only show if showAddressDetail is true */}
        {showAddressDetail && (
          <Controller
            name={`${fieldPrefix}AddressDetail` as any}
            control={control}
            rules={{ required: 'Vui lòng nhập địa chỉ chi tiết' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={<span>Địa chỉ chi tiết <span style={{ color: 'red' }}>(*)</span></span>}
                placeholder="Nhập địa chỉ chi tiết"
                fullWidth
                disabled={!wardValue}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default AddressInputPanel
