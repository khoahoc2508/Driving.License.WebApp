"use client"

import { Suspense } from 'react'

import { useSearchParams } from 'next/navigation'
import CustomerRegisterForm from '@/views/customer-register-form'
import CONFIG from '@/configs/config'

const Page = () => {
    const Search = () => {
        const searchParams = useSearchParams()
        const ownerId = searchParams.get('ownerid') as string

        return (
            <CustomerRegisterForm
                titlePage='Đăng ký bằng lái xe máy'
                vehicleTypePage={CONFIG.VehicleType.Motorbike}
                ownerId={ownerId}
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

