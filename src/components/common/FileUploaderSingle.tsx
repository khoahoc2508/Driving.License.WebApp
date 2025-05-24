// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

interface FileUploaderSingleProps {
    file?: File | null
    setFile?: (file: File | null) => void
    imageUrl?: string
    setImageUrl?: (url: string) => void
    error?: boolean
    helperText?: string
    description?: string
}

const FileUploaderSingle = ({
    file,
    setFile,
    imageUrl,
    setImageUrl,
    error,
    helperText,
    description = 'Drop files here or click to upload.'
}: FileUploaderSingleProps) => {
    // States
    const [localFile, setLocalFile] = useState<File | null>(file || null)

    // Hooks
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: (acceptedFiles: File[]) => {
            const newFile = acceptedFiles[0]
            setLocalFile(newFile)
            if (setFile) setFile(newFile)
            if (setImageUrl) setImageUrl(URL.createObjectURL(newFile))
        }
    })

    const displayImage = imageUrl || (localFile ? URL.createObjectURL(localFile) : null)

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
                {...(displayImage && {})}
            >
                <input {...getInputProps()} />
                {displayImage ? (
                    <Box sx={{
                        width: '100%',
                        paddingTop: '133.33%', // 4:3 ratio
                        position: 'relative',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1
                    }}>
                        <img
                            src={displayImage}
                            alt="Uploaded file"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                ) : (
                    <div className='flex items-center flex-col h-full justify-center'>
                        <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
                            <i className='ri-upload-2-line' />
                        </Avatar>
                        <Typography variant='h4' className='mbe-2.5'>
                            {description}
                        </Typography>
                        <Typography color='text.secondary'>
                            <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
                                Kéo file vào hoặc chọn từ thiết bị
                            </a>
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
