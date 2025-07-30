import React from 'react'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import PracticeCard from './PracticeCard'
import styles from './styles.module.css'
import type { GroupExamDto } from '@/types/groupExamTypes'
import CONFIG from '@/configs/config'

interface ExamTypeSectionProps {
    selectedClass: GroupExamDto
    onSelectType: (child: GroupExamDto) => void
}

const ExamTypeSection = ({ selectedClass, onSelectType }: ExamTypeSectionProps) => (
    <div className='bg-backgroundPaper py-10'>
        <div className={styles.layoutSpacing}>
            <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
                {selectedClass.name}
            </Typography>
            <Grid container spacing={6} justifyContent='center'>
                {selectedClass.children?.map(child => (
                    <Grid item xs={12} md={6} lg={4} key={child.id}>
                        <PracticeCard
                            icon={'ri-file-list-2-line'}
                            title={child.name}
                            description={child.description}
                            buttonText={child.type === CONFIG.GroupExamType.Detail ? 'Chi tiết' :
                                child.type === CONFIG.GroupExamType.Exam ? 'Bắt đầu thi' : 'Ôn luyện'
                            }
                            onButtonClick={() => onSelectType(child)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    </div>
)

export default ExamTypeSection
