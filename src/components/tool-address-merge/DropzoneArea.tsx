'use client'

import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'

import CustomAvatar from '@core/components/mui/Avatar'
import type { FileItem } from './FileItem'
import FileItemComponent from './FileItem'

// Styled Components
const DropzoneCard = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[2]
  }
}))

interface DropzoneAreaProps {
  onFilesAdded: (files: FileItem[]) => void
  uploadedFiles: FileItem[]
  onRemoveFile: (fileId: string) => void
}

const DropzoneArea = ({ onFilesAdded, uploadedFiles, onRemoveFile }: DropzoneAreaProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles: FileItem[] = acceptedFiles.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }))

      onFilesAdded(newFiles)
    }
  })

  return (
    <Box>
      {/* Upload Area */}
      <DropzoneCard {...getRootProps()} className='py-7 min-h-[200px]'>
        <input {...getInputProps()} />
        <CustomAvatar
          variant="rounded"
          sx={{
            margin: '0 auto',
            mb: 4,
            width: 30,
            height: 30,
          }}
        >
          <i className="ri-upload-2-line" style={{ fontSize: 24 }} />
        </CustomAvatar>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Tải file excel <span className='font-bold'>địa chỉ cũ</span> <span style={{ color: 'red' }}>(*)</span>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Nội dung file excel phải có cột Địa Chỉ để chuyển đổi chính xác
        </Typography>
        <Typography variant="caption" sx={{ color: 'error.main' }}>
          Tối đa 5 file
        </Typography>
      </DropzoneCard>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {uploadedFiles.map((file) => (
            <FileItemComponent
              key={file.id}
              file={file}
              onAction={onRemoveFile}
              actionIcon="ri-close-line"
              actionColor="error.main"
              actionHoverBg="error.light"
              actionHoverColor="error.dark"
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default DropzoneArea
