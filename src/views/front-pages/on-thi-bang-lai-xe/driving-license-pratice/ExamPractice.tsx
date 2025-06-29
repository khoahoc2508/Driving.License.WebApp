'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

import { Box, Button, Card, CardContent, Grid, Typography, Container, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

import type { questionTypes } from '@/types/questionTypes'
import type { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'
import type { ExamSubmissionResultDto, ExamSubmissionAnswerDto } from '@/types/examSubmissionTypes'


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
    onStartExam
}: {
    exam: any,
    questions: questionTypes[],
    onBack: () => void,
    selectedClass: GroupExamDto | null,
    selectedExamType: GroupExamDto | null,
    examSubmissionId: string,
    onStartExam: (exam: any) => void
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [result, setResult] = useState<ExamSubmissionResultDto | null>(null)

    const handleSubmit = useCallback(async (isAutoSubmit = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (isAutoSubmit) {
            toast.info('Hết giờ! Tự động nộp bài...');
        }

        try {
            const answerPayload = Object.entries(answers).map(([questionId, selectedAnswerId]) => ({
                questionId,
                selectedAnswerId
            }));

            const res = await ExamSubmissionAPI.submitExam({
                examSubmissionId,
                answers: answerPayload
            });

            toast.success('Nộp bài thành công!');
            setResult(res.data?.data || null);
        } catch (error) {
            toast.error('Nộp bài thất bại. Vui lòng thử lại.');
            setIsSubmitting(false);
        }
    }, [answers, examSubmissionId, onBack, isSubmitting]);

    const handleSubmitRef = useRef(handleSubmit);

    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [handleSubmit]);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmitRef.current(true);
        }
    }, [timeLeft]);

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

    const formatResultDuration = (duration?: string) => {
        if (!duration) return '-';
        const [hms] = duration.split('.');


        return hms;
    };

    const handleResartExam = () => {
        setIsSubmitting(false)
        setResult(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeft(exam.durationMinutes * 60);
        onStartExam(exam)
    }


    if (result) {
        // Hiển thị kết quả thi
        const isPassed = result.isPassed;
        const hasCriticalMistake = result.hasCriticalMistake;
        const currentResultAnswer: ExamSubmissionAnswerDto | undefined = result.userAnswers?.find((a: ExamSubmissionAnswerDto) => a.question?.id === questions[currentQuestionIndex]?.id);


        return (
            <Container className='max-w-[87%]'>
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
                                        <Box display="flex" alignItems="center" mb={4}>
                                            <Typography>Thời gian làm bài:&nbsp;</Typography>
                                            <Typography fontWeight={600}>{formatResultDuration(result.duration)}</Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" mb={4}>
                                            <Typography>Tổng câu đúng:&nbsp;</Typography>
                                            <Typography fontWeight={600}>{result.correctAnswerCount}/{result.totalQuestions}</Typography>
                                        </Box>
                                        {hasCriticalMistake && (
                                            <Box mt={2}>
                                                <Typography component="span" fontWeight={600}>Lưu ý: </Typography>
                                                <Typography component="span" fontWeight={600} color="red">Bạn đã trả lời sai câu liệt.</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Button variant="contained" fullWidth sx={{ mt: 3, background: '#8B5CF6', color: '#fff', fontWeight: 700, fontSize: 15, py: 1.5, boxShadow: 'none', ':hover': { background: '#7C3AED' } }} onClick={handleResartExam}>
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
                                            const userAnswer: ExamSubmissionAnswerDto | undefined = result.userAnswers?.find((a: ExamSubmissionAnswerDto) => a.question?.id === q.id);
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
                                    {questions[currentQuestionIndex]?.imageUrl && <QuestionImage src={questions[currentQuestionIndex]?.imageUrl} alt={`Question ${currentQuestionIndex + 1}`} />}
                                    <Divider sx={{ mb: 4 }} />
                                    <div>
                                        {(currentResultAnswer?.question?.answers || questions[currentQuestionIndex]?.answers)?.map(ans => {
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
                                                <Box key={answer.id} sx={{
                                                    background: bg,
                                                    color,
                                                    border,
                                                    borderRadius: '8px',
                                                    p: '12px 16px',
                                                    mb: '8px',
                                                    fontWeight: isCorrect ? 600 : 400
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
                                        onClick={handleResartExam}
                                    >
                                        THI LẠI
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box mt={4} display="flex" justifyContent="center">
                        <Button variant="text" onClick={onBack}>Quay lại danh sách đề</Button>
                    </Box>
                </Box>
            </Container>
        );
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
