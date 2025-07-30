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
          {label}
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
      const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

      // Chỉ tạo dữ liệu cho những tháng có trong API response
      const newChartData: ChartDataItem[] = data.dataFollowMonth
        .filter(item => item.monthOfYear !== undefined && item.monthOfYear >= 1 && item.monthOfYear <= 12)
        .map(item => ({
          pass: Math.round(item.passPercentage || 0),
          fail: Math.round(item.failPercentage || 0),
          name: `Tháng ${monthNames[item.monthOfYear! - 1]}`
        }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name)) // Sắp xếp theo thứ tự tháng

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
                <XAxis
                  dataKey='name'
                  reversed={theme.direction === 'rtl'}
                  tick={{
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}
                  tickMargin={14}
                />
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
