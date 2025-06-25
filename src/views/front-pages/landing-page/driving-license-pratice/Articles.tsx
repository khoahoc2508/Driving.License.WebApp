import React, { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'

import { toast } from 'react-toastify'

import styles from './styles.module.css'
import GroupExamAPI from '@/libs/api/GroupExamAPI'
import type { GetGroupExamsParams, GroupExamDto } from '@/types/groupExamTypes'
import ExamAPI from '@/libs/api/examAPI'
import GroupSection from './GroupSection'
import ExamTypeSection from './ExamTypeSection'
import ExamListSection from './ExamListSection'
import ExamPractice from './ExamPractice'
import type { questionTypes as Question } from '@/types/questionTypes'
import QuestionAPI from '@/libs/api/questionAPI'
import ExamSubmissionAPI from '@/libs/api/examSubmissionAPI'

const Articles = () => {
  const [groups, setGroups] = useState<GroupExamDto[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<GetGroupExamsParams>({})
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
  const [examList, setExamList] = useState<any[] | null>(null)
  const [examLoading, setExamLoading] = useState(false)
  const [selectedExam, setSelectedExam] = useState<any | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[] | null>(null)
  const [selectedExamType, setSelectedExamType] = useState<GroupExamDto | null>(null)
  const [examSubmissionId, setExamSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    setParams({})
  }, [])

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true)

      try {
        const res = await GroupExamAPI.getGroupExams(params)

        setGroups(res.data.data || [])
      } catch (err: any) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleStartExam = async (exam: any) => {
    setExamLoading(true)

    try {
      const submissionRes = await ExamSubmissionAPI.startExam(exam.id)

      if (submissionRes.data.success && submissionRes.data.data?.examSubmissionId) {
        setExamSubmissionId(submissionRes.data.data.examSubmissionId)

        const questionsRes = await QuestionAPI.getExamQuestions(exam.id)

        setExamQuestions(questionsRes.data.data)
        setSelectedExam(exam)
      } else {
        toast.error('Không thể bắt đầu bài thi. Vui lòng thử lại.')
      }
    } catch (err) {
      toast.error('Không thể tải câu hỏi thi.')
    } finally {
      setExamLoading(false)
    }
  }

  if (loading || examLoading) {
    return <Typography className='text-center'>Đang tải...</Typography>
  }

  if (selectedExam && examQuestions && examSubmissionId) {
    return <ExamPractice
      exam={selectedExam}
      questions={examQuestions}
      onBack={() => {
        setSelectedExam(null)
        setExamQuestions(null)
        setExamSubmissionId(null)
      }}
      selectedClass={selectedClass}
      selectedExamType={selectedExamType}
      examSubmissionId={examSubmissionId}
      onStartExam={handleStartExam}
    />
  }

  if (examList) {
    return <ExamListSection selectedClass={selectedClass} examList={examList} onBack={() => setExamList(null)} onStartExam={handleStartExam} />
  }

  if (selectedClass) {
    return <ExamTypeSection selectedClass={selectedClass} onBack={() => setSelectedClass(null)} onSelectType={async (child) => {
      setSelectedExamType(child)

      if (child.name === 'THI THEO BỘ ĐỀ') {
        setExamLoading(true)

        try {
          const res = await ExamAPI.GetExamsByGroups(child.id)

          setExamList(res.data.data || [])
        } catch (err) {
          toast.error('Không thể tải danh sách đề thi.')
        } finally {
          setExamLoading(false)
        }
      }
    }} />
  }

  return (
    <div className='bg-backgroundPaper'>
      <div className={styles.layoutSpacing}>
        {groups.map((group) => (
          <GroupSection key={group.id} group={group} onSelect={setSelectedClass} />
        ))}
      </div>
    </div>
  )
}

export default Articles
