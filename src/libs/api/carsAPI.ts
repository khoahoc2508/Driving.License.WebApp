import axiosInstance from '../axios'
import { customParamsSerializer } from './commonAPI'
import type { GetCarsQueryParams, CreateCarCommand, UpdateCarCommand } from '@/types/carTypes'

const GetCars = async (params: GetCarsQueryParams) => {
  return await axiosInstance.get('/api/cars', {
    params: {
      Search: params.search,
      Active: params.active,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize
    },
    paramsSerializer: customParamsSerializer
  })
}

const CreateCar = async (data: CreateCarCommand) => {
  return await axiosInstance.post('/api/cars', data)
}

const GetCarById = async (id: string) => {
  return await axiosInstance.get('/api/cars/' + id)
}

const UpdateCar = async (data: UpdateCarCommand) => {
  return await axiosInstance.put('/api/cars/' + data.id, data)
}

const DeleteCar = async (id: string) => {
  return await axiosInstance.delete('/api/cars/' + id)
}

const carsAPI = {
  GetCars,
  CreateCar,
  GetCarById,
  UpdateCar,
  DeleteCar
}

export default carsAPI
