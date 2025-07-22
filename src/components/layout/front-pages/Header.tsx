'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import FrontMenu from './FrontMenu'

// import CustomIconButton from '@core/components/mui/IconButton'
import RegisterLicenseDialog from '@components/RegisterLicenseDialog'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import styles from './styles.module.css'

const Header = ({ mode }: { mode: Mode }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })} style={{ boxShadow: '0 0 10px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='flex items-center gap-2 sm:gap-4'>
              <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                <i className='ri-menu-line text-textPrimary' />
              </IconButton>
              <Link href='/front-pages/landing-page'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          ) : (
            <div className='flex items-center gap-10'>
              <Link href='/front-pages/landing-page'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          )}
          <div className='flex items-center gap-2 sm:gap-4'>
            <ModeDropdown />
            {/* {isBelowLgScreen ? (
              <CustomIconButton
                component={Link}
                variant='contained'
                href='https://themeselection.com/item/materio-mui-nextjs-admin-template/'
                color='primary'
                target='_blank'
              >
                <i className='ri-shopping-cart-line text-xl' />
              </CustomIconButton>
            ) : (
              <Button
                component={Link}
                variant='contained'
                href='https://themeselection.com/item/materio-mui-nextjs-admin-template/'
                startIcon={<i className='ri-shopping-cart-line text-xl' />}
                className='whitespace-nowrap'
                target='_blank'
              >
                Purchase Now
              </Button>
            )} */}
            {/* <Button
              variant='contained'
              className='whitespace-nowrap'
              onClick={() => setOpenDialog(true)}
            >
              ĐĂNG KÝ THI GPLX
            </Button> */}
          </div>
        </div>
      </div>
      <RegisterLicenseDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </header>
  )
}

export default Header
