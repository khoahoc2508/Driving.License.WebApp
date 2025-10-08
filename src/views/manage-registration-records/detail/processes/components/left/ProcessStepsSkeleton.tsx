'use client'

import { Box, Skeleton , useTheme, useMediaQuery } from '@mui/material'


const ProcessStepsSkeleton = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box className="p-4">
            {/* Skeleton cho stepper */}
            {[...Array(5)].map((_, index) => (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 2
                    }}
                >
                    {/* Skeleton cho step icon */}
                    <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        animation="wave"
                    />

                    {/* Skeleton cho step label */}
                    <Box sx={{ flex: 1 }}>
                        <Skeleton
                            variant="text"
                            width={isMobile ? '80%' : '60%'}
                            height={20}
                            animation="wave"
                        />
                    </Box>
                </Box>
            ))}
        </Box>
    )
}

export default ProcessStepsSkeleton
