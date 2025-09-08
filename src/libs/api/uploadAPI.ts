import axiosInstance from '../axios'

const uploadFiles = async (files: File[]) => {
  const formData = new FormData()

  files.forEach(file => {
    formData.append('files', file)
  })

  try {
    const response = await axiosInstance.post(`/api/uploads/files`, formData, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  } catch (error) {
    throw error
  }
}

const UploadAPI = {
  uploadFiles
}

export default UploadAPI
