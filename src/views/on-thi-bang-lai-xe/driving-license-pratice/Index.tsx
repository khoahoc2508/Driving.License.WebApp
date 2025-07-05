'use client'

import { useState, useEffect, useMemo } from 'react'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import GroupExam from './GroupExam'
import ExamLayoutWrapper from './ExamLayoutWrapper'
import { GroupExamDto } from '@/types/groupExamTypes'

const breadcrumbNameMap: Record<string, string> = {
    'on-thi-bang-lai-xe': 'Ôn thi GPLX',
    'xe-may': 'Xe máy',
    'hang-a': 'Hạng A',
    'hang-b': 'Hạng B',
    'hang-c': 'Hạng C',
    'hang-d': 'Hạng D',
    'hang-e': 'Hạng E',
    'hang-f': 'Hạng F',
    'hang-g': 'Hạng G',
    'hang-h': 'Hạng H',
}

function getBreadcrumbs(pathname: string, searchParams: URLSearchParams, groups: GroupExamDto[]) {
    const pathParts = pathname.split('/').filter(Boolean)
    let href = ''
    const breadcrumbs = pathParts.map((part, idx) => {
        href += '/' + part
        return {
            label: breadcrumbNameMap[part] || part,
            href: idx === pathParts.length - 1 ? undefined : href,
        }
    })

    // Nếu có licenseTypeCode, tìm trong children của từng group
    const licenseType = searchParams.get('licenseType')
    if (licenseType) {
        let found = null
        for (const group of groups) {
            if (group.children && Array.isArray(group.children)) {
                found = group.children.find(child => child.licenseTypeCode === licenseType)
                if (found) break
            }
        }
        if (found) {
            breadcrumbs.push({
                label: found.name,
                href: undefined
            })
        }
    }
    return breadcrumbs
}

const DrivingLicensePractice = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [groups, setGroups] = useState<GroupExamDto[]>([])

    const breadcrumbs = useMemo(() => getBreadcrumbs(pathname, searchParams, groups), [pathname, searchParams, groups])

    useEffect(() => {
        const examSubmissionId = searchParams.get('examSubmissionId')

        if (examSubmissionId) {
            router.push(`/on-thi-bang-lai-xe?examSubmissionId=${examSubmissionId}`)
        }
    }, [searchParams, router])

    return (
        <ExamLayoutWrapper
            isLoading={isLoading}
            breadcrumbs={breadcrumbs}
        >
            <GroupExam setIsLoading={setIsLoading} onGroupsLoaded={setGroups} />
        </ExamLayoutWrapper>
    )
}

export default DrivingLicensePractice
