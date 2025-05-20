import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { ReactNode } from 'react';




type Props = {
    titlePage: ReactNode
    vehicleTypePage: any
    ownerId?: string
}

const CustomerRegisterForm = ({ titlePage, vehicleTypePage, ownerId }: Props) => {
    return (
        <Card>
            <CardHeader title='Shipping Activity' />
            <CardContent>
                <Timeline>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                <Typography color='text.primary' className='font-medium'>
                                    Order was placed (Order ID: #{1})
                                </Typography>
                                <Typography variant='caption'>Tuesday 11:29 AM</Typography>
                            </div>
                            <Typography className='mbe-2'>Your order has been placed successfully</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                <Typography color='text.primary' className='font-medium'>
                                    Pick-up
                                </Typography>
                                <Typography variant='caption'>Wednesday 11:29 AM</Typography>
                            </div>
                            <Typography className='mbe-2'>Pick-up scheduled with courier</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                <Typography color='text.primary' className='font-medium'>
                                    Dispatched
                                </Typography>
                                <Typography variant='caption'>Thursday 8:15 AM</Typography>
                            </div>
                            <Typography className='mbe-2'>Item has been picked up by courier.</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                <Typography color='text.primary' className='font-medium'>
                                    Package arrived
                                </Typography>
                                <Typography variant='caption'>Saturday 15:20 AM</Typography>
                            </div>
                            <Typography className='mbe-2'>Package arrived at an Amazon facility, NY</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
                                <Typography color='text.primary' className='font-medium'>
                                    Dispatched for delivery
                                </Typography>
                                <Typography variant='caption'>Today 14:12 PM</Typography>
                            </div>
                            <Typography className='mbe-2'>Package has left an Amazon facility , NY</Typography>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='primary' />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography color='text.primary' className='font-medium'>
                                Delivery
                            </Typography>
                            <Typography className='mbe-2'>Package will be delivered by tomorrow</Typography>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>
            </CardContent>
        </Card>
    );
}

export default CustomerRegisterForm
