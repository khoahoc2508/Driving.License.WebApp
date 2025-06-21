import { useEffect, useState } from 'react'
import React from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { toast } from 'react-toastify'

import classNames from 'classnames'

import styles from './styles.module.css'
import GroupExamAPI from '@/libs/api/GroupExamAPI'
import type { GetGroupExamsParams } from '@/types/groupExamTypes'
import ExamAPI from '@/libs/api/examAPI'

interface GroupExamDto {
  id: string
  name: string
  description?: string
  iconUrl?: string
  order?: number
  parentId?: string | null
  children?: GroupExamDto[]
}

// Card cho từng hạng, bộ đề, đề thi
const PracticeCard = ({ icon, title, description, buttonText, onButtonClick }: {
  icon: string,
  title: string,
  description?: string,
  buttonText: string,
  onButtonClick?: () => void
}) => (
  <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <i className={classNames(icon, 'text-[26px]')} />
      <Typography variant='h5'>{title}</Typography>
      <Typography style={{ flex: 1 }}>{description}</Typography>
      <div style={{ marginTop: 'auto' }}>
        <Button variant='outlined' onClick={onButtonClick}>{buttonText}</Button>
      </div>
    </CardContent>
  </Card>
)

// Section hiển thị danh sách các hạng trong từng loại xe
const GroupSection = ({ group, onSelect }: { group: GroupExamDto, onSelect: (child: GroupExamDto) => void }) => (
  <section key={group.id} className={`mb-10 pb-10`}>
    <Typography variant='h4' className='text-center mbe-6 flex items-center justify-center gap-2'>
      {group.name}
    </Typography>
    <Grid container spacing={6} justifyContent='center'>
      {group.children?.map(child => (
        <Grid item xs={12} md={6} lg={4} key={child.id}>
          <PracticeCard
            icon={child.iconUrl || ''}
            title={child.name}
            description={child.description}
            buttonText='Chi tiết'
            onButtonClick={() => onSelect(child)}
          />
        </Grid>
      ))}
    </Grid>
  </section>
)

// Section hiển thị các loại bộ đề/ngẫu nhiên khi chọn hạng
const ExamTypeSection = ({ selectedClass, onBack, onSelectType }: {
  selectedClass: GroupExamDto,
  onBack: () => void,
  onSelectType: (child: GroupExamDto) => void
}) => (
  <div className='bg-backgroundPaper py-10'>
    <div className={styles.layoutSpacing}>
      <Button variant='outlined' onClick={onBack} style={{ marginBottom: 32 }}>
        Quay lại
      </Button>
      <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
        {selectedClass.name}
      </Typography>
      <Grid container spacing={6} justifyContent='center'>
        {selectedClass.children?.map(child => (
          <Grid item xs={12} md={6} lg={4} key={child.id}>
            <PracticeCard
              icon={child.iconUrl || ''}
              title={child.name}
              description={child.description}
              buttonText={child.name === 'THI THEO BỘ ĐỀ' ? 'Chi tiết' : 'Bắt đầu thi'}
              onButtonClick={() => onSelectType(child)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  </div>
)

// Section hiển thị danh sách đề thi
const ExamListSection = ({ selectedClass, examList, onBack }: {
  selectedClass: GroupExamDto | null,
  examList: any[],
  onBack: () => void
}) => (
  <div className='bg-backgroundPaper py-10'>
    <div className={styles.layoutSpacing}>
      <Button variant='outlined' onClick={onBack} style={{ marginBottom: 32 }}>
        Quay lại
      </Button>
      <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
        {selectedClass?.name} - THI THEO BỘ ĐỀ
      </Typography>
      <Grid container spacing={6} justifyContent='center'>
        {examList.length === 0 && (
          <Typography className='text-center w-full'>Không có đề thi nào cho hạng này.</Typography>
        )}
        {examList.map((exam: any) => (
          <Grid item xs={12} md={6} lg={4} key={exam.id}>
            <PracticeCard
              icon='ri-file-list-2-line'
              title={exam.name || `Đề ${exam.id}`}
              description={exam.description || ''}
              buttonText='Bắt đầu thi'
            />
          </Grid>
        ))}
      </Grid>
    </div>
  </div>
)

const Articles = () => {
  const [groups, setGroups] = useState<GroupExamDto[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<GetGroupExamsParams>({})
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)
  const [examList, setExamList] = useState<any[] | null>(null)
  const [examLoading, setExamLoading] = useState(false)

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

  if (loading) {
    return <Typography className='text-center'>Đang tải...</Typography>
  }

  if (examList) {
    return <ExamListSection selectedClass={selectedClass} examList={examList} onBack={() => setExamList(null)} />
  }

  if (selectedClass) {
    return <ExamTypeSection selectedClass={selectedClass} onBack={() => setSelectedClass(null)} onSelectType={async (child) => {
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
