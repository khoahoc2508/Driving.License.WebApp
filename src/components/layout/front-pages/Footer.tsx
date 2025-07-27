// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { frontLayoutClasses } from '@layouts/utils/layoutClasses'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const Footer = () => {
  return (
    <footer className={frontLayoutClasses.footer}>
      <div className='relative'>
        <img
          src='/images/front-pages/footer-bg.png'
          alt='footer bg'
          className='absolute inset-0 is-full bs-full object-cover -z-[1]'
        />
        <div className={classnames('plb-12 text-white', frontCommonStyles.layoutSpacing)}>
          <Grid container rowSpacing={10} columnSpacing={12}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <div className='flex flex-col items-start gap-6'>
                <Link href='/'>
                  <Logo color='var(--mui-palette-common-white)' />
                </Link>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  Giải pháp số hóa việc thu hồ sơ GPLX ô tô & xe máy cho trung tâm đào tạo và cơ quan hành chính.
                </Typography>
                <Typography color='white' className='lg:max-is-[390px] opacity-[0.78]'>
                  Đơn giản – Chính xác – Tiết kiệm thời gian.
                </Typography>
                {/* <div className='flex gap-4'>
                  <TextField
                    size='small'
                    className={styles.inputBorder}
                    label='Subscribe to newsletter'
                    placeholder='Your email'
                    sx={{
                      ' & .MuiInputBase-root:hover:not(.Mui-focused) fieldset': {
                        borderColor: 'rgb(var(--mui-mainColorChannels-dark) / 0.6) !important'
                      },
                      '& .MuiInputBase-root.Mui-focused fieldset': {
                        borderColor: 'var(--mui-palette-primary-main)!important'
                      },
                      '& .MuiFormLabel-root.Mui-focused': {
                        color: 'var(--mui-palette-primary-main) !important'
                      }
                    }}
                  />
                  <Button variant='contained' color='primary'>
                    Subscribe
                  </Button>
                </div> */}
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Trang
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography color='white' className='opacity-[0.78]'>
                  Giới thiệu
                </Typography>
                <Typography color='white' className='opacity-[0.78]'>
                  Bảng giá
                </Typography>
                <Typography

                  color='white'
                  className='opacity-[0.78]'
                >
                  Câu hỏi thường gặp
                </Typography>
                <Typography color='white' className='opacity-[0.78]'>
                  Liên hệ
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Chức năng
              </Typography>
              <div className='flex flex-col gap-4'>
                <Typography color='white' className='opacity-[0.78]'>
                  Quản lý hồ sơ
                </Typography>
                <Typography color='white' className='opacity-[0.78]'>
                  Thống kê
                </Typography>
                <Typography color='white' className='opacity-[0.78]'>
                  Phân quyền
                </Typography>
                <Typography color='white' className='opacity-[0.78]'>
                  Tra cứu nhanh hồ sơ
                </Typography>
              </div>
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <Typography color='white' className='font-medium mbe-6 opacity-[0.92]'>
                Download our App
              </Typography>
              <div className='flex flex-col gap-4'>
                <Link className='bg-[#211B2C] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/apple-icon.png' alt='apple store' className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='opacity-[0.82]'>
                        Download on the
                      </Typography>
                      <Typography color='white' className='font-medium opacity-[0.92]'>
                        App Store
                      </Typography>
                    </div>
                  </div>
                </Link>
                <Link className='bg-[#211B2C] bs-[56px] is-[211px] rounded'>
                  <div className='flex items-center pli-5 plb-[7px] gap-6'>
                    <img src='/images/front-pages/google-play-icon.png' alt='Google play' className='bs-[34px]' />
                    <div className='flex flex-col items-start'>
                      <Typography variant='body2' color='white' className='opacity-[0.82]'>
                        Download on the
                      </Typography>
                      <Typography color='white' className='font-medium opacity-[0.92]'>
                        Google Play
                      </Typography>
                    </div>
                  </div>
                </Link>
              </div>
            </Grid> */}
          </Grid>
        </div>
      </div>
      <div className='bg-[#211B2C]'>
        <div
          className={classnames(
            'flex flex-wrap items-center justify-center sm:justify-between gap-4 plb-[15px]',
            frontCommonStyles.layoutSpacing
          )}
        >
          <Typography className='text-white opacity-[0.92]' variant='body2'>
            <span>{`© ${new Date().getFullYear()}, Bản quyền `}</span>
            <span>{`❤️`}</span>
            <span>{`  `}</span>
            banglaixanh.vn
          </Typography>
          {/* <div className='flex gap-6 items-center'>
            <IconButton component={Link} size='small' href='https://github.com/themeselection' target='_blank'>
              <i className='ri-github-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://www.facebook.com/ThemeSelections/' target='_blank'>
              <i className='ri-facebook-fill text-white text-lg' />
            </IconButton>
            <IconButton component={Link} size='small' href='https://twitter.com/Theme_Selection' target='_blank'>
              <i className='ri-twitter-fill text-white text-lg' />https://next-auth.js.org
            </IconButton>
            <IconButton
              component={Link}
              size='small'
              href='https://in.linkedin.com/company/themeselection'
              target='_blank'
            >
              <i className='ri-linkedin-fill text-white text-lg' />
            </IconButton>
          </div> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
