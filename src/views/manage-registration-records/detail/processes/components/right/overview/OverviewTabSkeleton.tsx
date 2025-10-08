'use client'

import { Box, Skeleton, Divider , useTheme, useMediaQuery } from '@mui/material'


const OverviewTabSkeleton = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box>
            {/* Skeleton cho status và form fields */}
            <Box sx={{ p: isMobile ? 2 : 4 }}>
                {/* Status skeleton */}
                <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr' }}>
                    <Skeleton variant="text" width={80} height={20} animation="wave" />
                    <Skeleton
                        variant="rectangular"
                        width={100}
                        height={24}
                        animation="wave"
                        sx={{ borderRadius: 1 }}
                    />
                </Box>

                {/* Form fields skeleton */}
                <Box className='flex flex-col gap-3 mt-4'>
                    {[...Array(4)].map((_, index) => (
                        <Box
                            key={index}
                            sx={{ display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr', rowGap: 3, alignItems: 'center' }}
                        >
                            <Skeleton variant="text" width={120} height={20} animation="wave" />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Skeleton variant="text" width={200} height={20} animation="wave" />
                                <Skeleton
                                    variant="circular"
                                    width={24}
                                    height={24}
                                    animation="wave"
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Divider skeleton */}
            <Divider sx={{ my: 2 }} />

            {/* Task info skeleton */}
            <Box sx={{ p: isMobile ? 2 : 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[...Array(3)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{ display: 'grid', gridTemplateColumns: isMobile ? '140px 1fr' : '180px 1fr', rowGap: 3, paddingBottom: '7px' }}
                    >
                        <Skeleton variant="text" width={100} height={20} animation="wave" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Skeleton variant="text" width={150} height={20} animation="wave" />
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                                animation="wave"
                            />
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Divider skeleton */}
            <Divider sx={{ my: 2 }} />

            {/* Action buttons skeleton */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    my: 4
                }}
            >
                {[...Array(2)].map((_, index) => (
                    <Skeleton
                        key={index}
                        variant="rectangular"
                        width={140}
                        height={36}
                        animation="wave"
                        sx={{ borderRadius: 1 }}
                    />
                ))}
                <Skeleton
                    variant="rectangular"
                    width={160}
                    height={36}
                    animation="wave"
                    sx={{ borderRadius: 1 }}
                />
            </Box>
        </Box>
    )
}

export default OverviewTabSkeleton
