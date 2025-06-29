import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react'


import { toast } from 'react-toastify'

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
import type { GenerateRandomExamsCommand } from '@/types/exam'

interface ArticlesProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const GroupExams = ({ setIsLoading }: ArticlesProps) => {
  const [groups, setGroups] = useState<GroupExamDto[]>([])
  const [params, setParams] = useState<GetGroupExamsParams>({})
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
  const [examList, setExamList] = useState<any[] | null>(null)
  const [selectedExam, setSelectedExam] = useState<any | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[] | null>(null)
  const [selectedExamType, setSelectedExamType] = useState<GroupExamDto | null>(null)
  const [examSubmissionId, setExamSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    setParams({})
  }, [])

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true)

      try {
        const res = await GroupExamAPI.getGroupExams(params)

        setGroups(res.data.data || [])
      } catch (err: any) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleStartExam = async (exam: any) => {
    setIsLoading(true)

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
      setIsLoading(false)
    }
  }

  if (selectedExam && examQuestions && examSubmissionId) {
    return <div className='w-full bg-backgroundPaper'><ExamPractice
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
    /></div>
  }

  if (examList) {
    return <ExamListSection selectedClass={selectedClass} examList={examList} onBack={() => setExamList(null)} onStartExam={handleStartExam} />
  }

  if (selectedClass) {
    return <ExamTypeSection selectedClass={selectedClass} onBack={() => setSelectedClass(null)} onSelectType={async (child) => {
      setSelectedExamType(child)

      if (child.name === 'THI THEO BỘ ĐỀ') {
        setIsLoading(true)

        try {
          const res = await ExamAPI.GetExamsByGroups(child.id)

          setExamList(res.data.data || [])
        } catch (err) {
          toast.error('Không thể tải danh sách đề thi.')
        } finally {
          setIsLoading(false)
        }
      }

      if (child.name === 'ĐỀ NGẪU NHIÊN') {
        setIsLoading(true)

        try {
          const payload: GenerateRandomExamsCommand = {
            groupExamId: child.id,
            licenseTypeCode: selectedClass.licenseTypeCode
          }

          const res = await ExamAPI.GenerateRandomExam(payload)
          const examDto = res.data.data

          if (examDto) {
            handleStartExam(examDto)
          } else {
            toast.error('Không tìm thấy đề thi ngẫu nhiên.')
          }
        } catch (err) {
          toast.error('Không thể tải đề thi ngẫu nhiên.')
        } finally {
          setIsLoading(false)
        }
      }
    }} />
  }

  return (
    <div className='min-h-[100vh]'>
      {groups.map((group, index) => (
        <div className={`${index % 2 == 0 ? 'bg-backgroundPaper' : ''}`} key={group.id} ><GroupSection group={group} onSelect={setSelectedClass} /></div>
      ))}
    </div>
  )
}

export default GroupExams
