import type { Dispatch, SetStateAction } from 'react';
import React, { useEffect, useState } from 'react'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

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
import CONFIG from '@/configs/config';

interface ArticlesProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
  onGroupsLoaded?: (groups: GroupExamDto[]) => void
}

function findNodeAndAncestors(groups: GroupExamDto[], slug: string): GroupExamDto[] {
  for (const group of groups) {
    if (group.slug === slug) return [group];

    if (group.children) {
      const path = findNodeAndAncestors(group.children, slug);

      if (path.length) return [group, ...path];
    }
  }


  return [];
}

const GroupExams = ({ setIsLoading, onGroupsLoaded }: ArticlesProps) => {
  const [groups, setGroups] = useState<GroupExamDto[]>([])
  const [params, setParams] = useState<GetGroupExamsParams>({})
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
  const [examList, setExamList] = useState<any[] | null>(null)
  const [selectedExam, setSelectedExam] = useState<any | null>(null)
  const [examQuestions, setExamQuestions] = useState<Question[] | null>(null)
  const [selectedExamType, setSelectedExamType] = useState<GroupExamDto | null>(null)
  const [examSubmissionId, setExamSubmissionId] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Lấy param hiện tại
  const parentSlug = searchParams.get('parentSlug');
  const childSlug = searchParams.get('childSlug');
  const examSlug = searchParams.get('examSlug');
  const examname = searchParams.get('examname');

  // Đồng bộ state với param trên URL
  useEffect(() => {
    if (groups.length === 0) return;

    const slug = examname || examSlug || childSlug || parentSlug;
    const nodes = slug ? findNodeAndAncestors(groups, slug) : [];

    // Reset state trước khi set mới, nhưng KHÔNG reset examList nếu đang ở cấp examSlug
    setSelectedClass(null);
    setSelectedExamType(null);

    if (!examname) {
      setSelectedExam(null);
      setExamSubmissionId(null);
      setExamQuestions(null);
      setExamSubmissionId(null);
      if (nodes[1]) setSelectedClass(nodes[1]);
    } else {
      setExamList(null);
    }

    if (!examSlug) setExamList(null);

  }, [parentSlug, childSlug, examSlug, groups, examname]);

  useEffect(() => {
    setParams({})
  }, [])

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true)

      try {
        const res = await GroupExamAPI.getGroupExams(params)

        setGroups(res.data.data || [])
        if (onGroupsLoaded) onGroupsLoaded(res.data.data || [])
      } catch (err: any) {
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleStartExam = async (exam: any) => {
    setIsLoading(true);

    try {
      const submissionRes = await ExamSubmissionAPI.startExam(exam.id);

      if (submissionRes.data.success && submissionRes.data.data?.examSubmissionId) {
        setExamSubmissionId(submissionRes.data.data.examSubmissionId);

        const questionsRes = await QuestionAPI.getExamQuestions(exam.id);

        setExamQuestions(questionsRes.data.data);
        setSelectedExam(exam);

        // Thêm param examId vào URL
        const params = new URLSearchParams(searchParams.toString());

        params.set('examname', exam.name); // hoặc exam.slug nếu bạn muốn đẹp
        router.push(`${pathname}?${params.toString()}`);
      } else {
        toast.error('Không thể bắt đầu bài thi. Vui lòng thử lại.');
      }
    } catch (err) {
      toast.error('Không thể tải câu hỏi thi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectClass = (child: GroupExamDto) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!params.get('parentSlug')) {
      params.set('parentSlug', child.slug)
    } else if (!params.get('childSlug')) {
      params.set('childSlug', child.slug)
    } else {
      params.set('examSlug', child.slug)
    }

    router.push(`${pathname}?${params.toString()}`)
    setSelectedClass(child)
  }

  if (selectedExam && examQuestions && examSubmissionId) {
    return <div className='w-full bg-backgroundPaper'>
      <ExamPractice
        exam={selectedExam}
        questions={examQuestions}
        selectedClass={selectedClass}
        selectedExamType={selectedExamType}
        examSubmissionId={examSubmissionId}
      />
    </div>
  }

  if (examList) {
    return <ExamListSection selectedClass={selectedClass} examList={examList} onStartExam={handleStartExam} />
  }

  if (selectedClass) {
    return <ExamTypeSection selectedClass={selectedClass} onSelectType={async (child) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set('examSlug', child.slug);
      router.push(`${pathname}?${params.toString()}`);
      setSelectedExamType(child);

      if (child.type === CONFIG.GroupExamType.Detail) {
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


      if (child.type === CONFIG.GroupExamType.Exam) {
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

      if (child.type === CONFIG.GroupExamType.Practice) {
        setIsLoading(true)

        try {
          const res = await ExamAPI.GetExamsByGroups(child.id)
          const examDto = res.data.data[0]

          if (examDto) {
            handleStartExam(examDto)
          } else {
            toast.error('Không tìm thấy đề ôn luyện')
          }
        } catch (err) {
          toast.error('Không thể tải đề ôn luyện')
        } finally {
          setIsLoading(false)
        }
      }
    }} />
  }

  return (
    <div className='min-h-[100vh]'>
      {groups.map((group, index) => (
        <div className={`${index % 2 == 0 ? 'bg-backgroundPaper' : ''}`} key={group.id}>
          <GroupSection group={group} onSelect={handleSelectClass} />
        </div>
      ))}
    </div>
  )
}

export default GroupExams
