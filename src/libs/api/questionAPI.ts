import axiosInstance from '../axios'

const getExamQuestions = async (examId: string) => {
  return await axiosInstance.get(`/api/questions/by-exam/${examId}`)
}

const getQuestionDetail = async (questionId: string, examId?: string) => {
  return await axiosInstance.get('/api/questions/detail', {
    params: {
      QuestionId: questionId,
      ...(examId ? { ExamId: examId } : {})
    }
  })
}

const QuestionAPI = {
  getExamQuestions,
  getQuestionDetail
}

export default QuestionAPI
