'use client'

import { useState, useMemo } from 'react'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import GroupExam from './GroupExam'
import ExamLayoutWrapper from './ExamLayoutWrapper'
import type { GroupExamDto } from '@/types/groupExamTypes'
import { toPascalCase } from '@/utils/string'

function findNodeAndAncestors(groups: GroupExamDto[], slug: string): GroupExamDto[] {
    for (const group of groups) {
        if (group.slug === slug) return [group];

        if (group.children) {
            const path = findNodeAndAncestors(group.children, slug);

            if (path.length) return [group, ...path];
        }
    }


    return [];
}

function getBreadcrumbsFromParams(searchParams: URLSearchParams, groups: GroupExamDto[]) {
    const breadcrumbs: { label: string; href?: string }[] = [{ label: 'Ôn Thi GPLX', href: '/on-thi-bang-lai-xe' }];
    const slug = searchParams.get('examSlug') || searchParams.get('childSlug') || searchParams.get('parentSlug');

    if (slug) {
        const nodes = findNodeAndAncestors(groups, slug);
        let href = '';

        if (nodes.length) {
            nodes.forEach((node, idx) => {
                let paramName = '';

                if (idx === 0) paramName = 'parentSlug';
                else if (idx === 1) paramName = 'childSlug';
                else if (idx === 2) paramName = 'examSlug';

                const label = toPascalCase(node.name);

                if (paramName) {
                    href += (href ? '&' : '?') + `${paramName}=${node.slug}`;
                    breadcrumbs.push({ label: label, href });
                } else {
                    breadcrumbs.push({ label: label });
                }
            });
        }
    }

    const examname = searchParams.get('examname');

    if (examname) {
        breadcrumbs.push({ label: toPascalCase(examname) });
    }


    return breadcrumbs;
}

const DrivingLicensePractice = () => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const [groups, setGroups] = useState<GroupExamDto[]>([])
    const searchParams = useSearchParams()

    const breadcrumbs = useMemo(() => {
        const parentSlug = searchParams.get('parentSlug');

        const isOnlyParentSlug =
            searchParams.size === 1 &&
            searchParams.has('parentSlug') &&
            (parentSlug === 'xe-may' || parentSlug === 'o-to');

        if (searchParams.size < 1 || isOnlyParentSlug) return [];

        if (groups.length === 0)
            return [{ label: 'Ôn Thi GPLX', href: '/on-thi-bang-lai-xe' }];

        return getBreadcrumbsFromParams(searchParams, groups);
    }, [searchParams, groups]);

    const handleBreadcrumbClick = (slugArr: string[]) => {
        const params = new URLSearchParams();

        if (slugArr[0]) params.set('parentSlug', slugArr[0]);
        if (slugArr[1]) params.set('childSlug', slugArr[1]);
        if (slugArr[2]) params.set('examSlug', slugArr[2]);
        if (slugArr[3]) params.set('examname', slugArr[3]);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <ExamLayoutWrapper
            isLoading={isLoading}
            breadcrumbs={breadcrumbs}
            onBreadcrumbClick={handleBreadcrumbClick}
        >
            <GroupExam setIsLoading={setIsLoading} onGroupsLoaded={setGroups} />
        </ExamLayoutWrapper>
    )
}

export default DrivingLicensePractice
