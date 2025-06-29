'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'



// Component Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from '@/libs/Recharts'
import type { TooltipProps } from '@/libs/Recharts'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

// API Imports
import type { ExamPassFailPercentageResponse } from '@/types/statisticTypes'

// Types
interface ChartDataItem {
  pass: number
  fail: number
  name: string
  date?: string
}



const CustomTooltip = (props: TooltipProps<any, any>) => {
  // Props
  const { active, payload, label } = props

  if (active && payload && payload.length) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography fontSize='0.875rem' color='text.primary' fontWeight='bold'>
          Tháng {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            fontSize='0.875rem'
            color='text.primary'
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}%
          </Typography>
        ))}
      </div>
    )
  }

  return null
}

export interface RechartsLineChartProps {
  data?: ExamPassFailPercentageResponse | null
  loading?: boolean
  onRefresh?: () => void
}

const RechartsLineChart = ({
  data: externalData,
  loading: externalLoading = false,
  onRefresh
}: RechartsLineChartProps = {}) => {
  // Hooks
  const theme = useTheme()
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  // Function to process API data into chart format
  const processApiData = (data: ExamPassFailPercentageResponse): ChartDataItem[] => {
    // Ưu tiên dataFollowExamSchedule nếu có dữ liệu
    if (data.dataFollowExamSchedule && data.dataFollowExamSchedule.length > 0) {
      return data.dataFollowExamSchedule.map(item => ({
        pass: Math.round(item.passPercentage || 0),
        fail: Math.round(item.failPercentage || 0),
        name: item.name || 'Unknown',
        date: item.dateTime
      }))
    }

    // Nếu không có dataFollowExamSchedule, sử dụng dataFollowMonth
    if (data.dataFollowMonth && data.dataFollowMonth.length > 0) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

      // Tạo array rỗng cho 12 tháng
      const newChartData: ChartDataItem[] = monthNames.map(name => ({
        pass: 0,
        fail: 0,
        name
      }))

      data.dataFollowMonth.forEach(item => {
        if (item.monthOfYear !== undefined && item.monthOfYear >= 1 && item.monthOfYear <= 12) {
          const passPercentage = Math.round(item.passPercentage || 0)
          const failPercentage = Math.round(item.failPercentage || 0)

          newChartData[item.monthOfYear - 1] = {
            pass: passPercentage,
            fail: failPercentage,
            name: monthNames[item.monthOfYear - 1]
          }
        }
      })

      return newChartData
    }

    // Nếu không có dữ liệu nào, trả về array rỗng
    return []
  }

  // Effect to handle external data
  useEffect(() => {
    if (externalData) {
      const processedData = processApiData(externalData)
      setChartData(processedData)
    } else {
      setChartData([])
    }
  }, [externalData])

  return (
    <Card>
      <CardHeader
        title='Tỷ lệ thi'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>

        <AppRecharts>
          <div className='bs-[350px]'>
            <ResponsiveContainer>
              <LineChart height={350} data={chartData} style={{ direction: theme.direction }} margin={{ left: -20, right: 20, top: 20, bottom: 10 }}>
                <CartesianGrid />
                <XAxis dataKey='name' reversed={theme.direction === 'rtl'} />
                <YAxis orientation={theme.direction === 'rtl' ? 'right' : 'left'} />
                <Tooltip content={CustomTooltip} />
                <Legend />
                <Line name='Đậu' dataKey='pass' stroke='#4caf50' strokeWidth={3}>
                  <LabelList dataKey='pass' position='top' formatter={(value: number) => `${value}%`} style={{ fill: '#4caf50', fontSize: '0.75rem' }} />
                </Line>
                <Line name='Rớt' dataKey='fail' stroke='#f44336' strokeWidth={3}>
                  <LabelList dataKey='fail' position='bottom' formatter={(value: number) => `${value}%`} style={{ fill: '#f44336', fontSize: '0.75rem' }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
