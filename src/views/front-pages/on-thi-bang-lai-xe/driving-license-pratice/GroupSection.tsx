import React from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import PracticeCard from './PracticeCard'
import type { GroupExamDto } from '@/types/groupExamTypes'

interface GroupSectionProps {
    group: GroupExamDto
    onSelect: (child: GroupExamDto) => void
}

const GroupSection = ({ group, onSelect }: GroupSectionProps) => (
    <section key={group.id} className={`py-10 w-[82%] m-auto`}>
        <Typography variant='h4' className='text-center mbe-6 flex items-center justify-center gap-2'>
            {group.name}
        </Typography>
        <Grid container spacing={6} justifyContent='center'>
            {group.children?.map(child => (
                <Grid item xs={12} md={6} lg={4} key={child.id}>
                    <PracticeCard
                        icon={child.iconUrl || ''}
                        title={child.name}
                        description={child.description}
                        buttonText='Chi tiết'
                        onButtonClick={() => onSelect(child)}
                    />
                </Grid>
            ))}
        </Grid>
    </section>
)

export default GroupSection
