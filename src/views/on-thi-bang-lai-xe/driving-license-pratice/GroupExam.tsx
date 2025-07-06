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

  // Đồng bộ state với param trên URL
  useEffect(() => {
    if (groups.length === 0) return;

    const slug = examSlug || childSlug || parentSlug;
    const nodes = slug ? findNodeAndAncestors(groups, slug) : [];

    // Reset state trước khi set mới, nhưng KHÔNG reset examList nếu đang ở cấp examSlug
    setSelectedClass(null);
    setSelectedExamType(null);
    setSelectedExam(null);
    setExamQuestions(null);
    setExamSubmissionId(null);

    if (!examSlug) setExamList(null);

    if (nodes.length > 0) {
      if (nodes[1]) setSelectedClass(nodes[1]);
      debugger
      // if (nodes[nodes.length - 1]?.name === 'THI THEO BỘ ĐỀ' && examSlug) {
      //   setIsLoading(true);
      //   ExamAPI.GetExamsByGroups(nodes[nodes.length - 1].id)
      //     .then(res => setExamList(res.data.data || []))
      //     .catch(() => toast.error('Không thể tải danh sách đề thi.'))
      //     .finally(() => setIsLoading(false));
      // }
      // ... các state khác
    }
  }, [parentSlug, childSlug, examSlug, groups]);

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
    /></div>
  }

  if (examList) {
    return <ExamListSection selectedClass={selectedClass} examList={examList} onBack={() => setExamList(null)} onStartExam={handleStartExam} />
  }

  if (selectedClass) {
    return <ExamTypeSection selectedClass={selectedClass} onBack={() => setSelectedClass(null)} onSelectType={async (child) => {
      // Lấy param hiện tại
      const params = new URLSearchParams(searchParams.toString());
      // Thêm examSlug cho loại đề
      params.set('examSlug', child.slug);
      router.push(`${pathname}?${params.toString()}`);

      setSelectedExamType(child);


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
        <div className={`${index % 2 == 0 ? 'bg-backgroundPaper' : ''}`} key={group.id}>
          <GroupSection group={group} onSelect={handleSelectClass} />
        </div>
      ))}
    </div>
  )
}

export default GroupExams
