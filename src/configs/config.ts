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
  ExamSchedule: '/admin/exam-schedules',
  BrandSetting: '/admin/account-settings',
  ManageTeacher: '/admin/manage-teacher',
  ManageCTV: '/admin/manage-collaborator',
  ManageEmployee: '/admin/manage-employee',
  ManageFeeType: '/admin/manage-fee-type',
  ManageRegistrationRecords: '/admin/manage-registration-records',
  ManageExamCenters: '/admin/manage-exam-centers',
  ManageExamYards: '/admin/manage-exam-yards',
  ManageCars: '/admin/manage-cars',
  ManageDATDevices: '/admin/manage-dat-devices'
}

const RoutersCustomer = {
  examPratice: '/on-thi-bang-lai-xe'
}

const statusOptions = [
  { label: 'Đang hoạt động', value: true },
  { label: 'Dừng hoạt động', value: false }
]

const paymentStatusOptions = [
  { label: 'Chưa thanh toán', value: 0 },
  { label: 'Thanh toán một phần', value: 1 },
  { label: 'Đã thanh toán', value: 2 },
  { label: 'Chưa thêm thanh toán', value: 3 }
]

const registrationStatusOptions = [
  { label: 'Chờ xử lý', value: 0 },
  { label: 'Đang xử lý', value: 1 },
  { label: 'Hoàn thành', value: 2 }
]

const AssigneeTypes = {
  Teacher: 1,
  Employee: 2,
  Collaborator: 3
}

const RegistrationRecordStatus = {
  Pending: 0,
  Processing: 1,
  Completed: 2
}

const UserPageConfigKey = {
  RegistrationRecords: 'collumn-view-setting'
}

const RegistrationRecordsTableColumns = {
  STT: 'STT',
  HANG: 'HANG',
  HO_SO: 'HO_SO',
  NGAY_SINH: 'NGAY_SINH',
  NGAY_NHAN_HS: 'NGAY_NHAN_HS',
  NGAY_KHAM_SK: 'NGAY_KHAM_SK',
  THANH_TOAN: 'THANH_TOAN',
  TONG: 'TONG',
  DA_NOP: 'DA_NOP',
  CON_THIEU: 'CON_THIEU',
  TRANG_THAI: 'TRANG_THAI',
  NGUOI_PHU_TRACH: 'NGUOI_PHU_TRACH',
  CTV: 'CTV',
  GHI_CHU: 'GHI_CHU',
  THAO_TAC: 'THAO_TAC'
}

const ExamResultStatusMappingText = {
  1: 'Đỗ',
  2: 'Trượt',
  3: 'Chưa thi'
}

const StepStatus = {
  Pending: 0,
  InProgress: 1,
  Completed: 2
}

const InputType = {
  Text: 0,
  Number: 1,
  DateTime: 2,
  DateOnly: 3,
  Time: 4,
  SingleSelect: 5,
  MultiSelect: 6,
  Radio: 7,
  Checkbox: 8,
  Textarea: 9,
  Password: 10
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
  paymentStatusOptions,
  registrationStatusOptions,
  AssigneeTypes,
  RegistrationRecordStatus,
  UserPageConfigKey,
  RegistrationRecordsTableColumns,
  ExamResultStatusMappingText,
  StepStatus,
  InputType
}

export default CONFIG
