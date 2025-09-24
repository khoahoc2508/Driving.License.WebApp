import axiosInstance from '../axios'
import type {
  ConvertToNewAddressFromTextCommand,
  ExcelConversionResponse,
  TextConversionResponse
} from '@/types/addressConversionTypes'
import type {
  ProvinceDto,
  WardDto,
  OldProvinceDto,
  OldDistrictDto,
  OldWardDto,
  UpsertUserWardMappingCommand
} from '@/types/addressesTypes'

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
const convertAddressesFromText = async (oldAddresses: string[]): Promise<TextConversionResponse> => {
  const requestBody: ConvertToNewAddressFromTextCommand = {
    oldAddresses
  }

  try {
    const response = await axiosInstance.post('/api/addresses/convert-to-new-address-from-text', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json' // Changed to JSON to receive text results
    })

    return response.data.data
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
 * Download all converted files as a zip file
 * @param fileUrls - Array of file URLs to zip and download
 */
const downloadAllAsZip = async (fileUrls: string[]): Promise<void> => {
  try {
    const response = await axiosInstance.post('/api/files/download-zip', {
      fileUrls: fileUrls
    })

    // Extract file info from response
    const { fileUrl, fileName } = response.data.data

    // Construct full URL for download
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${process.env.NEXT_PUBLIC_API_URL}${fileUrl}`

    // Download the zip file using the full URL
    await downloadFileFromUrl(fullUrl, fileName)
  } catch (error) {
    console.error('Error downloading zip file:', error)
    throw error
  }
}

// ===== ADDRESS MANAGEMENT APIs =====

/**
 * Get all provinces (new administrative units)
 */
const getProvinces = async (): Promise<ProvinceDto[]> => {
  try {
    const response = await axiosInstance.get('/api/addresses/provinces/all')

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching provinces:', error)
    throw error
  }
}

/**
 * Get wards by province ID (new administrative units)
 */
const getWards = async (provinceId?: string): Promise<WardDto[]> => {
  try {
    const params = provinceId ? { ProvinceId: provinceId } : {}
    const response = await axiosInstance.get('/api/addresses/wards/all', { params })

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching wards:', error)
    throw error
  }
}

/**
 * Get all old provinces
 */
const getOldProvinces = async (): Promise<OldProvinceDto[]> => {
  try {
    const response = await axiosInstance.get('/api/addresses/old-provinces/all')

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching old provinces:', error)
    throw error
  }
}

/**
 * Get old districts by province ID
 */
const getOldDistricts = async (oldProvinceId: string): Promise<OldDistrictDto[]> => {
  try {
    const response = await axiosInstance.get('/api/addresses/old-districts/all', {
      params: {
        OldProvinceId: oldProvinceId
      }
    })

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching old districts:', error)
    throw error
  }
}

/**
 * Get old wards by district ID
 */
const getOldWards = async (oldDistrictId: string): Promise<OldWardDto[]> => {
  try {
    const response = await axiosInstance.get('/api/addresses/old-wards/all', {
      params: {
        OldDistrictId: oldDistrictId
      }
    })

    return response.data?.data || []
  } catch (error) {
    console.error('Error fetching old wards:', error)
    throw error
  }
}

/**
 * Upsert user ward mapping
 */
const upsertUserWardMapping = async (mapping: UpsertUserWardMappingCommand): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/addresses/user-ward-mapping/upsert', mapping)

    return response.data
  } catch (error) {
    console.error('Error upserting user ward mapping:', error)
    throw error
  }
}

const AddressConversionAPI = {
  // Address conversion functions
  convertAddressesFromExcel,
  convertAddressesFromText,
  downloadBlobAsFile,
  downloadFileFromUrl,
  processExcelFiles,
  downloadAllConvertedFiles,
  downloadConvertedFile,
  downloadAllAsZip,

  // Address management functions
  getProvinces,
  getWards,
  getOldProvinces,
  getOldDistricts,
  getOldWards,
  upsertUserWardMapping
}

export default AddressConversionAPI
