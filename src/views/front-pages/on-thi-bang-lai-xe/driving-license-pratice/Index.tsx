'use client'

import { useState } from 'react'
import GroupExam from './GroupExam'
import Header from './Header'
import AppLoading from '@/@core/components/AppLoading'


const DrivingLicensePractice = () => {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <>
            {isLoading && <AppLoading />}
            <Header />
            <GroupExam setIsLoading={setIsLoading} />
        </>
    )
}

export default DrivingLicensePractice
