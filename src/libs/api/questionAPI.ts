import axiosInstance from '../axios'

const getExamQuestions = async (examId: string) => {
  return await axiosInstance.get(`/api/questions/by-exam/${examId}`)
}

const QuestionAPI = {
  getExamQuestions
}

export default QuestionAPI
