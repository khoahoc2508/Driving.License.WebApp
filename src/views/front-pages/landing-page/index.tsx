'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports

import { useSettings } from '@core/hooks/useSettings'
import DrivingLicensePractice from './driving-license-pratice/Index'

const LandingPageWrapper = () => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DrivingLicensePractice />
    </>
  )
}

export default LandingPageWrapper
