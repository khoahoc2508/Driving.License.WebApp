import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

import { toast } from 'react-toastify'

import classNames from 'classnames'

import styles from './styles.module.css'
import GroupExamAPI from '@/libs/api/GroupExamAPI'
import type { GetGroupExamsParams } from '@/types/groupExamTypes'
import Grid2 from '@mui/material/Grid2'
import ExamAPI from '@/libs/api/examAPI'
import type { GetExamsByGroupQueryResponse } from '@/types/examTypes'

interface GroupExamDto {
  id: string
  name: string
  description?: string
  iconUrl?: string
  order?: number
  parentId?: string | null
  children?: GroupExamDto[]
}

interface ExamDto {
  id: string
  name: string
  description?: string
  totalQuestions?: number
  passingScore?: number
  durationMinutes?: number
  examType?: number
  licenseTypeCode?: string
  groupExamId?: string
}

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
    return (
      <div className='bg-backgroundPaper py-10'>
        <div className={styles.layoutSpacing}>
          <Button variant='outlined' onClick={() => setExamList(null)} style={{ marginBottom: 32 }}>
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
                <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <i className={classNames('ri-file-list-2-line', 'text-[26px]')} />
                    <Typography variant='h5'>{exam.name || `Đề ${exam.id}`}</Typography>
                    <Typography style={{ flex: 1 }}>{exam.description || ''}</Typography>
                    <div style={{ marginTop: 'auto' }}>
                      <Button variant='outlined'>Bắt đầu thi</Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    )
  }

  if (selectedClass) {
    return (
      <div className='bg-backgroundPaper py-10'>
        <div className={styles.layoutSpacing}>
          <Button variant='outlined' onClick={() => setSelectedClass(null)} style={{ marginBottom: 32 }}>
            Quay lại
          </Button>
          <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2'>
            {selectedClass.name}
          </Typography>
          <Grid container spacing={6} justifyContent='center'>
            {selectedClass.children?.map(child => (
              <Grid item xs={12} md={6} lg={4} key={child.id}>
                <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <i className={classNames(child.iconUrl, 'text-[26px]')} />
                    <Typography variant='h5'>{child.name}</Typography>
                    <Typography style={{ flex: 1 }}>{child.description}</Typography>
                    <div style={{ marginTop: 'auto' }}>
                      <Button
                        variant='outlined'
                        onClick={async () => {
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
                        }}
                      >
                        {child.name === 'THI THEO BỘ ĐỀ' ? 'Chi tiết' : 'Bắt đầu thi'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-backgroundPaper'>
      <div className={styles.layoutSpacing}>
        {groups.map((group, idx) => (
          <section
            key={group.id}
            className={`mb-10 pb-10 ${idx === 0 ? 'pt-10' : ''}`}
          >
            <Typography variant='h4' className='text-center mbe-6 flex items-center justify-center gap-2'>
              {group.name}
            </Typography>
            <Grid container spacing={6} justifyContent='center'>
              {group.children?.map(child => (
                <Grid item xs={12} md={6} lg={4} key={child.id}>
                  <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <i className={classNames(child.iconUrl, 'text-[26px]')} />
                      <Typography variant='h5'>{child.name}</Typography>
                      <Typography style={{ flex: 1 }}>{child.description}</Typography>
                      <div style={{ marginTop: 'auto' }}>
                        <Button variant='outlined' onClick={() => setSelectedClass(child)}>Chi tiết</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Articles
