import { stringify } from 'qs'

export const customParamsSerializer = (params: any) => {
  return stringify(params, { arrayFormat: 'repeat' })
}
