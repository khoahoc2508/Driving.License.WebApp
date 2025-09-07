// React Imports
import { useEffect, useState, type ReactNode } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import type { ControllerRenderProps } from 'react-hook-form'

interface FileUploaderSingleProps {
  field: ControllerRenderProps<any, any>; // Accept the field object from react-hook-form
  error?: boolean
  helperText?: string
  description?: ReactNode
}

const FileUploaderSingle = ({
  field,
  error,
  helperText,
  description = 'Drop files here or click to upload.'
}: FileUploaderSingleProps) => {
  // States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (field.value && typeof field.value[0] === 'string') {
      setPreviewUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + field.value[0])
    } else if (field.value && field.value[0] instanceof File) {
      setPreviewUrl(URL.createObjectURL(field.value[0]))
    } else {
      setPreviewUrl(null)
    }


    // Clean up blob URL on unmount or value change
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [field.value])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0]


      // Update the form field value with the actual File object
      field.onChange([newFile])

      // Update preview URL with blob URL
      setPreviewUrl(URL.createObjectURL(newFile))
    }
  })

  const displayImage = previewUrl != "" ? previewUrl : null

  return (
    <Box height={"100%"}>
      <Box
        {...getRootProps({
          className: 'dropzone',
          sx: {
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 3,
            cursor: 'pointer',
            height: '100%',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }
        })}
        {...(displayImage && {
          sx: {
            height: 260,
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 3,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }
        })}
      >
        <input {...getInputProps()} />
        {displayImage ? (
          <img
            src={`${displayImage}`}
            alt="Uploaded file"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            className='single-file-image'
          />
        ) : (
          <div className='flex items-center flex-col h-full justify-center'>
            <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
              <i className='ri-upload-2-line' />
            </Avatar>
            <Typography variant='h5' className='mbe-2.5'>
              {description}
            </Typography>
            <Typography color='text.secondary'>
              Kéo thả file để upload
            </Typography>
          </div>
        )}
      </Box>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  )
}

export default FileUploaderSingle
