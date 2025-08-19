'use client'

import { Box, Typography, Card, CardContent } from '@mui/material'

const PaymentHistoryTab = () => {
    return (
        <Card>
            <CardContent>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Lịch sử thanh toán
                    </Typography>
                    <Typography color="text.secondary">
                        Tính năng đang được phát triển...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Sẽ hiển thị lịch sử các giao dịch thanh toán của hồ sơ này
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default PaymentHistoryTab
