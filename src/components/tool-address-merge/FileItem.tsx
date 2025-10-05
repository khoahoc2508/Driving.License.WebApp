'use client'

import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// Styled Components
const FileItemCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '6px',
  padding: theme.spacing(2, 4),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
}))

// Types
interface FileItem {
  id: string
  name: string
  size: number
  type: string
  file?: File
  downloadUrl?: string
}

interface FileItemProps {
  file: FileItem
  onAction: (fileId: string) => void
  actionIcon: string
  actionColor?: string
  actionHoverBg?: string
  actionHoverColor?: string
}

// Helper functions
const formatFileSizeDisplay = (bytes: number) => {
  return `${(bytes / 1024).toFixed(1)} kb`
}

const getFileIcon = (type: string) => {
  if (type.includes('spreadsheet') || type.includes('excel')) {
    return 'ri-file-excel-2-line'
  }


  return 'ri-file-line'
}

const FileItemComponent = ({
  file,
  onAction,
  actionIcon,
}: FileItemProps) => {
  return (
    <FileItemCard sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
          <i className={getFileIcon(file.type)} style={{ fontSize: 20 }} />
        </Box>
        <Box className='flex flex-col items-start'>
          <Typography variant="body1" sx={{ fontWeight: 500 }} className='text-left'>
            {file.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} className='text-left'>
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

export default FileItemComponent
export type { FileItem }
