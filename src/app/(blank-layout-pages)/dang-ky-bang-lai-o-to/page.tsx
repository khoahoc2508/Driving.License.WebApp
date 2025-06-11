"use client"

import { Suspense } from 'react'

import CustomerRegisterForm from '@/views/customer-register-form'
import CONFIG from '@/configs/config'

const Page = () => {
    const Search = () => {
        return (
            <CustomerRegisterForm
                titlePage='Đăng ký bằng lái ô tô'
                vehicleTypePage={CONFIG.VehicleTypeCode.Car}
            />
        )
    }

    return (
        <Suspense>
            <Search />
        </Suspense>
    )
}

export default Page

