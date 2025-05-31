// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const ExamScheduleAddHeader = () => {
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          Thêm lịch thi
        </Typography>
        <Typography>Orders placed across your store</Typography>
      </div>
      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        <Button variant='outlined' color='secondary'>
          Hủy
        </Button>
        {/* <Button variant='outlined'>Save Draft</Button> */}
        <Button variant='contained'>Lưu</Button>
      </div>
    </div>
  )
}

export default ExamScheduleAddHeader
