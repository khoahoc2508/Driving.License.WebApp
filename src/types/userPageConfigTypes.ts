import type { components, operations } from '@/libs/api/client/schema'

export type UpsertUserPageConfigCommand = components['schemas']['UpsertUserPageConfigCommand']
export type ColumnConfigDto = components['schemas']['ColumnConfigDto']
export type GetColumnConfigQueryParams = operations['UserPageConfigs_GetConfig']['parameters']['path']
