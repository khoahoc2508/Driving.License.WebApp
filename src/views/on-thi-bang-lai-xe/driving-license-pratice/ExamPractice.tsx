'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Button, Card, CardContent, Grid, Typography, Container, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

import type { questionTypes } from '@/types/questionTypes'
import type { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'
import type { AnswerSubmissionRequestDto } from '@/types/examSubmissionTypes'
import { Console } from 'console'
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
    examSubmissionId,
    isPractice
}: {
    exam: any,
    questions: questionTypes[],
    onBack: () => void,
    selectedClass: GroupExamDto | null,
    selectedExamType: GroupExamDto | null,
    examSubmissionId: string,
    isPractice: Boolean
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleSubmit = useCallback(async (isAutoSubmit = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (isAutoSubmit) {
            toast.info('Hết giờ! Tự động nộp bài...');
        }

        try {

            const answerPayload: AnswerSubmissionRequestDto = questions.map(q => ({
                questionId: q.id,
                selectedAnswerId: q.id ? answers[q.id] ?? undefined : undefined
            }));

            await ExamSubmissionAPI.submitExam({
                examSubmissionId,
                answers: answerPayload
            });

            toast.success('Nộp bài thành công!');

            router.push(`/on-thi-bang-lai-xe/result?examSubmissionId=${examSubmissionId}`);
        } catch (error) {
            toast.error('Nộp bài thất bại. Vui lòng thử lại.');
            setIsSubmitting(false);
        }
    }, [answers, examSubmissionId, router]);

    const handleSubmitRef = useRef(handleSubmit);

    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [handleSubmit]);

    // Bỏ timer nếu là Practice
    useEffect(() => {
        if (isPractice || timeLeft <= 0) {
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, isPractice]);

    // Không tự động nộp bài nếu là Practice
    useEffect(() => {
        if (!exam?.type) return;

        if (!isPractice && timeLeft === 0) {
            handleSubmitRef.current(true);
        }
    }, [timeLeft, isPractice, exam]);

    const handleOpenConfirmDialog = () => {
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleConfirmSubmit = () => {
        handleSubmit(false);
        handleCloseConfirmDialog();
    };

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

    useEffect(() => {
        const examSubmissionId = searchParams.get('examSubmissionId')

        if (examSubmissionId) {
            router.push(`/on-thi-bang-lai-xe/result?examSubmissionId=${examSubmissionId}`)
        }
    }, [searchParams, router])

    // if (!currentQuestion) {
    //     return (
    //         <Container maxWidth="lg">
    //             <Box sx={{ p: { xs: 2, md: 6 }, textAlign: 'center' }}>
    //                 <Typography variant="h5">Đề thi này không có câu hỏi.</Typography>
    //                 <Button variant="text" onClick={onBack} sx={{ mt: 2 }}>
    //                     Quay lại danh sách đề
    //                 </Button>
    //             </Box>
    //         </Container>
    //     )
    // }

    return (
        <Container className='max-w-[87%]'>
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
                            {/* Ẩn đồng hồ nếu là Practice */}
                            {!isPractice && (
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="h5">Thời gian:</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: timeLeft <= exam.durationMinutes * 60 * 0.05 ? 'error.main' : 'primary.main' }}>
                                                    <i className='ri-time-line' style={{ fontSize: '1.25rem', marginRight: '4px' }} />
                                                    <Typography variant='h6' component='span' sx={{ fontWeight: 'medium' }} className={timeLeft <= exam.durationMinutes * 60 * 0.05 ? 'text-error' : 'text-primary'}>
                                                        {formatTime(timeLeft)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5" mb={2}>Danh sách câu hỏi:</Typography>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(5, 1fr)',
                                                gap: 2,
                                                justifyItems: 'center',
                                                alignItems: 'center'
                                            }}
                                            className="rounded-sm py-4 mt-5"
                                        >
                                            {questions.map((q, index) => (
                                                <Button
                                                    key={q.id || index}
                                                    variant={index === currentQuestionIndex ? 'contained' : 'outlined'}
                                                    color={(index === currentQuestionIndex || (q.id && answers[q.id])) ? 'primary' : 'inherit'}
                                                    onClick={() => setCurrentQuestionIndex(index)}
                                                    sx={{ width: 50, height: 45, fontSize: 15, p: 0 }}
                                                >
                                                    {index + 1}
                                                </Button>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '100%' }} className='flex flex-col justify-between'>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" className='text-[#98999e]'>Câu {currentQuestionIndex + 1}</Typography>
                                <Typography variant="h6" className='my-3' sx={{ fontWeight: 600 }}>{currentQuestion.content}</Typography>
                                {currentQuestion.imageUrl && <QuestionImage src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + currentQuestion.imageUrl} alt={`Question ${currentQuestionIndex + 1}`} />}
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenConfirmDialog}
                                    disabled={isSubmitting}
                                >
                                    KẾT THÚC THI
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <Box mt={4} display="flex" justifyContent="center">
                    <Button variant="text" onClick={onBack}>Quay lại danh sách đề</Button>
                </Box>
            </Box>
            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Kết thúc bài thi?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn chắc chắn muốn kết thúc bài thi?
                    </Typography>
                </DialogContent>
                <DialogActions className='p-4'>
                    <Button onClick={handleCloseConfirmDialog} variant="outlined" color="error">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmSubmit} variant="contained" color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ExamPractice 
