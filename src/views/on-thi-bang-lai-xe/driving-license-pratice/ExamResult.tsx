'use client'

import React, { useState, useEffect, useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, Card, CardContent, Grid, Typography, Container, Divider, useTheme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'

import styles from './styles.module.css'

import type { questionTypes } from '@/types/questionTypes'
import type { GroupExamDto } from '@/types/groupExamTypes'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'
import type { ExamSubmissionResultDto, ExamSubmissionAnswerDto } from '@/types/examSubmissionTypes'
import ExamLayoutWrapper from './ExamLayoutWrapper'
import CONFIG from '@/configs/config'
import { wrap } from 'module'

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

const ButtonQuestionIndex = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface ExamResultProps {
  examSubmissionId: string
}

const ExamResult = ({ examSubmissionId }: ExamResultProps) => {
  const router = useRouter()
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<ExamSubmissionResultDto | null>(null)
  const [questions, setQuestions] = useState<questionTypes[]>([])
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (leftColumnRef.current) {
      setLeftHeight(leftColumnRef.current.offsetHeight);
    }
  }, [currentQuestionIndex]);

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

  const handleRestartExam = () => {
    router.push('/on-thi-bang-lai-xe')
  }

  const isPassed = result?.isPassed;
  const hasCriticalMistake = result?.hasCriticalMistake;
  const currentResultAnswer: ExamSubmissionAnswerDto | undefined = result?.userAnswers?.find((a: ExamSubmissionAnswerDto) => a.question?.id === questions[currentQuestionIndex]?.id);
  const isPractice = result?.groupExamType === CONFIG.GroupExamType.Practice;

  return (
    <ExamLayoutWrapper isLoading={isLoading}>
      {
        isLoading ? <div className='h-screen'></div> : <Container className={styles.content} style={{ padding: 0 }}>
          <Box sx={{ p: { xs: 0 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4} >
                <Card ref={leftColumnRef}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="h5" fontWeight={500}>{isPractice ? 'Kết quả ôn' : 'Kết quả thi'}</Typography>
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
                      {/* Ẩn thời gian nếu là ôn luyện */}
                      {!isPractice && selectedClass?.type !== CONFIG.GroupExamType.Practice && <Box display="flex" alignItems="center" mb={4}>
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
                      {isPractice ? 'ÔN LẠI' : 'THI LẠI'}
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
                          <ButtonQuestionIndex
                            variant={index + 1 === currentQuestionIndex + 1 ? 'contained' : 'outlined'}
                            color={color}
                            key={q.id || index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            // sx={{ position: 'relative', minWidth: 57, minHeight: 45, padding: 0 }}
                            sx={{
                              minWidth: isMobile ? 50 : 57,
                              minHeight: 45,
                              padding: 0,
                              position: 'relative',
                            }}
                          >
                            {index + 1}
                            {isCritical && (
                              <Box component="span" sx={{ position: 'absolute', top: 1, right: 6, color: 'red' }}>*</Box>
                            )}
                          </ButtonQuestionIndex>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={8} sx={{ minHeight: leftHeight }}>
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
                    {currentResultAnswer?.question?.explanation && <Divider sx={{ mt: 4 }} />}
                    {currentResultAnswer?.question?.explanation && (
                      <Box sx={{ mt: 4, p: 2, border: '1px solid #7c4dff', borderRadius: '8px', color: '#7c4dff' }}>
                        Giải thích: {currentResultAnswer?.question?.explanation}
                      </Box>
                    )}
                  </CardContent>
                  <Divider />
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingX: { xs: 2, md: 6 },
                    paddingY: 3,
                    gap: { xs: 2, md: 0 }
                  }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'row' },
                      gap: { xs: 15, md: 3 },
                      width: { xs: '100%', md: 'auto' }
                    }}>
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
                          minWidth: { xs: 'auto', md: 'auto' }
                        }}
                      >
                        SAU
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleRestartExam}
                      sx={{
                        minWidth: { xs: '100%', md: 'auto' },
                        marginTop: { xs: '10px', md: '0' }
                      }}
                    >
                      {isPractice ? 'ÔN LẠI' : 'THI LẠI'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      }
    </ExamLayoutWrapper>

  )
}

export default ExamResult
