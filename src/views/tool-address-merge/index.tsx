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
  useMediaQuery,
  useTheme
} from '@mui/material'

// Component Imports
import { toast } from 'react-toastify'

// API Imports
import AddressConversionAPI from '@/libs/api/addressConversionAPI'

// Local Component Imports
import {
  ModeToggle,
  DropzoneArea,
  ManualTextInput,
  ResultDisplay,
  type FileItemType as FileItem
} from '@/components/tool-address-merge'

// Enums
enum InputMode {
  EXCEL = 'excel',
  MANUAL = 'manual'
}

const ToolAddressMerge = () => {
  // States
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.EXCEL)
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
  const [outputFiles, setOutputFiles] = useState<FileItem[]>([])
  const [isConverting, setIsConverting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  console.log(success)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))


  // Manual input states
  const [oldAddressInput, setOldAddressInput] = useState<string>('')
  const [newAddressOutput, setNewAddressOutput] = useState<string>('')
  const [textConversionResults, setTextConversionResults] = useState<any[]>([])
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // Check if there's any data to restore
  const hasDataToRestore = () => {
    return (
      uploadedFiles.length > 0 ||
      outputFiles.length > 0 ||
      oldAddressInput.trim() !== '' ||
      newAddressOutput.trim() !== '' ||
      textConversionResults.length > 0 ||
      success !== null
    )
  }

  // Initialize with empty arrays - no mock data needed

  // File handling
  const handleFilesAdded = useCallback((newFiles: FileItem[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles])
  }, [])

  // Handlers
  const handleInputModeChange = (newMode: 'excel' | 'manual') => {
    setInputMode(newMode as InputMode)
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
      toast.error('File chỉ tồn tại trong vòng 10 phút. Vui lòng thực hiện chuyển đổi lại.')
      setSuccess(null)
    }
  }, [outputFiles])

  const handleDownloadAll = async () => {
    try {
      // Download all converted files that have downloadUrl
      const convertedFiles = outputFiles.filter(f => f.downloadUrl)

      if (convertedFiles.length > 0) {
        // Get all file URLs
        const fileUrls = convertedFiles.map(file => file.downloadUrl!).filter(Boolean)

        // Download as zip file
        await AddressConversionAPI.downloadAllAsZip(fileUrls)

        toast.success(`Đã tải xuống file zip chứa ${convertedFiles.length} file`)
      }
    } catch (error: any) {
      toast.error('File chỉ tồn tại trong vòng 10 phút. Vui lòng thực hiện chuyển đổi lại.')
      setSuccess(null)
    }
  }

  const handleCopy = () => {
    if (newAddressOutput) {
      navigator.clipboard.writeText(newAddressOutput)
      console.log('Copied to clipboard:', newAddressOutput)

      // Set copied state to true
      setIsCopied(true)

      // Reset to original state after 3 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 3000)
    }
  }

  const handleRestore = () => {
    // Reset all state variables to initial values
    // setInputMode(InputMode.EXCEL)
    setUploadedFiles([])
    setOutputFiles([])
    setIsConverting(false)
    setSuccess(null)
    setOldAddressInput('')
    setNewAddressOutput('')
    setTextConversionResults([])
    setIsCopied(false)

    // Show success message
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
            name: result.convertedFileName,
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


  return (
    < Card className={`flex flex-col ${!isMobile ? 'h-[calc(100vh-116px)]' : 'h-full'} text-center`}>
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
          py: 10,
          flexShrink: 0
        }}
      />
      <CardContent className='px-4' sx={{ flexShrink: 0 }}>
        <ModeToggle
          currentMode={inputMode as 'excel' | 'manual'}
          onModeChange={handleInputModeChange}
        />
      </CardContent>

      {/* Main Content */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 4, md: 10 },
        mx: { xs: 2, md: 4 },
        flex: 1,
        minHeight: 0,
        paddingX: { xs: '7px', md: 0 }
      }}>
        {/* Left Column - Old Address */}
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader
            title={
              <Typography variant="h5">
                Địa chỉ cũ
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
            overflow: 'auto'
          }} className='scrollbar-override flex flex-col justify-between'>
            {inputMode === InputMode.EXCEL ? (
              <DropzoneArea
                onFilesAdded={handleFilesAdded}
                uploadedFiles={uploadedFiles}
                onRemoveFile={handleRemoveFile}
              />
            ) : (
              <ManualTextInput
                value={oldAddressInput}
                onChange={setOldAddressInput}
              />
            )}
          </CardContent>

          <CardContent className='flex flex-col p-4 items-start flex-shrink-0'>
            {
              inputMode === InputMode.EXCEL ? (
                <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }} className='text-left'>
                  Định dạng: Excel phải có cột &quot;Địa Chỉ&quot;
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }} className='text-left'>
                    1. Định dạng: Phường/Xã, Quận/Huyện, Tỉnh/Thành phố
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'primary.main' }} className='text-left'>
                    2. Mỗi dòng một địa chỉ
                  </Typography>
                </>
              )
            }

          </CardContent>
        </Card>

        {/* Right Column - New Address */}
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardHeader
            title={
              <Typography variant="h5">
                Địa chỉ mới
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
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}>
            <ResultDisplay
              mode={inputMode as 'excel' | 'manual'}
              isConverting={isConverting}
              outputFiles={outputFiles}
              textConversionResults={textConversionResults}
              newAddressOutput={newAddressOutput}
              isCopied={isCopied}
              onDownloadFile={handleDownloadFile}
              onDownloadAll={handleDownloadAll}
              onCopy={handleCopy}
              uploadedFiles={uploadedFiles}
            />
          </CardContent>
        </Card>
      </Box >

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        p: 4,
        flexShrink: 0,
        gap: 2,
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        <Button
          variant="contained"
          size="medium"
          onClick={handleConvert}
          disabled={
            (inputMode === InputMode.EXCEL && uploadedFiles.filter(f => f.file).length === 0) ||
            (inputMode === InputMode.MANUAL && !oldAddressInput.trim()) ||
            isConverting
          }
          className=' rounded'
          sx={{
            minWidth: { xs: '100%', md: '400px' }
          }}
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

        <Button
          variant="outlined"
          size="medium"
          color="error"
          className='rounded'
          disabled={!hasDataToRestore()}
          onClick={handleRestore}
        >
          KHÔI PHỤC
        </Button>
      </Box>

    </Card >
  )
}

export default ToolAddressMerge
