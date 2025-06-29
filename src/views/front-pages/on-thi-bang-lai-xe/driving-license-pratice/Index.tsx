'use client'

import { useState, useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import GroupExam from './GroupExam'
import ExamLayoutWrapper from './ExamLayoutWrapper'

const DrivingLicensePractice = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const examSubmissionId = searchParams.get('examSubmissionId')

        if (examSubmissionId) {
            router.push(`/front-pages/on-thi-bang-lai-xe?examSubmissionId=${examSubmissionId}`)
        }
    }, [searchParams, router])

    return (
        <ExamLayoutWrapper isLoading={isLoading}>
            <GroupExam setIsLoading={setIsLoading} />
        </ExamLayoutWrapper>
    )
}

export default DrivingLicensePractice
