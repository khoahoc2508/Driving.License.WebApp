'use client'

import React, { useState, useEffect } from 'react'
import { Box, Button, Card, CardContent, Grid, Typography, Container, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { questionTypes } from '@/types/questionTypes'
import { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'


const QuestionImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    margin: '16px 0',
    borderRadius: '8px'
})

const AnswerLabel = styled('div')<{ selected: boolean }>(({ theme, selected }) => ({
    padding: '12px 16px',
    border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    backgroundColor: selected ? theme.palette.primary.main : 'transparent',
    color: selected ? theme.palette.primary.contrastText : 'inherit',
    '&:hover': {
        borderColor: theme.palette.primary.main
    },
}))

const ExamPractice = ({
    exam,
    questions,
    onBack,
    selectedClass,
    selectedExamType,
    examSubmissionId
}: {
    exam: any,
    questions: questionTypes[],
    onBack: () => void,
    selectedClass: GroupExamDto | null,
    selectedExamType: GroupExamDto | null,
    examSubmissionId: string
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleAnswerChange = (questionId: string | undefined, answerId: string) => {
        if (questionId) {
            setAnswers(prev => ({ ...prev, [questionId]: answerId }))
        }
    }

    const currentQuestion = questions[currentQuestionIndex]

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = async () => {
        try {
            const answerPayload = Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
                questionId,
                selectedAnswerId
            }));
            await ExamSubmissionAPI.submitExam({
                examSubmissionId,
                answers: answerPayload
            });

            toast.success('Nộp bài thành công!');
            onBack();
        } catch (error) {
            toast.error('Nộp bài thất bại. Vui lòng thử lại.');
        }
    }

    if (!currentQuestion) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ p: { xs: 2, md: 6 }, textAlign: 'center' }}>
                    <Typography variant="h5">Đề thi này không có câu hỏi.</Typography>
                    <Button variant="text" onClick={onBack} sx={{ mt: 2 }}>
                        Quay lại danh sách đề
                    </Button>
                </Box>
            </Container>
        )
    }

    return (
        <Container className='max-w-[85%]'>
            <Box sx={{ p: { xs: 2, md: 6 } }}>
                <Typography variant="h4" gutterBottom align="center">
                    {selectedClass?.name?.toUpperCase()} - {selectedExamType?.name?.toUpperCase()}
                </Typography>
                <Typography variant="h5" gutterBottom align="center" sx={{ color: 'text.secondary', mb: 4 }}>
                    {exam.name}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6">Thời gian:</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                                                <i className='ri-time-line' style={{ fontSize: '1.25rem', marginRight: '4px' }} />
                                                <Typography variant='h6' component='span' sx={{ fontWeight: 'medium' }} className='text-primary'>
                                                    {formatTime(timeLeft)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" mb={2}>Danh sách câu hỏi:</Typography>
                                        <Grid container spacing={1} className='border rounded-sm px-8 py-4 mt-5'>
                                            {questions.map((q, index) => (
                                                <Grid item xs={3} key={q.id || index}>
                                                    <Button
                                                        variant={index === currentQuestionIndex ? 'contained' : 'outlined'}
                                                        color={(index === currentQuestionIndex || (q.id && answers[q.id])) ? 'primary' : 'inherit'}
                                                        onClick={() => setCurrentQuestionIndex(index)}
                                                    >
                                                        {index + 1}
                                                    </Button>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '100%' }} className='flex flex-col justify-between'>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" className='text-[#98999e]'>Câu {currentQuestionIndex + 1} {currentQuestion.isCriticalQuestion && <span className='text-red-600'>*</span>}</Typography>
                                <Typography variant="h6" className='my-3' sx={{ fontWeight: 600 }}>{currentQuestion.content}</Typography>
                                {currentQuestion.imageUrl && <QuestionImage src={currentQuestion.imageUrl} alt={`Question ${currentQuestionIndex + 1}`} />}
                                <Divider sx={{ mb: 4 }} />
                                <div>
                                    {currentQuestion.answers?.map(answer => (
                                        <AnswerLabel
                                            key={answer.id}
                                            selected={!!(currentQuestion.id && answer.id && answers[currentQuestion.id] === answer.id)}
                                            onClick={() => handleAnswerChange(currentQuestion.id, answer.id || '')}
                                        >
                                            {`${answer.order}. ${answer.content}`}
                                        </AnswerLabel>
                                    ))}
                                </div>
                            </CardContent>
                            <Divider />
                            <Box display="flex" justifyContent="space-between" alignItems="center" paddingX={6} paddingY={3}>
                                <div>
                                    <Button
                                        variant="outlined"
                                        disabled={currentQuestionIndex === 0}
                                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                        startIcon={<i className='ri-arrow-left-line' />}
                                    >
                                        TRƯỚC
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                        sx={{ ml: 2 }}
                                        endIcon={<i className='ri-arrow-right-line' />}
                                    >
                                        SAU
                                    </Button>
                                </div>
                                <Button variant="contained" color="primary" onClick={handleSubmit}>KẾT THÚC THI</Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="center">
                    <Button variant="text" onClick={onBack}>Quay lại danh sách đề</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default ExamPractice 
