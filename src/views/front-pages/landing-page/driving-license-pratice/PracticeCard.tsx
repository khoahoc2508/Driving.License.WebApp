import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import classNames from 'classnames'

interface PracticeCardProps {
    icon: string
    title: string
    description?: string
    buttonText: string
    onButtonClick?: () => void
}

const PracticeCard = ({ icon, title, description, buttonText, onButtonClick }: PracticeCardProps) => (
    <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <i className={classNames(icon, 'text-[26px]')} />
            <Typography variant='h5'>{title}</Typography>
            <Typography style={{ flex: 1 }}>{description}</Typography>
            <div style={{ marginTop: 'auto' }}>
                <Button variant='outlined' onClick={onButtonClick}>{buttonText}</Button>
            </div>
        </CardContent>
    </Card>
)

export default PracticeCard
