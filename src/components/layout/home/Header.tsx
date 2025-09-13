'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { redirect, usePathname } from 'next/navigation'

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import type { Theme } from '@mui/material/styles'

// Next Auth Imports
import { useSession } from 'next-auth/react'

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
import CONFIG from '@/configs/config'
import UserDropdown from '../shared/UserDropdown'

const Header = ({ mode }: { mode: Mode }) => {
  // States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  // Hooks
  const isBelowLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const pathName = usePathname()
  const { data: session, status } = useSession()

  // Detect window scroll
  const trigger = useScrollTrigger({
    threshold: 0,
    disableHysteresis: true
  })

  return (
    <header className={classnames(frontLayoutClasses.header, styles.header)} style={{ backgroundColor: pathName.startsWith(CONFIG.RoutersCustomer.examPratice) ? 'var(--mui-palette-background-paper)' : 'transparent' }}>
      <div className={classnames(frontLayoutClasses.navbar, styles.navbar, { [styles.headerScrolled]: trigger })} style={pathName.startsWith(CONFIG.RoutersCustomer.examPratice) ? { boxShadow: '0 0 10px 4px rgba(0, 0, 0, 0.1)' } : {}}>
        <div className={classnames(frontLayoutClasses.navbarContent, styles.navbarContent)}>
          {isBelowLgScreen ? (
            <div className='flex items-center gap-2 sm:gap-4'>
              <IconButton onClick={() => setIsDrawerOpen(true)} className='-mis-2'>
                <i className='ri-menu-line text-textPrimary' />
              </IconButton>
              <Link href='/'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          ) : (
            <div className='flex items-center gap-10'>
              <Link href='/'>
                <Logo />
              </Link>
              <FrontMenu mode={mode} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
            </div>
          )}
          <div className='flex items-center gap-2 sm:gap-4'>
            <ModeDropdown />
            {status === 'loading' ? (
              <div className='flex items-center justify-center w-10 h-10'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
              </div>
            ) : session?.user ? (
              <UserDropdown isHomePage={true} />
            ) : (
              <Button
                onClick={() => {
                  redirect(`${CONFIG.Routers.Login}?redirectTo=${encodeURIComponent(pathName)}`)
                }}
                variant='outlined'
                className='whitespace-nowrap'
                size='small'
              >
                Đăng nhập
              </Button>
            )}
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
