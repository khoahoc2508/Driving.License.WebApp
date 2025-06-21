import { useEffect, useState } from 'react'

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'

import { toast } from 'react-toastify'

import classNames from 'classnames'

import styles from './styles.module.css'
import GroupExamAPI from '@/libs/api/GroupExamAPI'
import type { GetGroupExamsParams } from '@/types/groupExamTypes'

interface GroupExamDto {
  id: string
  name: string
  description?: string
  iconUrl?: string
  order?: number
  parentId?: string | null
  children?: GroupExamDto[]
}

const Articles = () => {
  const [groups, setGroups] = useState<GroupExamDto[]>([])
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useState<GetGroupExamsParams>({})
  const [selectedClass, setSelectedClass] = useState<GroupExamDto | null>(null)

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

  if (loading) {
    return <Typography className='text-center'>Đang tải...</Typography>
  }

  if (selectedClass) {
    return (
      <div className='bg-backgroundPaper'>
        <div className={styles.layoutSpacing}>
          <Button variant='outlined' onClick={() => setSelectedClass(null)} style={{ marginBottom: 32 }}>
            Quay lại
          </Button>
          <Typography variant='h4' className='text-center mbe-8 flex items-center justify-center gap-2 font-bold'>
            {selectedClass.name}
          </Typography>
          <Grid container spacing={4} justifyContent='center' alignItems='center'>
            {selectedClass.children?.map(child => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={child.id}>
                <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <i className={classNames(child.iconUrl, 'text-[26px]')} />
                    <Typography variant='h5'>{child.name}</Typography>
                    <Typography style={{ flex: 1 }}>{child.description}</Typography>
                    <div style={{ marginTop: 'auto' }}>
                      <Button variant='outlined'>
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
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={child.id}>
                  <Card
                    variant='outlined'
                    style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                    onClick={() => setSelectedClass(child)}
                  >
                    <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <i className={classNames(child.iconUrl, 'text-[26px]')} />
                      <Typography variant='h5'>{child.name}</Typography>
                      <Typography style={{ flex: 1 }}>{child.description}</Typography>
                      <div style={{ marginTop: 'auto' }}>
                        <Button variant='outlined'>Chọn hạng</Button>
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
