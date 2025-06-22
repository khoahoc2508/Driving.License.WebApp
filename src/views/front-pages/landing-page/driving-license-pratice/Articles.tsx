import { useEffect, useState } from 'react'
import React from 'react'

import Typography from '@mui/material/Typography'

import { toast } from 'react-toastify'

import styles from './styles.module.css'
import GroupExamAPI from '@/libs/api/GroupExamAPI'
import type { GetGroupExamsParams } from '@/types/groupExamTypes'
import ExamAPI from '@/libs/api/examAPI'
import GroupSection from './GroupSection'
import ExamTypeSection from './ExamTypeSection'
import ExamListSection from './ExamListSection'
import { GroupExamDto } from '@/types/groupExamTypes'
import ExamPractice from './ExamPractice'
import { questionTypes as Question } from '@/types/questionTypes'
import QuestionAPI from '@/libs/api/questionAPI'

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
      const res = await QuestionAPI.getExamQuestions(exam.id)
      setExamQuestions(res.data.data)
      setSelectedExam(exam)
    } catch (err) {
      toast.error('Không thể tải câu hỏi thi.')
    } finally {
      setExamLoading(false)
    }
  }

  const handleShowExamList = async (groupExamId: string) => {
    try {
      setExamLoading(true)
      const res = await ExamAPI.GetExamsByGroups(groupExamId)
      if (res?.data?.data) {
        const fetchedData = res?.data?.data || []

        setExamList(fetchedData.data || [])

      }
    } catch (error: any) {
      toast.error(error?.message)
    } finally {
      setExamLoading(false)
    }
  }

  if (loading || examLoading) {
    return <Typography className='text-center'>Đang tải...</Typography>
  }

  if (selectedExam && examQuestions) {
    return <ExamPractice
      exam={selectedExam}
      questions={examQuestions}
      onBack={() => {
        setSelectedExam(null)
        setExamQuestions(null)
      }}
      selectedClass={selectedClass}
      selectedExamType={selectedExamType}
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
        {groups.map((group, idx) => (
          <GroupSection key={group.id} group={group} onSelect={setSelectedClass} />
        ))}
      </div>
    </div>
  )
}

export default Articles
