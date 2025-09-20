import type { components } from '@/libs/api/client/schema'

// Types from schema
export type ConvertToNewAddressFromTextCommand = components['schemas']['ConvertToNewAddressFromTextCommand']

// Custom types for address conversion
export interface ConvertedFileResult {
  originalFileName: string
  convertedFileUrl: string
}

export interface ExcelConversionResponse {
  [key: string]: ConvertedFileResult
}

// Text conversion response types
export interface TextConversionResult {
  oldAddress: string
  newAddresses: string[]
  isWarning: boolean
  isError: boolean
  message: string
}

export type TextConversionResponse = TextConversionResult[]

// File handling types
export interface FileUploadItem {
  id: string
  name: string
  size: number
  type: string
  file?: File
}

export interface ProcessedFile {
  id: string
  name: string
  size: number
  type: string
  downloadUrl?: string
  status: 'processing' | 'completed' | 'error'
  errorMessage?: string
}
