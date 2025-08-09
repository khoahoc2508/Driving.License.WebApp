'use client'

import Button from '@mui/material/Button'
import { useMediaQuery, useTheme } from '@mui/material'

import ScrollToTop from '@core/components/scroll-to-top'

const ScrollToTopClient = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    if (isMobile) return null

    return (
        <ScrollToTop className='mui-fixed'>
            <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
                <i className='ri-arrow-up-line' />
            </Button>
        </ScrollToTop>
    )
}

export default ScrollToTopClient
