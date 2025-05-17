'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports

// Component Imports
import { OrderType } from '@/types/ecommerceTypes'
import Table from './Table'

const OrderList = ({ orderData }: { orderData?: OrderType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Table dataTable={orderData} />
      </Grid>
    </Grid>
  )
}

export default OrderList
