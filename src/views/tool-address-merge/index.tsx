'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    TextField
} from '@mui/material'
import { styled } from '@mui/material/styles'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Enums
enum InputMode {
    EXCEL = 'excel',
    MANUAL = 'manual'
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
    '&:hover': {
        boxShadow: theme.shadows[4]
    }
}))

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
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
        boxShadow: theme.shadows[1]
    }
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

// Common Icon Button Styles
const iconButtonStyles = (color: string, hoverBg: string, hoverColor: string) => ({
    color,
    '&:hover': {
        backgroundColor: hoverBg,
        color: hoverColor
    }
})

interface FileItem {
    id: string
    name: string
    size: number
    type: string
}

const ToolAddressMerge = () => {
    // States
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.EXCEL)
    const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([])
    const [outputFiles, setOutputFiles] = useState<FileItem[]>([])
    const [isConverting, setIsConverting] = useState(false)

    // Manual input states
    const [oldAddressInput, setOldAddressInput] = useState<string>('')
    const [newAddressOutput, setNewAddressOutput] = useState<string>('')

    // Mock data for demonstration
    const mockUploadedFiles: FileItem[] = [
        { id: '1', name: 'data09.xlsx', size: 568000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '2', name: 'data10.xlsx', size: 520000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '3', name: 'data11.xlsx', size: 590000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '4', name: 'data12.xlsx', size: 610000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ]

    const mockOutputFiles: FileItem[] = [
        { id: '1', name: 'data09_converted.xlsx', size: 568000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '2', name: 'data10_converted.xlsx', size: 520000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '3', name: 'data11_converted.xlsx', size: 590000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        { id: '4', name: 'data12_converted.xlsx', size: 610000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ]

    // Initialize with mock data
    useState(() => {
        setUploadedFiles(mockUploadedFiles)
        setOutputFiles(mockOutputFiles)
    })

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
                type: file.type
            }))
            setUploadedFiles(prev => [...prev, ...newFiles])
        }
    })

    // Handlers
    const handleInputModeChange = (newMode: InputMode) => {
        setInputMode(newMode)
    }

    const handleRemoveFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    }

    const handleDownloadFile = (fileId: string) => {
        // Mock download functionality
        console.log('Downloading file:', fileId)
    }

    const handleDownloadAll = () => {
        // Mock download all functionality
        console.log('Downloading all files')
    }

    const handleCopy = () => {
        if (newAddressOutput) {
            navigator.clipboard.writeText(newAddressOutput)
            console.log('Copied to clipboard:', newAddressOutput)
        }
    }

    const handleConvert = async () => {
        setIsConverting(true)

        if (inputMode === InputMode.EXCEL) {
            // Mock conversion process for Excel files
            setTimeout(() => {
                setOutputFiles(mockOutputFiles)
                setIsConverting(false)
            }, 2000)
        } else {
            // Mock conversion process for manual input
            setTimeout(() => {
                // Simple placeholder conversion logic
                const inputAddresses = oldAddressInput.split('\n').filter(line => line.trim() !== '')
                const convertedAddresses = inputAddresses.map(address => {
                    // Mock conversion: just add "New " prefix
                    return `New ${address.trim()}`
                }).join('\n')
                setNewAddressOutput(convertedAddresses)
                setIsConverting(false)
            }, 2000)
        }
    }

    const formatFileSize = (bytes: number) => {
        return `${(bytes / 1000).toFixed(1)} kb`
    }

    // Convert file size to display format like in the image
    const formatFileSizeDisplay = (bytes: number) => {
        return `${(bytes / 1000).toFixed(1)} kb`
    }

    const getFileIcon = (type: string) => {
        if (type.includes('spreadsheet') || type.includes('excel')) {
            return 'ri-file-excel-2-line'
        }
        return 'ri-file-line'
    }

    // Reusable File Item Component
    const FileItem = ({
        file,
        onAction,
        actionIcon,
        actionColor = '#7c4dff',
        actionHoverBg = '#f3f0ff',
        actionHoverColor = '#6a3de8'
    }: {
        file: FileItem
        onAction: (fileId: string) => void
        actionIcon: string
        actionColor?: string
        actionHoverBg?: string
        actionHoverColor?: string
    }) => (
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
            <IconButton
                onClick={() => onAction(file.id)}
                size="small"
                sx={iconButtonStyles(actionColor, actionHoverBg, actionHoverColor)}
            >
                <i className={actionIcon} />
            </IconButton>
        </FileItemCard>
    )

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
                                <DropzoneCard {...getDropzoneRootProps()}>
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
                                        Tải file excel địa chỉ cũ <span style={{ color: 'red' }}>(*)</span>
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
                                    sx={{ mb: 2 }}
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
                    <CardContent sx={{ p: 4, pt: 0, flex: 1 }}>
                        {inputMode === InputMode.EXCEL ? (
                            <>
                                {/* Output Files List */}
                                {outputFiles.length > 0 ? (
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
                                        >
                                            TẢI XUỐNG TẤT CẢ
                                        </Button>
                                    </Box>
                                ) : (
                                    <Card sx={{ textAlign: 'center', py: 4, backgroundColor: 'transparent', boxShadow: 'none', border: '1px dashed', borderColor: 'divider' }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Chưa có file kết quả
                                        </Typography>
                                    </Card>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Manual Output Area */}
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
                                    sx={{ mb: 2 }}
                                />
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
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box >

            <Button
                variant="contained"
                size="medium"
                onClick={handleConvert}
                disabled={
                    (inputMode === InputMode.EXCEL && uploadedFiles.length === 0) ||
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
