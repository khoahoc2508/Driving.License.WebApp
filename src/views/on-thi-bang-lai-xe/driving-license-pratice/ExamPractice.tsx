'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Button, Card, useTheme, CardContent, Grid, Typography, Container, Divider, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

import styles from './styles.module.css'
import type { questionTypes } from '@/types/questionTypes'
import type { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'
import type { AnswerSubmissionRequestDto } from '@/types/examSubmissionTypes'
import CONFIG from '@/configs/config'
import QuestionAPI from '@/libs/api/questionAPI'


const QuestionImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
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

const ButtonQuestionIndex = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const ExamPractice = ({
  exam,
  questions,
  selectedClass,
  selectedExamType,
  examSubmissionId
}: {
  exam: any,
  questions: questionTypes[],
  selectedClass: GroupExamDto | null,
  selectedExamType: GroupExamDto | null,
  examSubmissionId: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | undefined>(undefined);

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(exam.durationMinutes * 60)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerDetail, setAnswerDetail] = useState<any>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  // Xác định isPractice trực tiếp từ exam.type
  const isPractice = exam?.groupExamType === CONFIG.GroupExamType.Practice;

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

  useEffect(() => {
    setShowAnswer(false);
    setAnswerDetail(null);

    debugger

    if (leftColumnRef.current) {
      setLeftHeight(leftColumnRef.current.offsetHeight);
    }
  }, [currentQuestionIndex]);

  const handleShowAnswer = async () => {
    if (!currentQuestion?.id) return;
    setLoadingAnswer(true);

    try {
      const res = await QuestionAPI.getQuestionDetail(currentQuestion.id as string, exam.id);

      setAnswerDetail(res.data.data);
      setShowAnswer(true);
    } catch (e) {
      toast.error('Không thể tải đáp án.');
    } finally {
      setLoadingAnswer(false);
    }
  };


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

  // Thêm event listener cho phím mũi tên
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()

        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1)
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
        }
      }
    }



    // Thêm event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup event listener khi component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentQuestionIndex, questions.length])

  return (
    <Container className={styles.content} style={{ padding: 0, minHeight: "650px" }}>
      <Box sx={{ p: { xs: 0 } }}>
        <Typography variant="h4" gutterBottom align="center">
          {selectedClass?.name ? `${selectedClass.name.toUpperCase()} - ` : ''}{selectedExamType?.name?.toUpperCase()}
        </Typography>
        <Typography variant='h4' className='text-center my-8 flex items-center justify-center gap-2'>
          {exam.name.toUpperCase()}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Grid container spacing={2} ref={leftColumnRef}>
              {!isPractice && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Thời gian:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: timeLeft <= exam.durationMinutes * 60 * 0.05 ? 'error.main' : 'primary.main' }}>
                          <i className='ri-time-line' style={{ fontSize: '1.25rem', marginRight: '4px' }} />
                          <Typography variant='h6' component='span' sx={{ fontWeight: 'medium' }} className={timeLeft <= exam.durationMinutes * 60 * 0.05 ? 'text-error w-8' : 'text-primary w-8'}>
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
                        alignItems: 'center',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#f1f1f1',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#c1c1c1',
                          borderRadius: '4px',
                          '&:hover': {
                            background: '#a8a8a8',
                          },
                        },
                      }}
                      className="rounded-sm py-4 mt-5"
                    >
                      {questions.map((q, index) => (
                        <ButtonQuestionIndex
                          key={q.id || index}
                          variant={index === currentQuestionIndex ? 'contained' : 'outlined'}
                          color={(index === currentQuestionIndex || (q.id && answers[q.id])) ? 'primary' : 'inherit'}
                          onClick={() => setCurrentQuestionIndex(index)}
                          sx={{
                            minWidth: isMobile ? 50 : 57,
                            minHeight: 45,
                            padding: 0,
                            ...(isPractice ? {} : { position: 'relative' }),
                          }}
                        >
                          {index + 1}
                          {isPractice && q?.isCriticalQuestion && (
                            <Box component="span" sx={{ position: 'absolute', top: 1, right: 6, color: 'red' }}>*</Box>
                          )}
                        </ButtonQuestionIndex>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8} sx={{ minHeight: leftHeight }}>
            <Card sx={{ height: '100%' }} className='flex flex-col justify-start'>
              <CardContent sx={{ flexGrow: 1 }}>
                {leftHeight}
                <Typography variant="h5" className='text-[#98999e]'>Câu {currentQuestionIndex + 1}{isPractice && questions[currentQuestionIndex]?.isCriticalQuestion ? <span className='text-error'> *</span> : ''}</Typography>
                <Typography variant="h6" className='my-3' sx={{ fontWeight: 600 }}>{currentQuestion.content}</Typography>
                {currentQuestion.imageUrl && <QuestionImage src={process.env.NEXT_PUBLIC_STORAGE_BASE_URL + currentQuestion.imageUrl} alt={`Question ${currentQuestionIndex + 1}`} />}
                <Divider sx={{ mb: 4 }} />
                <div>
                  {showAnswer && answerDetail
                    ? answerDetail.answers?.map((ans: any) => {
                      const isCorrect = ans.isCorrect;
                      const isSelected = answers[currentQuestion.id as string] === ans.id;
                      let bg = 'transparent', color = 'inherit', border = '1px solid #e0e0e0';

                      if (isCorrect) {
                        bg = '#4caf50'; color = '#fff'; border = '1px solid #4caf50';
                      } else if (isSelected) {
                        color = '#f55156'; border = '1px solid #f55156';
                      }

                      
return (
                        <Box
                          key={ans.id}
                          sx={{
                            background: bg,
                            color,
                            border,
                            borderRadius: '8px',
                            p: '12px 16px',
                            mb: '8px',
                            fontWeight: isCorrect ? 600 : 400,
                            cursor: 'default',
                          }}
                        >
                          {`${ans.order}. ${ans.content}`}
                        </Box>
                      );
                    })
                    : currentQuestion.answers?.map(answer => (
                      <AnswerLabel
                        key={answer.id}
                        selected={!!(currentQuestion.id && answer.id && answers[currentQuestion.id] === answer.id)}
                        onClick={() => handleAnswerChange(currentQuestion.id, answer.id || '')}
                      >
                        {`${answer.order}. ${answer.content}`}
                      </AnswerLabel>
                    ))}
                </div>
                {showAnswer && answerDetail?.explanation && <Divider sx={{ mt: 4 }} />}
                {showAnswer && answerDetail?.explanation && (
                  <Box sx={{ mt: 4, p: 2, border: '1px solid #7c4dff', borderRadius: '8px', color: '#7c4dff' }}>
                    Giải thích: {answerDetail.explanation}
                  </Box>
                )}
              </CardContent>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingX: { xs: 2, md: 6 },
                  paddingY: 3,
                  gap: { xs: 2, md: 0 }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'row' },
                    gap: { xs: 15, md: 3 },
                    width: { xs: '100%', md: 'auto' },
                    marginTop: { xs: '10px', md: '0' }
                  }}
                >
                  <Button
                    variant="outlined"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    startIcon={<i className='ri-arrow-left-line' />}
                    sx={{
                      flex: { xs: 1, md: 'none' },
                      minWidth: { xs: 'auto', md: 'auto' }
                    }}
                  >
                    TRƯỚC
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={currentQuestionIndex === questions.length - 1}
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    endIcon={<i className='ri-arrow-right-line' />}
                    sx={{
                      flex: { xs: 1, md: 'none' },
                      minWidth: { xs: 'auto', md: 'auto' },
                    }}
                  >
                    SAU
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 1, md: 2 },
                    width: { xs: '100%', md: 'auto' },
                  }}
                >
                  {isPractice && (
                    <Button
                      variant="outlined"
                      onClick={handleShowAnswer}
                      disabled={loadingAnswer || !answers[currentQuestion.id as string] || showAnswer}
                      sx={{
                        flex: { xs: 1, md: 'none' },
                        minWidth: { xs: '100%', md: 'auto' },
                        margin: { xs: '10px 0', md: '0' }
                      }}
                    >
                      {loadingAnswer ? 'Đang tải...' : 'XEM ĐÁP ÁN'}
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenConfirmDialog}
                    disabled={isSubmitting}
                    sx={{
                      flex: { xs: 1, md: 'none' },
                      minWidth: { xs: 'auto', md: 'auto' },
                      marginTop: isPractice ? {} : { xs: '10px', md: '0' }
                    }}
                  >
                    {isPractice ? 'KẾT THÚC ÔN' : 'KẾT THÚC THI'}
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

      </Box>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{isPractice ? 'Kết thúc ôn tập?' : 'Kết thúc bài thi?'}</DialogTitle>
        <DialogContent>
          <Typography>
            {isPractice ? 'Bạn chắc chắn muốn kết thúc bài ôn tập?' : 'Bạn chắc chắn muốn kết thúc bài thi?'}
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
    </Container >
  )
}

export default ExamPractice
