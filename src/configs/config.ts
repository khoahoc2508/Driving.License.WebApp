const LicenseRegistrationStatus = {
  Pending: 0,
  Approved: 1,
  Failed: 2,
  Completed: 3
}

const LicenseRegistrationStatusMappingText = {
  0: 'Đang chờ duyệt',
  1: 'Đã duyệt',
  2: 'Thất bại',
  3: 'Thành công'
}

const PayerType = {
  Student: 0, // Học viên thanh toán
  Manager: 1 // Bạn (quản lý) thanh toán
}

const PayerTypeMappingText = {
  0: 'Học viên thanh toán',
  1: 'Bạn (quản lý) thanh toán'
}

const PaymentContext = {
  RegistrationFee: 0, // Phí đăng ký
  RetakeExamFee: 1, // Phí thi lại
  OrganizationFee: 2 // Phí nộp cho trung tâm
}

const PaymentContextMappingText = {
  0: 'Phí đăng ký',
  1: 'Phí thi lại',
  2: 'Phí nộp cho trung tâm'
}

const PaymentStatus = {
  Pending: 0,
  Completed: 1,
  Cancelled: 2
}

const PaymentStatusMappingText = {
  0: 'Đang chờ',
  1: 'Đã thanh toán',
  2: 'Đã hủy'
}

const SexType = {
  Female: 0,
  Male: 1,
  Other: 2
}

const SexTypeMappingText = {
  0: 'Nữ',
  1: 'Nam',
  2: 'Khác'
}

const SexTypeSelectOption = [
  {
    label: 'Nữ',
    value: 0
  },
  {
    label: 'Nam',
    value: 1
  },
  {
    label: 'Khác',
    value: 2
  }
]

const HasCarLicense = {
  yes: true,
  no: false
}

const HasCarLicenseMappingText = {
  true: 'Chưa có',
  false: 'Đã có'
}

const HasCarLicenseSelectOption = [
  {
    label: 'Đã có',
    value: true
  },
  {
    label: 'Chưa có',
    value: false
  }
]

const HasCompletedHealthCheck = {
  yes: true,
  no: false
}

const HasCompletedHealthCheckMappingText = {
  true: 'Đã khám',
  false: 'Chưa khám'
}

const ApprovedOption = [
  {
    label: 'Đã duyệt',
    value: true
  },
  {
    label: 'Chưa duyệt',
    value: false
  }
]

const HasCompletedHealthCheckSelectOption = [
  {
    label: 'Đã khám',
    value: true
  },
  {
    label: 'Chưa khám',
    value: false
  }
]

const IsPaid = {
  yes: true,
  no: false
}

const IsPaidMappingText = {
  true: 'Đã thanh toán',
  false: 'Chưa thanh toán'
}

const IsPaidSelectOption = [
  {
    label: 'Đã thanh toán',
    value: true
  },
  {
    label: 'Chưa thanh toán',
    value: false
  }
]

const IsRetake = {
  yes: true,
  no: false
}

const IsRetakeMappingText = {
  true: 'Thi lại',
  false: 'Thi mới'
}

const ConfigToken = {
  tokenType: 'Bearer',
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  expiresTime: 'expiresTime'
}

const Action = {
  Create: 'CREATE',
  Update: 'UPDATE',
  Delete: 'DELETE'
}

const LimitType = {
  Unlimited: 0,
  Limited: 1
}

const TableAction = {
  View: 'VIEW',
  Assign: 'ASSIGN'
}

const VehicleTypeCode = {
  Motorbike: 'motorbike',
  Car: 'car'
}

const GroupExamType = {
  Practice: 0, // Ôn luyện
  Exam: 1, // Thi thử
  Detail: 2 // Xem chi tiết
}

const Routers = {
  ManageLicensesRegistration: '/admin/manage-licenses-registration',
  ExamSchedule: '/admin/exam-schedules',
  BrandSetting: '/admin/account-settings',
  ManageTeacher: '/admin/manage-teacher',
  ManageCTV: '/admin/manage-collaborator',
  ManageEmployee: '/admin/manage-employee'
}

const RoutersCustomer = {
  examPratice: '/on-thi-bang-lai-xe'
}

const statusOptions = [
  { label: 'Đang hoạt động', value: true },
  { label: 'Dừng hoạt động', value: false }
]

const AssigneeTypes = {
  Teacher: 1,
  Employee: 2,
  Collaborator: 3
}

const CONFIG = {
  LicenseRegistrationStatus,
  LicenseRegistrationStatusMappingText,
  PayerType,
  PayerTypeMappingText,
  PaymentContext,
  PaymentContextMappingText,
  PaymentStatus,
  PaymentStatusMappingText,
  SexType,
  SexTypeMappingText,
  SexTypeSelectOption,
  HasCarLicense,
  HasCarLicenseMappingText,
  HasCarLicenseSelectOption,
  HasCompletedHealthCheck,
  HasCompletedHealthCheckMappingText,
  HasCompletedHealthCheckSelectOption,
  IsPaid,
  IsPaidMappingText,
  IsPaidSelectOption,
  IsRetake,
  IsRetakeMappingText,
  ConfigToken,
  ApprovedOption,
  Action,
  LimitType,
  TableAction,
  VehicleTypeCode,
  GroupExamType,
  Routers,
  RoutersCustomer,
  statusOptions,
  AssigneeTypes
}

export default CONFIG
