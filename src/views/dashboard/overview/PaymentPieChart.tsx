'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// Component Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from '@/libs/Recharts'
import type { StatisticOverviewResponse } from '@/types/statisticTypes'

// Styled Component Imports
const AppRecharts = dynamic(() => import('@/libs/styles/AppRecharts'))

type LabelProp = {
  cx: number
  cy: number
  percent: number
  midAngle: number
  innerRadius: number
  outerRadius: number
}

// Vars

const RADIAN = Math.PI / 180

const renderCustomizedLabel = (props: LabelProp) => {
  // Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props

  // Vars
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

type Props = {
  statistics: StatisticOverviewResponse | null
}

const PaymentPieChart = ({ statistics }: Props) => {
  // Tạo dữ liệu cho biểu đồ từ statistics
  const chartData = [
    {
      name: 'Đã thanh toán',
      value: statistics?.percentagePaid || 0,
      color: '#00d4bd'
    },
    {
      name: 'Chưa thanh toán',
      value: statistics?.percentageUnpaid || 0,
      color: '#FFA1A1'
    },
  ]

  return (
    <Card>
      <CardHeader title='Thanh toán' />
      <CardContent>
        <AppRecharts>
          <div className='bs-[245px]'>
            <ResponsiveContainer>
              <PieChart height={280} style={{ direction: 'ltr' }}>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  dataKey='value'
                  label={renderCustomizedLabel}
                  labelLine={false}
                  stroke='none'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AppRecharts>
        <div className='flex justify-center flex-wrap mbe-4'>
          <Box className='flex items-center mie-5 gap-1.5' sx={{ '& i': { color: '#00d4bd' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Đã thanh toán</Typography>
          </Box>
          {/* <Box className='flex items-center mie-5 gap-1.5' sx={{ '& i': { color: '#ffe700' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Operational</Typography>
          </Box> */}
          <Box className='flex items-center mie-5 gap-1.5' sx={{ '& i': { color: '#FFA1A1' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Chưa thanh toán</Typography>
          </Box>
          {/* <Box className='flex items-center gap-1.5' sx={{ '& i': { color: '#826bf8' } }}>
            <i className='ri-circle-fill text-xs' />
            <Typography variant='body2'>Hiring</Typography>
          </Box> */}
        </div>
      </CardContent>
    </Card>
  )
}

export default PaymentPieChart
