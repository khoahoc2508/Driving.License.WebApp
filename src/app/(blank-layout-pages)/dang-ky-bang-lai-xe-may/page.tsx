"use client"

import { Suspense } from 'react'

import CustomerRegisterForm from '@/views/customer-register-form'
import CONFIG from '@/configs/config'

const Page = () => {
    const Search = () => {
        return (
            <CustomerRegisterForm
                titlePage='Đăng ký thi GPLX xe máy'
                vehicleTypePage={CONFIG.VehicleTypeCode.Motorbike}
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

