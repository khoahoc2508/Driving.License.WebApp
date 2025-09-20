'use client'

// React Imports

import { useState, useCallback } from 'react'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Skeleton
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import { toast } from 'react-toastify'

import CustomAvatar from '@core/components/mui/Avatar'

// API Imports
import AddressConversionAPI from '@/libs/api/addressConversionAPI'

// Enums
enum InputMode {
  EXCEL = 'excel',
  MANUAL = 'manual'
}

// Styled Components

const DropzoneCard = styled(Card)(({ theme }) => ({
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

const FileItemCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '6px',
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
}))

// Common Button Styles
const tabButtonStyles = (isActive: boolean) => ({
  flex: 1,
  py: 2,
  px: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  transition: 'all 0.3s ease',
  backgroundColor: isActive ? 'primary.main' : 'transparent',
  color: isActive ? 'white' : 'text.primary !important',
  boxShadow: isActive ? '0 2px 8px rgba(124, 77, 255, 0.3)' : 'none',
  position: 'relative',
  '&:hover': {
    backgroundColor: isActive ? '#6a3de8 !important' : '#e9ecef',
    boxShadow: isActive ? '0 4px 12px rgba(124, 77, 255, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
})

// Common Icon Button Styles - Removed, using inline styles instead

interface FileItem {
  id: string
  name: string
  size: number
  type: string
  file?: File
  downloadUrl?: string
}

const ToolAddressMerge = () => {
  // States
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.EXCEL)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  const [outputFiles, setOutputFiles] = useState<FileItem[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  console.log(success)

  // Manual input states
  const [oldAddressInput, setOldAddressInput] = useState<string>('')
  const [newAddressOutput, setNewAddressOutput] = useState<string>('')
  const [textConversionResults, setTextConversionResults] = useState<any[]>([])

  // Initialize with empty arrays - no mock data needed

  // Dropzone hooks
  const { getRootProps: getDropzoneRootProps, getInputProps: getDropzoneInputProps } = useDropzone({
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

      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  })

  // Handlers
  const handleInputModeChange = (newMode: InputMode) => {
    setInputMode(newMode)
  }

  const handleRemoveFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }, [])

  const handleDownloadFile = useCallback(async (fileId: string) => {
    try {
      // Find the file in outputFiles (converted files)
      const file = outputFiles.find(f => f.id === fileId)

      if (file && file.downloadUrl) {
        // Download directly from URL
        await AddressConversionAPI.downloadConvertedFile(file.downloadUrl, file.name)
        setSuccess(`Đã tải xuống file: ${file.name}`)
        toast.success(`Đã tải xuống file: ${file.name}`)
      }
    } catch (error: any) {
      console.error('Error downloading file:', error)
      toast.error(error?.message || 'Có lỗi xảy ra khi tải xuống file. Vui lòng thử lại.')
      setSuccess(null)
    }
  }, [outputFiles])

  const handleDownloadAll = async () => {
    try {
      // Download all converted files that have downloadUrl
      const convertedFiles = outputFiles.filter(f => f.downloadUrl)

      if (convertedFiles.length > 0) {
        // Download all files from their URLs sequentially to avoid browser conflicts
        for (let i = 0; i < convertedFiles.length; i++) {
          const file = convertedFiles[i]

          if (file.downloadUrl) {
            await AddressConversionAPI.downloadConvertedFile(file.downloadUrl, file.name)

            if (i < convertedFiles.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 2000))
            }
          }
        }

        toast.success(`Đã tải xuống tất cả ${convertedFiles.length} file`)
      }
    } catch (error: any) {
      console.error('Error downloading all files:', error)
      toast.error(error?.message || 'Có lỗi xảy ra khi tải xuống tất cả file. Vui lòng thử lại.')
      setSuccess(null)
    }
  }

  const handleCopy = () => {
    if (newAddressOutput) {
      navigator.clipboard.writeText(newAddressOutput)
      console.log('Copied to clipboard:', newAddressOutput)
    }
  }

  const handleConvert = async () => {
    setIsConverting(true)
    setSuccess(null)

    try {
      if (inputMode === InputMode.EXCEL) {
        const files = uploadedFiles.filter(f => f.file).map(f => f.file!)

        if (files.length > 0) {
          const conversionResults = await AddressConversionAPI.processExcelFiles(files)

          // Update output files list to show processed files
          const processedFiles = Object.entries(conversionResults).map(([key, result]) => ({
            id: key,
            name: result.originalFileName,
            size: result.fileSize,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            downloadUrl: process.env.NEXT_PUBLIC_API_URL + result.convertedFileUrl
          }))

          setOutputFiles(processedFiles)
          setSuccess(`Đã chuyển đổi thành công ${files.length} file Excel`)
        }
      } else {
        // Process text input using real API
        const inputAddresses = oldAddressInput.split('\n').filter(line => line.trim() !== '')

        if (inputAddresses.length > 0) {
          // Get text conversion results
          const results = await AddressConversionAPI.convertAddressesFromText(inputAddresses)

          // Set results for display
          setTextConversionResults(results)

          // Create text output for copy functionality
          const convertedAddresses = results.map(result =>
            result.newAddresses?.length > 0 ? result.newAddresses.join('\n') : result.oldAddress
          ).join('\n')

          setNewAddressOutput(convertedAddresses)
          setSuccess(`Đã chuyển đổi thành công ${inputAddresses.length} địa chỉ`)
        }
      }
    } catch (error: any) {
      console.error('Error during conversion:', error)
      toast.error(error?.message || 'Có lỗi xảy ra trong quá trình chuyển đổi. Vui lòng thử lại.')
    } finally {
      setIsConverting(false)
    }
  }

  // Convert file size to display format like in the image
  const formatFileSizeDisplay = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} kb`
  }

  const getFileIcon = (type: string) => {
    if (type.includes('spreadsheet') || type.includes('excel')) {
      return 'ri-file-excel-2-line'
    }


    return 'ri-file-line'
  }

  // Skeleton File Item Component
  const SkeletonFileItem = () => {
    return (
      <FileItemCard sx={{ p: 2, px: 4, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
          <Box className='flex flex-col items-start' sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
          </Box>
        </Box>
        <Skeleton variant="circular" width={32} height={32} />
      </FileItemCard>
    )
  }

  // Custom TextField with colored output
  const CustomResultTextField = ({ results }: { results: any[] }) => {
    if (results.length === 0) {
      return (
        <TextField
          fullWidth
          multiline
          rows={10}
          value={newAddressOutput}
          onChange={(e) => setNewAddressOutput(e.target.value)}
          placeholder="Xã Hải Tiến, Ninh Bình"
          InputProps={{
            readOnly: true
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border-color) !important',
              borderWidth: '1px !important'
            }
          }}
        />
      )
    }

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid',
          borderRadius: 1,
          p: 4,
          backgroundColor: 'background.paper'
        }}
        style={{
          borderColor: 'var(--border-color)'
        }}
      >
        {results.map((result, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Box
              sx={{
                backgroundColor: result.isError
                  ? 'error.light'
                  : result.isWarning
                    ? 'warning.light'
                    : 'transparent',
                color: result.isError
                  ? 'white'
                  : result.isWarning
                    ? 'white'
                    : 'text.primary',
                border: `1px solid ${result.isError
                  ? 'error.main'
                  : result.isWarning
                    ? 'warning.main'
                    : 'primary.main'
                  }`,
                textAlign: 'left',
                whiteSpace: 'pre-line'
              }}
            >
              {result.newAddresses?.length > 0 ? result.newAddresses.join('\n') : result.oldAddress}
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  // Reusable File Item Component
  const FileItem = ({
    file,
    onAction,
    actionIcon
  }: {
    file: FileItem
    onAction: (fileId: string) => void
    actionIcon: string
    actionColor?: string
    actionHoverBg?: string
    actionHoverColor?: string
  }) => {
    return (
      <FileItemCard sx={{ p: 2, px: 4, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
            <i className={getFileIcon(file.type)} style={{ fontSize: 20 }} />
          </Box>
          <Box className='flex flex-col items-start'>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {file.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {formatFileSizeDisplay(file.size)}
            </Typography>
          </Box>
        </Box>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onAction(file.id)
          }}
          style={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            padding: 0
          }}
        >
          <i className={`${actionIcon}`} />
        </button>
      </FileItemCard>
    )
  }

  return (
    < Card sx={{ mb: 4, textAlign: 'center' }}>
      <CardHeader
        title={
          <Typography variant="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Chuyển đổi đơn vị hành chính sau sáp nhập
          </Typography>
        }
        subheader={
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 2 }}>
            Chuyển đổi từ địa chỉ cũ sang địa chỉ mới theo đơn vị hành chính hiện tại
          </Typography>
        }
        sx={{
          py: 15
        }}
      />
      <CardContent className='px-4'>
        {/* Mode Toggle */}
        <Card sx={{
          display: 'flex',
          p: 2,
          width: '100%',
        }}>
          <Button
            onClick={() => handleInputModeChange(InputMode.EXCEL)}
            sx={tabButtonStyles(inputMode === InputMode.EXCEL)}
          >
            TẢI EXCEL
          </Button>
          <Button
            onClick={() => handleInputModeChange(InputMode.MANUAL)}
            sx={tabButtonStyles(inputMode === InputMode.MANUAL)}
          >
            TỰ NHẬP
          </Button>
        </Card>
      </CardContent>

      {/* Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mx: 4 }}>
        {/* Left Column - Old Address */}
        <Card>
          <CardHeader
            title="Địa chỉ cũ"
            titleTypographyProps={{
              variant: 'h5',
              sx: { fontWeight: 600 },
            }}
            className='text-left py-3 mb-4'
            style={{
              borderBottom: '1px solid #e0e0e0',
            }}
          />
          <CardContent sx={{ p: 4, pt: 0 }}>
            {inputMode === InputMode.EXCEL ? (
              <>
                {/* Upload Area */}
                <DropzoneCard {...getDropzoneRootProps()} className='py-7'>
                  <input {...getDropzoneInputProps()} />
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
                      <FileItem
                        key={file.id}
                        file={file}
                        onAction={handleRemoveFile}
                        actionIcon="ri-close-line"
                        actionColor="error.main"
                        actionHoverBg="error.light"
                        actionHoverColor="error.dark"
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <>
                {/* Manual Input Area */}
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  value={oldAddressInput}
                  onChange={(e) => setOldAddressInput(e.target.value)}
                  placeholder="Hải Tân, Hải Hậu, Nam Định"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'var(--border-color) !important',
                      borderWidth: '1px !important'
                    }
                  }}
                />
                <div className='flex flex-col items-start'>
                  <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }}>
                    1. Định dạng: Địa chỉ chi tiết, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    2. Mỗi dòng một địa chỉ
                  </Typography>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Right Column - New Address */}
        <Card className='flex flex-col h-full'>
          <CardHeader
            title="Địa chỉ mới"
            titleTypographyProps={{
              variant: 'h5',
              sx: { fontWeight: 600 },
            }}
            className='text-left py-3 mb-4'
            style={{
              borderBottom: '1px solid #e0e0e0',
            }}
          />
          <CardContent sx={{ p: 4, pt: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            {inputMode === InputMode.EXCEL ? (
              <>
                {/* Output Files List */}
                {isConverting ? (
                  <Box className='w-full h-full flex flex-col items-stretch justify-between'>
                    <div>
                      {uploadedFiles.map((file, index) => (
                        <Box key={`skeleton-${file.id}-${index}`} sx={{ mb: 2 }}>
                          <SkeletonFileItem />
                        </Box>
                      ))}
                    </div>
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
                  </Box>
                ) : outputFiles.length > 0 ? (
                  <Box className='w-full h-full flex flex-col items-stretch justify-between'>
                    <div>
                      {outputFiles.map((file) => (
                        <Box key={file.id} sx={{ mb: 2 }}>
                          <FileItem
                            file={file}
                            onAction={handleDownloadFile}
                            actionIcon="ri-download-line"
                            actionColor="#7c4dff"
                            actionHoverBg="#f3f0ff"
                            actionHoverColor="#6a3de8"
                          />
                        </Box>
                      ))}
                    </div>

                    {/* Download All Button */}
                    <Button
                      variant="outlined"
                      startIcon={<i className="ri-download-line" />}
                      onClick={handleDownloadAll}
                      disabled={outputFiles.filter(f => f.downloadUrl).length === 0}
                    >
                      TẢI XUỐNG TẤT CẢ
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', margin: 'auto 0' }}>
                    Chưa có file kết quả
                  </Typography>
                )}
              </>
            ) : (
              <div className='w-full h-full flex flex-col items-stretch justify-between gap-[14px]'>
                {/* Manual Output Area */}
                <CustomResultTextField results={textConversionResults} />

                <Button
                  variant="outlined"
                  startIcon={<i className="ri-file-copy-line" />}
                  onClick={handleCopy}
                  sx={{
                    width: '100%',
                  }}
                >
                  COPY
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Box >

      <Button
        variant="contained"
        size="medium"
        onClick={handleConvert}
        disabled={
          (inputMode === InputMode.EXCEL && uploadedFiles.filter(f => f.file).length === 0) ||
          (inputMode === InputMode.MANUAL && !oldAddressInput.trim()) ||
          isConverting
        }
        className='my-4 min-w-[400px] rounded'
      >
        {isConverting ? (
          <>
            <i className="ri-loader-4-line ri-animate-spin" style={{ marginRight: 8 }} />
            Đang chuyển đổi...
          </>
        ) : (
          'CHUYỂN ĐỔI'
        )}
      </Button>
    </Card >
  )
}

export default ToolAddressMerge
