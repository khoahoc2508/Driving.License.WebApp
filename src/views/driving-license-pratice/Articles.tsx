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
                  <Card variant='outlined' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent className='flex flex-col items-center justify-between gap-3 text-center' style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <i className={classNames(child.iconUrl, 'text-[26px]')} />
                      <Typography variant='h5'>{child.name}</Typography>
                      <Typography style={{ flex: 1 }}>{child.description}</Typography>
                      <div style={{ marginTop: 'auto' }}>
                        <Button variant='outlined'>Chi tiết</Button>
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
