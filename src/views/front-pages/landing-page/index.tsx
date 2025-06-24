'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import { useSettings } from '@core/hooks/useSettings'
import ContactUs from './ContactUs'
import CustomerReviews from './CustomerReviews'
import Faqs from './Faqs'
import GetStarted from './GetStarted'
import HeroSection from './HeroSection'
import ProductStat from './ProductStat'
import UsefulFeature from './UsefulFeature'

const LandingPageWrapper = ({ mode }: { mode: Mode }) => {
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
      <HeroSection mode={mode} />
      <UsefulFeature />
      <CustomerReviews />
      {/* <OurTeam /> */}
      {/* <Pricing /> */}
      <ProductStat />
      <Faqs />
      <GetStarted />
      <ContactUs />
    </>
  )
}

export default LandingPageWrapper
