import axiosInstance from '../axios'

const postCitizenByFiles = async (formData: any) => {
  return await axiosInstance.post('/api/persons/recognition/citizen-by-files', formData)
}

const PersonAPI = {
  postCitizenByFiles
}

export default PersonAPI
