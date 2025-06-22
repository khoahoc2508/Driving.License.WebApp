import React from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import PracticeCard from './PracticeCard'
import styles from './styles.module.css'
import { GroupExamDto } from '@/types/groupExamTypes'

interface ExamTypeSectionProps {
    selectedClass: GroupExamDto
    onBack: () => void
    onSelectType: (child: GroupExamDto) => void
}

const ExamTypeSection = ({ selectedClass, onBack, onSelectType }: ExamTypeSectionProps) => (
    <div className='bg-backgroundPaper py-10'>
        <div className={styles.layoutSpacing}>
            <Button variant='outlined' onClick={onBack} style={{ marginBottom: 32 }}>
                Quay lại
            </Button>
            <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
                {selectedClass.name}
            </Typography>
            <Grid container spacing={6} justifyContent='center'>
                {selectedClass.children?.map(child => (
                    <Grid item xs={12} md={6} lg={4} key={child.id}>
                        <PracticeCard
                            icon={child.iconUrl || ''}
                            title={child.name}
                            description={child.description}
                            buttonText={child.name === 'THI THEO BỘ ĐỀ' ? 'Chi tiết' : 'Bắt đầu thi'}
                            onButtonClick={() => onSelectType(child)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    </div>
)

export default ExamTypeSection
