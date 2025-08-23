'use client'

import { Box, Typography } from '@mui/material'

const TasksTab = () => {
    return (
        <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
                Danh sách công việc
            </Typography>
            <Typography variant='body2' color="text.secondary">
                Tính năng này sẽ được phát triển sau
            </Typography>
        </Box>
    )
}

export default TasksTab
