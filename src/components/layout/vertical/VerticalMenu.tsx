// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import CONFIG from '@/configs/config'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/admin' icon={<i className='ri-home-smile-line' />}>
          Home
        </MenuItem>
        <MenuItem href='/admin/about' icon={<i className='ri-information-line' />}>
          About
        </MenuItem>
        <MenuItem href='/admin/dashboard' icon={<i className="ri-bar-chart-line"></i>}>
          Dashboard
        </MenuItem>
        <MenuItem href={`${CONFIG.Routers.ExamSchedule}/list`} icon={<i className="ri-calendar-line"></i>}>
          Lịch thi
        </MenuItem>
        {/* Quản lý hồ sơ */}
        <SubMenu label={"Quản lý hồ sơ"} icon={<i className='ri-file-list-line' />}>
          <MenuItem href={`${CONFIG.Routers.ManageRegistrationRecords}/list`}>{"Danh sách hồ sơ"}</MenuItem>
        </SubMenu>

        <SubMenu label={"Cấu hình cá nhân"} icon={<i className='ri-settings-3-line' />}>
          <MenuItem href={`${CONFIG.Routers.BrandSetting}/brand-setting`}>{"Thương hiệu"}</MenuItem>
        </SubMenu>
        {/* Quản lý giáo viên */}
        <SubMenu label={"Quản lý giáo viên"} icon={<i className='ri-presentation-line' />}>
          <MenuItem href={`${CONFIG.Routers.ManageTeacher}/list`}>{"Danh sách giáo viên"}</MenuItem>
          <MenuItem href={`${CONFIG.Routers.ManageTeacher}/schedule`}>{"Lịch làm việc"}</MenuItem>
        </SubMenu>
        {/* Quản lý CTV */}
        <SubMenu label={"Quản lý CTV"} icon={<i className='ri-user-shared-2-line' />}>
          <MenuItem href={`${CONFIG.Routers.ManageCTV}/list`}>{"Danh sách CTV"}</MenuItem>
        </SubMenu>
        {/* Quản lý nhân viên */}
        <SubMenu label={"Quản lý nhân viên"} icon={<i className='ri-team-line' />}>
          <MenuItem href={`${CONFIG.Routers.ManageEmployee}/list`}>{"Danh sách nhân viên"}</MenuItem>
        </SubMenu>
        {/* Quản lý loại phí */}
        <SubMenu label={"Quản lý thanh toán"} icon={<i className='ri-money-cny-circle-line' />}>
          <MenuItem href={`${CONFIG.Routers.ManageFeeType}/list`}>{"Danh sách lệ phí"}</MenuItem>
        </SubMenu>


      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
