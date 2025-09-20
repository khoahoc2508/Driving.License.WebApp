import axiosInstance from '../axios'
import type { ConvertToNewAddressFromTextCommand, ExcelConversionResponse } from '@/types/addressConversionTypes'

/**
 * Convert addresses from Excel files to new administrative units
 * @param files - Array of Excel files to process
 * @returns Promise with JSON response containing file URLs
 */
const convertAddressesFromExcel = async (files: File[]): Promise<ExcelConversionResponse> => {
  const formData = new FormData()

  files.forEach(file => {
    formData.append('files', file)
  })

  try {
    const response = await axiosInstance.post('/api/addresses/convert-to-new-address/from-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'json' // Changed to JSON to receive file URLs
    })

    return response.data?.data
  } catch (error) {
    console.error('Error converting addresses from Excel:', error)
    throw error
  }
}

/**
 * Convert addresses from text input to new administrative units
 * @param oldAddresses - Array of old addresses to convert
 * @returns Promise with binary data (Excel file)
 */
const convertAddressesFromText = async (oldAddresses: string[]): Promise<Blob> => {
  const requestBody: ConvertToNewAddressFromTextCommand = {
    oldAddresses
  }

  try {
    const response = await axiosInstance.post('/api/addresses/convert-to-new-address-from-text', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob' // Important for binary data
    })

    return response.data
  } catch (error) {
    console.error('Error converting addresses from text:', error)
    throw error
  }
}

/**
 * Download blob as file
 * @param blob - Blob data to download
 * @param filename - Name for the downloaded file
 */
const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Download file from URL (using browser native download)
 * @param fileUrl - URL of the file to download
 * @param filename - Name for the downloaded file
 */
const downloadFileFromUrl = async (fileUrl: string, filename: string): Promise<void> => {
  try {
    // Create a temporary link element and trigger download
    const link = document.createElement('a')

    link.href = fileUrl
    link.download = filename
    link.style.display = 'none'

    // Append to body, click, then remove
    document.body.appendChild(link)
    link.click()

    // Remove after a short delay
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
  } catch (error) {
    console.error('Error downloading file from URL:', error)
    throw error
  }
}

/**
 * Process Excel files and return conversion results
 * @param files - Array of Excel files
 * @returns Promise with conversion results containing file URLs
 */
const processExcelFiles = async (files: File[]): Promise<ExcelConversionResponse> => {
  try {
    const response = await convertAddressesFromExcel(files)

    return response
  } catch (error) {
    console.error('Error processing Excel files:', error)

    throw error
  }
}

/**
 * Download all converted files from URLs
 * @param conversionResults - Results from Excel conversion
 */
const downloadAllConvertedFiles = async (conversionResults: ExcelConversionResponse): Promise<void> => {
  try {
    const downloadPromises = Object.entries(conversionResults).map(async ([, result]) => {
      const filename = result.originalFileName

      await downloadFileFromUrl(result.convertedFileUrl, filename)
    })

    await Promise.all(downloadPromises)
  } catch (error) {
    console.error('Error downloading converted files:', error)
    throw error
  }
}

/**
 * Download single converted file from URL
 * @param fileUrl - URL of the converted file
 * @param originalFileName - Original file name
 */
const downloadConvertedFile = async (fileUrl: string, originalFileName: string): Promise<void> => {
  try {
    await downloadFileFromUrl(fileUrl, originalFileName)
  } catch (error) {
    console.error('Error downloading converted file:', error)

    throw error
  }
}

/**
 * Process text addresses and download result
 * @param addresses - Array of addresses
 * @param outputFilename - Name for output file (optional)
 */
const processTextAddresses = async (addresses: string[], outputFilename?: string): Promise<void> => {
  try {
    const blob = await convertAddressesFromText(addresses)

    const filename = outputFilename || `converted_addresses_${new Date().getTime()}.xlsx`

    downloadBlobAsFile(blob, filename)
  } catch (error) {
    console.error('Error processing text addresses:', error)

    throw error
  }
}

const AddressConversionAPI = {
  convertAddressesFromExcel,
  convertAddressesFromText,
  downloadBlobAsFile,
  downloadFileFromUrl,
  processExcelFiles,
  downloadAllConvertedFiles,
  downloadConvertedFile,
  processTextAddresses
}

export default AddressConversionAPI
