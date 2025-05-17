import axiosInstance from '../axios'

const getUserInfo = async () => {
  return await axiosInstance.get('/api/users', {})
}

const UserAPI = {
  getUserInfo
}

export default UserAPI
