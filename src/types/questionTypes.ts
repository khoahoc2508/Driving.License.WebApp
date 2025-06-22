import { components } from '@/libs/api/client/schema'

export type GetAllLicenseTypesQueryResponse = components['schemas']['BaseResponseOfListOfQuestionDto']

export type questionTypes = components['schemas']['QuestionDto']
export type answerTypes = components['schemas']['AnswerDto'][]
