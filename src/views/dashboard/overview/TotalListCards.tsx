'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'
import type { StatisticOverviewResponse } from '@/types/statisticTypes'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// API Imports
import StatisticAPI from '@/libs/api/statisticAPI'

// Props

type Props = {
  statistics: StatisticOverviewResponse | null
}

const TotalListCards = ({ statistics }: Props) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Prepare data for cards
  const data: UserDataType[] = [
    {
      title: 'Tổng hồ sơ',
      stats: statistics ? statistics.totalLicenseRegistration?.toString() || '0' : '...',
      avatarIcon: 'ri-article-line',
      avatarColor: 'primary',
      subtitle: 'So với tháng trước',
      trendNumber: statistics ? `${statistics.increasePercentageLicenseRegistration?.toFixed(1) || '0'}%` : '...',
      trend: statistics && statistics.increasePercentageLicenseRegistration && statistics.increasePercentageLicenseRegistration > 0 ? 'positive' : 'negative'
    },
    {
      title: 'Xe máy',
      stats: statistics ? statistics.totalMotorbike?.toString() || '0' : '...',
      avatarIcon: 'ri-motorbike-line',
      avatarColor: 'info',
      subtitle: 'So với tháng trước',
      trendNumber: statistics ? `${statistics.increasePercentageMotorbike?.toFixed(1) || '0'}%` : '...',
      trend: statistics && statistics.increasePercentageMotorbike && statistics.increasePercentageMotorbike > 0 ? 'positive' : 'negative'
    },
    {
      title: 'Doanh thu',
      stats: statistics ? formatCurrency(statistics.totalRevenue || 0) : '...',
      avatarIcon: 'ri-money-dollar-circle-line',
      avatarColor: 'success',
      subtitle: 'So với tháng trước',
      trendNumber: statistics ? `${statistics.increasePercentageRevenue?.toFixed(1) || '0'}%` : '...',
      trend: statistics && statistics.increasePercentageRevenue && statistics.increasePercentageRevenue > 0 ? 'positive' : 'negative'
    },
    {
      title: 'Ô tô',
      stats: statistics ? statistics.totalCar?.toString() || '0' : '...',
      avatarIcon: 'ri-car-line',
      avatarColor: 'warning',
      subtitle: 'So với tháng trước',
      trendNumber: statistics ? `${statistics.increasePercentageCar?.toFixed(1) || '0'}%` : '...',
      trend: statistics && statistics.increasePercentageCar && statistics.increasePercentageCar > 0 ? 'positive' : 'negative'
    }
  ]


  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default TotalListCards
