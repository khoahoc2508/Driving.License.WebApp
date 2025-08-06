import { CreateContactCommand } from '@/types/contactTypes'
import axiosInstance from '../axios'

const CreateContact = async (data: CreateContactCommand) => {
  return await axiosInstance.post('/api/contacts', data)
}

const contactAPI = {
  CreateContact
}

export default contactAPI
