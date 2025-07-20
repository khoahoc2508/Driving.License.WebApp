'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import type { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import UploadAPI from '@/libs/api/uploadAPI'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
  name: string
  type: string
  size: number
}

interface ImageDropzoneProps {
  title?: string
  subtitle?: string
  accept?: Record<string, string[]>
  onFilesChange?: (files: File[]) => void
  onUpload?: (response: { data: string[] }) => void
  className?: string
  required?: boolean
  error?: boolean
  helperText?: string
  multiple?: boolean
  defaultImages?: string[];
}

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const MultiFileUploader = ({
  title = 'Thả tệp vào đây hoặc click để tải lên',
  subtitle = 'Bạn có thể kéo nhiều file đồng thời',
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif']
  },
  onFilesChange,
  onUpload,
  className,
  required = false,
  error = false,
  helperText,
  multiple = true,
  defaultImages = []
}: ImageDropzoneProps) => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file: File) => Object.assign(file))
      setFiles(newFiles)
      onFilesChange?.(newFiles)
    },
    accept,
    multiple
  })

  const inputProps = getInputProps()


  // Ensure value is never null
  const safeInputProps = {
    ...inputProps,
    value: inputProps.value || ''
  }

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <i className='ri-file-text-line' />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)

    setFiles([...filtered])
    onFilesChange?.(filtered)
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file.name}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='ri-close-line text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    onFilesChange?.([])
  }

  // const handleUpload = async () => {
  //   try {
  //     const response = await UploadAPI.uploadFiles(files)

  //     toast.success("Tải file thành công")
  //     onUpload?.({ data: response.data.map((file: { relativeUrl: string | null }) => file.relativeUrl || '') })
  //   } catch (error) {
  //     toast.error("Tải file thất bại")
  //   }
  // }

  // Render ảnh từ defaultImages
  const renderDefaultImages = () => (
    <List>
      {defaultImages.map((url, idx) => (
        <ListItem key={url + idx} className='pis-4 plb-3'>
          <div className='file-details'>
            <div className='file-preview'>
              <img width={38} height={38} alt={`default-img-${idx}`} src={url} />
            </div>
            <div>
              <Typography className='file-name font-medium' color='text.primary'>
                Ảnh đã lưu
              </Typography>
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Dropzone className={className}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...safeInputProps} />
        <div className='flex items-center flex-col gap-2 text-center'>
          <CustomAvatar variant='rounded' skin='light' color={error ? 'error' : 'secondary'}>
            <i className='ri-upload-2-line' />
          </CustomAvatar>
          <Typography variant='h4'>{title}{required && '(*)'}</Typography>
          <Typography color='text.disabled'>{subtitle}</Typography>
          <Button variant='outlined' size='small'>
            Ảnh từ thiết bị
          </Button>
        </div>
      </div>
      {error && helperText && (
        <Typography color='error' variant='caption' className='mt-1'>
          {helperText}
        </Typography>
      )}
      {defaultImages.length > 0 && renderDefaultImages()}
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            {/* <Button variant='contained' onClick={handleUpload}>Upload Files</Button> */}
          </div>
        </>
      ) : null}
    </Dropzone>
  )
}

export default MultiFileUploader
