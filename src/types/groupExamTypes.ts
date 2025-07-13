export type GetGroupExamsParams = {
  pageNumber?: number
  pageSize?: number
}

export interface GroupExamDto {
  id: string
  name: string
  description?: string
  iconUrl?: string
  order?: number
  parentId?: string | null
  licenseTypeCode: string
  children?: GroupExamDto[]
  slug: string
  type: number
}
