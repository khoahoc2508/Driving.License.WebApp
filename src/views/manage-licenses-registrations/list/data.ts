import { LicenseRegistrationType } from "@/types/LicensesRegistrations"

const data: LicenseRegistrationType = [
  {
    id: "1",
    vehicleType: 0, // 0: xe máy, 1: ô tô
    licenseType: 0, // 0: A1, 1: A2, 2: B1, 3: B2
    hasCarLicense: false,
    hasCompletedHealthCheck: true,
    hasApproved: false,
    person: {
      id: "p1",
      avatarUrl: "/avatars/avatar1.png",
      fullName: "Nguyễn Quang Duy",
      phoneNumber: "0988 998 999",
      email: "duy.nguyen@example.com"
    },
    note: "Ghi chú test",
    isPaid: false,
    amount: 599000,
    isRetake: false,
    examScheduleId: null,
    passed: null,
    status: 0 // 0: Chưa duyệt, 1: Đã duyệt, 2: Đã thi, 3: Đã cấp bằng
  },
  {
    id: "3",
    vehicleType: 0, // 0: xe máy, 1: ô tô
    licenseType: 0, // 0: A1, 1: A2, 2: B1, 3: B2
    hasCarLicense: false,
    hasCompletedHealthCheck: true,
    hasApproved: false,
    person: {
      id: "p1",
      avatarUrl: "/avatars/avatar1.png",
      fullName: "Nguyễn Quang Duy 2",
      phoneNumber: "0988 998 999",
      email: "duy.nguyen@example.com"
    },
    note: "Ghi chú test",
    isPaid: false,
    amount: 599000,
    isRetake: false,
    examScheduleId: null,
    passed: null,
    status: 0 // 0: Chưa duyệt, 1: Đã duyệt, 2: Đã thi, 3: Đã cấp bằng
  }
]

export default data
