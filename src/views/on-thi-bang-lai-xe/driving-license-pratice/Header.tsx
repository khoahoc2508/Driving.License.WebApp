// MUI Imports
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Styles imports
import styles from './styles.module.css'

const Header = () => {
  return (
    <section className={classnames('-mbs-[18%] sm:mbs-[-10%] lg:mbs-[-5%] md:mbs-[-8%]', styles.bgImage)}>
      <div
        className={classnames(
          'flex flex-col gap-4 items-center text-center pbs-[150px] lg:pbs-[180px] pbe-[40px] sm:pbe-[100px] pli-5'
        )}
      >
        <Typography variant='h4' color='primary.main'>
          ÔN THI GPLX
        </Typography>
      </div>
    </section>
  )
}

export default Header
