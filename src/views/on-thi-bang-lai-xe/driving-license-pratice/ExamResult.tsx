'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, Card, CardContent, Grid, Typography, Container, Divider } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

import type { questionTypes } from '@/types/questionTypes'
import type { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'
import type { ExamSubmissionResultDto, ExamSubmissionAnswerDto } from '@/types/examSubmissionTypes'
import ExamLayoutWrapper from './ExamLayoutWrapper'
import CONFIG from '@/configs/config'

const QuestionImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    margin: '12px auto',
    borderRadius: '8px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

interface ExamResultProps {
    examSubmissionId: string
}

const ExamResult = ({ examSubmissionId }: ExamResultProps) => {
    const router = useRouter()
    const [result, setResult] = useState<ExamSubmissionResultDto | null>(null)
    const [questions, setQuestions] = useState<questionTypes[]>([])
    const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchExamResult = async () => {
            try {
                setIsLoading(true)
                const res = await ExamSubmissionAPI.getExamResult(examSubmissionId)

                if (res.data?.data) {
                    setResult(res.data.data)
                    const questionList = res.data.data.userAnswers?.map((answer: ExamSubmissionAnswerDto) => answer.question).filter(Boolean) || []

                    setQuestions(questionList)
                    setSelectedClass(res.data.data.licenseTypeDto)
                } else {
                    toast.error('Không tìm thấy kết quả thi')
                    router.push('/on-thi-bang-lai-xe')
                }
            } catch (error) {
                toast.error('Không thể tải kết quả thi')
                router.push('/on-thi-bang-lai-xe')
            } finally {
                setIsLoading(false)
            }
        }

        if (examSubmissionId) {
            fetchExamResult()
        }
    }, [examSubmissionId, router])

    const formatResultDuration = (duration?: string) => {
        if (!duration) return '-';
        const [hms] = duration.split('.');


        return hms;
    };

    const handleBackToList = () => {
        router.push('/on-thi-bang-lai-xe')
    }

    const handleRestartExam = () => {
        router.push('/on-thi-bang-lai-xe')
    }

    const isPassed = result?.isPassed;
    const hasCriticalMistake = result?.hasCriticalMistake;
    const currentResultAnswer: ExamSubmissionAnswerDto | undefined = result?.userAnswers?.find((a: ExamSubmissionAnswerDto) => a.question?.id === questions[currentQuestionIndex]?.id);

    return (
        <ExamLayoutWrapper isLoading={isLoading}>
            {
                isLoading ? <div className='h-screen'></div> : <Container className='max-w-[87%]'>
                    <Box sx={{ p: { xs: 2, md: 6 } }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                            <Typography variant="h5" fontWeight={500}>Kết quả thi</Typography>
                                            <Box sx={{ background: isPassed ? '#F3F7FF' : '#FFEFF0', borderRadius: '16px', px: 2, py: 0.5 }}>
                                                <Typography fontWeight={500} color={isPassed ? 'primary.main' : '#f55156'} fontSize={14}>
                                                    {isPassed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Divider />
                                        <Box mt={2} mb={2}>
                                            <Box display="flex" alignItems="center" mb={4}>
                                                <Typography>Hạng xe:&nbsp;</Typography>
                                                <Typography fontWeight={600}>{selectedClass?.name || '-'}</Typography>
                                            </Box>
                                            {selectedClass?.type !== CONFIG.GroupExamType.Practice && <Box display="flex" alignItems="center" mb={4}>
                                                <Typography>Thời gian làm bài:&nbsp;</Typography>
                                                <Typography fontWeight={600}>{formatResultDuration(result?.duration)}</Typography>
                                            </Box>}
                                            <Box display="flex" alignItems="center" mb={4}>
                                                <Typography>Tổng câu đúng:&nbsp;</Typography>
                                                <Typography fontWeight={600}>{result?.correctAnswerCount}/{result?.totalQuestions}</Typography>
                                            </Box>
                                            {hasCriticalMistake && (
                                                <Box mt={2}>
                                                    <Typography component="span" fontWeight={600}>Lưu ý: </Typography>
                                                    <Typography component="span" fontWeight={600} color="red">Bạn đã trả lời sai câu liệt.</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Button variant="contained" fullWidth sx={{ mt: 3, background: '#8B5CF6', color: '#fff', fontWeight: 700, fontSize: 15, py: 1.5, boxShadow: 'none', ':hover': { background: '#7C3AED' } }} onClick={handleRestartExam}>
                                            THI LẠI
                                        </Button>
                                    </CardContent>
                                </Card>
                                <Card className='mt-2'>
                                    <CardContent>
                                        <Typography variant="h5" mb={2} fontWeight={500}>Danh sách câu hỏi</Typography>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr)',
                                                gap: 2,
                                                justifyItems: 'center',
                                                alignItems: 'center',
                                            }}
                                            className="rounded-sm py-4 mt-5"
                                        >
                                            {questions.map((q, index) => {
                                                const userAnswer: ExamSubmissionAnswerDto | undefined = result?.userAnswers?.find((a: ExamSubmissionAnswerDto) => a.question?.id === q.id);
                                                let color: 'success' | 'error' | 'inherit' | 'primary' = 'inherit';

                                                if (userAnswer?.selectedAnswerId) {
                                                    const isCorrect = userAnswer.question?.answers?.find((ans) => ans.id === userAnswer.selectedAnswerId)?.isCorrect;

                                                    color = isCorrect ? 'success' : 'error';
                                                }

                                                color = index === currentQuestionIndex ? 'primary' : color

                                                const isCritical = userAnswer?.question?.isCriticalQuestion || q.isCriticalQuestion;

                                                return (
                                                    <Button
                                                        variant={index + 1 === currentQuestionIndex + 1 ? 'contained' : 'outlined'}
                                                        color={color}
                                                        key={q.id || index}
                                                        onClick={() => setCurrentQuestionIndex(index)}
                                                        sx={{ position: 'relative', width: 50, height: 45, fontSize: 15, p: 0 }}
                                                    >
                                                        {index + 1}
                                                        {isCritical && (
                                                            <Box component="span" sx={{ position: 'absolute', top: 4, right: 6, color: 'red', fontSize: 18, fontWeight: 700 }}>*</Box>
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Card sx={{ height: '100%' }} className='flex flex-col justify-between'>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h5" className='text-[#98999e]'>Câu {currentQuestionIndex + 1}{questions[currentQuestionIndex]?.isCriticalQuestion ? <span className='text-error'> *</span> : ''}</Typography>
                                        <Typography variant="h6" className='my-3' sx={{ fontWeight: 600 }}>{questions[currentQuestionIndex]?.content}</Typography>
                                        {questions[currentQuestionIndex]?.imageUrl && <QuestionImage src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + questions[currentQuestionIndex]?.imageUrl} alt={`Question ${currentQuestionIndex + 1}`} />}
                                        <Divider sx={{ mb: 4 }} />
                                        <div>
                                            {(currentResultAnswer?.question?.answers || questions[currentQuestionIndex]?.answers)?.map((ans, index) => {
                                                const answer = ans as { id?: string; order?: number; content?: string; isCorrect?: boolean };
                                                const isCorrect = answer.isCorrect;
                                                const isSelected = currentResultAnswer?.selectedAnswerId === answer.id;
                                                let bg = 'transparent', color = 'inherit', border = '1px solid #e0e0e0';

                                                if (isCorrect) {
                                                    bg = '#4caf50'; color = '#fff'; border = '1px solid #4caf50';
                                                } else if (isSelected) {
                                                    color = 'red'; border = '1px solid red';
                                                }

                                                return (
                                                    <Box
                                                        key={answer.id
                                                            || index
                                                        } sx={{
                                                            background: bg,
                                                            color,
                                                            border,
                                                            borderRadius: '8px',
                                                            p: '12px 16px',
                                                            mb: '8px',
                                                            fontWeight: isCorrect ? 600 : 400,
                                                        }}>
                                                        {`${answer.order}. ${answer.content}`}
                                                    </Box>
                                                );
                                            })}
                                        </div>
                                        <Divider sx={{ mt: 4 }} />
                                        {currentResultAnswer?.question?.explanation && (
                                            <Box sx={{ mt: 4, p: 2, border: '1px solid #7c4dff', borderRadius: '8px', color: '#7c4dff' }}>
                                                Giải thích: {currentResultAnswer?.question?.explanation}
                                            </Box>
                                        )}
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
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleRestartExam}
                                        >
                                            THI LẠI
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                        <Box mt={4} display="flex" justifyContent="center">
                            <Button variant="text" onClick={handleBackToList}>Quay lại danh sách đề</Button>
                        </Box>
                    </Box>
                </Container>
            }
        </ExamLayoutWrapper>

    )
}

export default ExamResult 
