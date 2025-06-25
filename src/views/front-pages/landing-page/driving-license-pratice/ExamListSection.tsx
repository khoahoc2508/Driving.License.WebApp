import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import PracticeCard from './PracticeCard'
import styles from './styles.module.css'
import type { GroupExamDto } from '@/types/groupExamTypes'

interface ExamListSectionProps {
    selectedClass: GroupExamDto | null
    examList: any[]
    onBack: () => void
    onStartExam: (exam: any) => void
}

const ExamListSection = ({ selectedClass, examList, onBack, onStartExam }: ExamListSectionProps) => (
    <div className='bg-backgroundPaper py-10'>
        <div className={styles.layoutSpacing}>
            <Button variant='outlined' onClick={onBack} style={{ marginBottom: 32 }}>
                Quay lại
            </Button>
            <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
                {selectedClass?.name} - THI THEO BỘ ĐỀ
            </Typography>
            <Grid container spacing={6} justifyContent='center'>
                {examList.length === 0 && (
                    <Typography className='text-center w-full'>Không có đề thi nào cho hạng này.</Typography>
                )}
                {examList.map((exam: any) => (
                    <Grid item xs={12} md={6} lg={4} key={exam.id}>
                        <PracticeCard
                            icon='ri-file-list-2-line'
                            title={exam.name || `Đề ${exam.id}`}
                            description={exam.description || ''}
                            buttonText='Bắt đầu thi'
                            onButtonClick={() => onStartExam(exam)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    </div>
)

export default ExamListSection
