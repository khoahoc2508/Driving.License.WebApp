'use client'

import { Box, Typography, TextField, Button, Skeleton, Tooltip, IconButton, CardContent } from '@mui/material'

import FileItemComponent from './FileItem'
import type { FileItem } from './FileItem'

// Status Legend Component
const StatusLegend = () => {
  return (
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, px: 0 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Thành công */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: 'transparent',
              border: '2px solid',
              borderColor: 'var(--border-color)',
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
            Thành công
          </Typography>
        </Box>

        {/* Không chắc chắn */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: 'warning.main',
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
            Không chắc chắn
          </Typography>
        </Box>

        {/* Lỗi chuyển đổi */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 15,
              height: 15,
              backgroundColor: 'error.main',
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
            Lỗi chuyển đổi
          </Typography>
        </Box>
      </Box>
    </CardContent>
  )
}

// Skeleton File Item Component
const SkeletonFileItem = () => {
  return (
    <Box sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '6px',
      padding: 2,
      paddingX: 4,
      marginBottom: 1,
      display: 'flex',
      alignItems: 'center'
    }}>
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
    </Box>
  )
}

// Custom TextField with colored output
const CustomResultTextField = ({ results, value }: { results: any[], value: string }) => {
  if (results.length === 0) {
    return (
      <TextField
        fullWidth
        multiline
        value={value}
        placeholder="Xã Hải Tiến, Ninh Bình"
        InputProps={{
          readOnly: true
        }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--border-color) !important',
            borderWidth: '1px !important'
          },
          '&.MuiFormControl-root': {
            height: '100%'
          },
          '& .MuiInputBase-root': {
            height: '100%'
          },
          '& .MuiInputBase-input': {
            height: '100% !important'
          }
        }}
      />
    )
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Results */}
      <Box
        sx={{
          flex: 1,
          border: '1px solid',
          borderRadius: 1,
          backgroundColor: 'background.paper',
          p: 4,
          overflow: 'auto'
        }}
        style={{
          borderColor: 'var(--border-color)'
        }}
        className='scrollbar-override'
      >
        {results.map((result, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Box
              sx={{
                backgroundColor: result.isError
                  ? 'error.main'
                  : result.isWarning
                    ? 'warning.main'
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
                whiteSpace: 'pre-line',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ flex: 1 }}>
                {result.newAddresses?.length > 0 ? result.newAddresses.join('\n') : result.oldAddress}
              </Box>

              {/* Info Icon with Tooltip */}
              {(result.isError || result.isWarning) && result.message && (
                <Tooltip
                  title={result.message}
                  placement="top"
                  arrow
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: 'inherit',
                      mx: 1,
                      p: 0
                    }}
                  >
                    <i className="ri-information-line" style={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

interface ResultDisplayProps {
  mode: 'excel' | 'manual'
  isConverting: boolean
  outputFiles: FileItem[]
  textConversionResults: any[]
  newAddressOutput: string
  isCopied: boolean
  onDownloadFile: (fileId: string) => void
  onDownloadAll: () => void
  onCopy: () => void
  uploadedFiles: FileItem[]
}

const ResultDisplay = ({
  mode,
  isConverting,
  outputFiles,
  textConversionResults,
  newAddressOutput,
  isCopied,
  onDownloadFile,
  onDownloadAll,
  onCopy,
  uploadedFiles
}: ResultDisplayProps) => {
  if (mode === 'excel') {
    return (
      <>
        {/* Output Files List */}
        {isConverting ? (
          <Box className='w-full h-full flex flex-col items-stretch justify-between'>
            <Box sx={{
              flex: 1,
              overflow: 'auto',
              borderRadius: 1,
            }} className='scrollbar-override'>
              {uploadedFiles.map((file, index) => (
                <Box key={`skeleton-${file.id}-${index}`} sx={{ mb: 2 }}>
                  <SkeletonFileItem />
                </Box>
              ))}
            </Box>
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1, mt: 2 }} />
          </Box>
        ) : outputFiles.length > 0 ? (
          <Box className='w-full h-full flex flex-col items-stretch justify-between'>
            <Box sx={{
              flex: 1,
              overflow: 'auto',
              borderRadius: 1,
            }} className='scrollbar-override'>
              {outputFiles.map((file) => (
                <Box key={file.id} sx={{ mb: 2 }}>
                  <FileItemComponent
                    file={file}
                    onAction={onDownloadFile}
                    actionIcon="ri-download-line"
                    actionColor="#7c4dff"
                    actionHoverBg="#f3f0ff"
                    actionHoverColor="#6a3de8"
                  />
                </Box>
              ))}
            </Box>


            {/* Download All Button */}
            <Button
              variant="outlined"
              startIcon={<i className="ri-download-line" />}
              onClick={onDownloadAll}
              disabled={outputFiles.filter(f => f.downloadUrl).length === 0}
              sx={{ flexShrink: 0, mt: 2 }}
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
    )
  }

  return (
    <div className='w-full h-full flex flex-col items-stretch justify-between gap-1'>
      {/* Manual Output Area */}
      <Box sx={{
        flex: 1,
        overflow: 'hidden',
        width: '100%',
        minHeight: 0
      }}>
        <CustomResultTextField results={textConversionResults} value={newAddressOutput} />
      </Box>

      {/* Status Legend */}
      <StatusLegend />
      <Button
        variant="outlined"
        startIcon={isCopied ? <i className="ri-check-line" /> : <i className="ri-file-copy-line" />}
        onClick={onCopy}
        sx={{
          width: '100%',
          flexShrink: 0
        }}
      >
        {isCopied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP'}
      </Button>
    </div>
  )
}

export default ResultDisplay
