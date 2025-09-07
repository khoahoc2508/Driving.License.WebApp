'use client'

// React Imports

// MUI Imports
import type {
    SelectChangeEvent
} from '@mui/material';
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    Typography
} from '@mui/material'

import Pagination from '@mui/material/Pagination'

// Icon Imports - Using Remix Icons like the rest of the project

interface CustomPaginationProps {
    totalItems: number
    pageSize: number
    pageNumber: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    pageSizeOptions?: number[]
    showPageSizeSelector?: boolean
}

const CustomPagination = ({
    totalItems,
    pageSize,
    pageNumber,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [7, 10, 25, 50],
    showPageSizeSelector = true,
}: CustomPaginationProps) => {
    const totalPages = Math.ceil(totalItems / pageSize)

    const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
        const newPageSize = Number(event.target.value)

        onPageSizeChange(newPageSize)
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        onPageChange(page)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px 20px',
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                position: 'relative',
                minHeight: '50px'
            }}
        >
            {/* Left side - Page size selector */}
            {showPageSizeSelector && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Hiển thị:
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none'
                                },
                                '&.MuiInputBase-root i': {
                                    right: '33px !important',
                                    top: '0'
                                },
                                '& .MuiSelect-select': {
                                    padding: '0 10px !important'
                                }
                            }}
                            IconComponent={() => (
                                <i className="ri-arrow-down-s-fill"></i>
                            )}
                        >
                            {pageSizeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <Pagination
                    count={totalPages}
                    page={pageNumber}
                    onChange={handlePageChange}
                    color='primary'
                    size='small'
                    sx={
                        {
                            '.MuiPaginationItem-root': {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        }
                    }
                />
            </Box>
        </Box>
    )
}

export default CustomPagination
