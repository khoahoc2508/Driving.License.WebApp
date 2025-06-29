'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Mui Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'

// Type Imports
import type { VehicleTypeQuantityResponse } from '@/types/statisticTypes'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// Style Imports
import './styles.css'

// Initial series data
const initialSeries = [
  {
    name: 'Xe máy',
    type: 'column',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  {
    name: 'Ô tô',
    type: 'column',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }
]

type Props = {
  statistics?: VehicleTypeQuantityResponse | null
}

const LicenseRegistrationColumnChart = ({ statistics }: Props) => {
  // Hooks
  const theme = useTheme()
  const [series, setSeries] = useState(initialSeries)
  const [categories, setCategories] = useState<string[]>(['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'])

  // Process data when statistics change
  useEffect(() => {
    if (!statistics) return

    // Nếu có dataFollowDay, ưu tiên sử dụng dữ liệu theo ngày
    if (statistics.dataFollowDay && statistics.dataFollowDay.length > 0) {
      const dayCategories = statistics.dataFollowDay.map(item => {
        if (item.date) {
          const date = new Date(item.date)
          return `${date.getDate()}/${date.getMonth() + 1}`
        }
        return ''
      }).filter(Boolean)

      const motorbikeData = statistics.dataFollowDay.map(item => item.motorbikeQuantity || 0)
      const carData = statistics.dataFollowDay.map(item => item.carQuantity || 0)

      setCategories(dayCategories)
      setSeries([
        {
          name: 'Xe máy',
          type: 'column',
          data: motorbikeData
        },
        {
          name: 'Ô tô',
          type: 'column',
          data: carData
        }
      ])
    }
    // Nếu không có dataFollowDay nhưng có dataFollowMonth, sử dụng dữ liệu theo tháng
    else if (statistics.dataFollowMonth && statistics.dataFollowMonth.length > 0) {
      const monthCategories = statistics.dataFollowMonth.map(item => {
        if (item.month) {
          return `Tháng ${item.month}`
        }
        return ''
      }).filter(Boolean)

      const motorbikeData = statistics.dataFollowMonth.map(item => item.motorbikeQuantity || 0)
      const carData = statistics.dataFollowMonth.map(item => item.carQuantity || 0)

      setCategories(monthCategories)
      setSeries([
        {
          name: 'Xe máy',
          type: 'column',
          data: motorbikeData
        },
        {
          name: 'Ô tô',
          type: 'column',
          data: carData
        }
      ])
    }
    // Nếu không có dữ liệu nào, reset về trạng thái ban đầu
    else {
      setCategories(['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'])
      setSeries(initialSeries)
    }
  }, [statistics])



  const options: ApexOptions = {
    chart: {
      type: 'line',
      stacked: false,
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    markers: {
      size: 5,
      colors: '#fff',
      strokeColors: 'var(--mui-palette-primary-main)',
      hover: {
        size: 6
      },
      radius: 4
    },
    stroke: {
      curve: 'smooth',
      width: [0, 3],
      lineCap: 'round'
    },
    legend: {
      show: true,
      position: 'bottom',
      markers: {
        width: 8,
        height: 8,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 8 : -4
      },
      height: 40,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      fontSize: '15px',
      fontFamily: 'Open Sans',
      fontWeight: 400,
      labels: {
        colors: 'var(--mui-palette-text-primary)'
      },
      offsetY: 10
    },
    grid: {
      strokeDashArray: 8,
      borderColor: 'var(--mui-palette-divider)'
    },
    colors: ['var(--mui-palette-warning-main)', 'var(--mui-palette-primary-main)'],
    fill: {
      opacity: [1, 1]
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      tickAmount: categories.length,
      categories: categories,
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontSize: '13px',
          fontWeight: 400
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader title='Hồ sơ đăng ký' />
      <CardContent>
        <AppReactApexCharts
          id='shipment-statistics'
          type='line'
          height={280}
          width='100%'
          series={series}
          options={options}
        />
      </CardContent>
    </Card>
  )
}

export default LicenseRegistrationColumnChart
