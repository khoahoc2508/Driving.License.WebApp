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
import StatisticAPI from '@/libs/api/statisticAPI'
import type { ExamPassFailPercentageResponse } from '@/types/statisticTypes'

// Vars
const initialData = [
  { pass: 75, fail: 25, name: 'Jan' },
  { pass: 68, fail: 32, name: 'Feb' },
  { pass: 82, fail: 18, name: 'Mar' },
  { pass: 79, fail: 21, name: 'Apr' },
  { pass: 85, fail: 15, name: 'May' },
  { pass: 76, fail: 24, name: 'Jun' },
  { pass: 80, fail: 20, name: 'Jul' },
  { pass: 72, fail: 28, name: 'Aug' },
  { pass: 78, fail: 22, name: 'Sep' },
  { pass: 83, fail: 17, name: 'Oct' },
  { pass: 70, fail: 30, name: 'Nov' },
  { pass: 75, fail: 25, name: 'Dec' }
]

const CustomTooltip = (props: TooltipProps<any, any>) => {
  // Props
  const { active, payload } = props

  if (active && payload && payload.length) {
    return (
      <div className='recharts-custom-tooltip'>
        <Typography fontSize='0.875rem' color='text.primary'>{payload[0].name}: {payload[0].value}%</Typography>
        {payload.length > 1 && (
          <Typography fontSize='0.875rem' color='text.primary'>{payload[1].name}: {payload[1].value}%</Typography>
        )}
      </div>
    )
  }

  return null
}

const RechartsLineChart = () => {
  // Hooks
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(initialData)

  // Fetch exam pass/fail percentage data
  useEffect(() => {
    const fetchExamPassFailData = async () => {
      try {
        setLoading(true)
        // Lấy dữ liệu thống kê cho 12 tháng gần nhất
        const endDate = new Date().toISOString()
        const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString()

        const response = await StatisticAPI.getExamPassFailPercentage({
          startDate,
          endDate
        })

        if (response.data?.success && response.data?.data) {
          const data: ExamPassFailPercentageResponse = response.data.data

          // Chuyển đổi dữ liệu từ API thành định dạng cho biểu đồ
          if (data.dataFollowMonth && data.dataFollowMonth.length > 0) {
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            // Tạo bản sao của initialData
            const newChartData = [...initialData]

            // Cập nhật dữ liệu cho các tháng có trong response
            data.dataFollowMonth.forEach(item => {
              if (item.monthOfYear !== undefined && item.monthOfYear >= 1 && item.monthOfYear <= 12) {
                newChartData[item.monthOfYear - 1] = {
                  pass: item.passPercentage || 0,
                  fail: item.failPercentage || 0,
                  name: monthNames[item.monthOfYear - 1]
                }
              }
            })

            // setChartData(newChartData)
          }
        }
      } catch (error) {
        console.error('Error fetching exam pass/fail data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExamPassFailData()
  }, [])

  return (
    <Card>
      <CardHeader
        title='Tỷ lệ thi'
        // subheader='Theo tháng'
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
                  <LabelList dataKey='pass' position='top' formatter={(value: number) => `${value}`} style={{ fill: '#4caf50', fontSize: '0.75rem' }} />
                </Line>
                <Line name='Rớt' dataKey='fail' stroke='#f44336' strokeWidth={3}>
                  <LabelList dataKey='fail' position='bottom' formatter={(value: number) => `${value}`} style={{ fill: '#f44336', fontSize: '0.75rem' }} />
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
