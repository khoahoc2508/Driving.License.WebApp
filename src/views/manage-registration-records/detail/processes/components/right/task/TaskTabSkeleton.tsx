'use client'

import { Box, Skeleton } from '@mui/material'
import { useTheme, useMediaQuery } from '@mui/material'

const TaskTabSkeleton = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box>
            {/* Skeleton cho action buttons */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    mb: 3,
                    px: 1
                }}
            >
                {[...Array(2)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rectangular"
                        width={120}
                        height={36}
                        animation="wave"
                        sx={{ borderRadius: 1 }}
                    />
                ))}
            </Box>

            {/* Skeleton cho table */}
            <div className='overflow-x-auto custom-scrollbar'>
                <table
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        width: '100%'
                    }}
                >
                    {/* Table header skeleton */}
                    <thead>
                        <tr className="h-9">
                            <th style={{ width: 50, minWidth: 50 }}>
                                <div className="flex items-center justify-center">
                                    <Skeleton variant="text" width={30} height={20} animation="wave" />
                                </div>
                            </th>
                            <th style={{ width: 300, minWidth: 300 }}>
                                <div className="flex items-center justify-center">
                                    <Skeleton variant="text" width={100} height={20} animation="wave" />
                                </div>
                            </th>
                            <th style={{ width: 300, minWidth: 300 }}>
                                <div className="flex items-center justify-center">
                                    <Skeleton variant="text" width={80} height={20} animation="wave" />
                                </div>
                            </th>
                            <th style={{ width: 80, minWidth: 60 }}>
                                <div className="flex items-center justify-center">
                                    <Skeleton variant="text" width={70} height={20} animation="wave" />
                                </div>
                            </th>
                        </tr>
                    </thead>

                    {/* Table body skeleton */}
                    <tbody>
                        {[...Array(3)].map((_, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {/* STT column */}
                                <td>
                                    <Skeleton variant="text" width={30} height={20} animation="wave" />
                                </td>

                                {/* CÔNG VIỆC column */}
                                <td>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Skeleton
                                            variant="circular"
                                            width={40}
                                            height={40}
                                            animation="wave"
                                        />
                                        <Box className='flex flex-col items-start'>
                                            <Skeleton variant="text" width={200} height={20} animation="wave" />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Skeleton variant="rectangular" width={80} height={20} animation="wave" sx={{ borderRadius: 1 }} />
                                                <Skeleton variant="text" width={150} height={16} animation="wave" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </td>

                                {/* NỘI DUNG column */}
                                <td>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: "start" }}>
                                        {[...Array(3)].map((_, itemIndex) => (
                                            <Skeleton
                                                key={itemIndex}
                                                variant="text"
                                                width={250}
                                                height={16}
                                                animation="wave"
                                            />
                                        ))}
                                        <Skeleton variant="text" width={200} height={16} animation="wave" />
                                    </Box>
                                </td>

                                {/* THAO TÁC column */}
                                <td>
                                    <div className="flex items-center justify-center">
                                        <Skeleton
                                            variant="circular"
                                            width={32}
                                            height={32}
                                            animation="wave"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Box>
    )
}

export default TaskTabSkeleton
