import axios from 'axios'

const uploadFiles = async (files: File[]) => {
  const formData = new FormData()

  files.forEach(file => {
    formData.append('files', file)
  })

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/uploads/files`, formData, {
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
