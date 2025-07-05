'use client'
import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from 'next/link'

import Header from './Header'
import AppLoading from '@/@core/components/AppLoading'

const ExamLayoutWrapper = ({
    isLoading,
    children,
    breadcrumbs = []
}: {
    isLoading: boolean
    children: React.ReactNode
    breadcrumbs?: { label: string; href?: string }[]
}) => (
    <>
        <div className='bg-white w-full'>
            {breadcrumbs.length > 0 && (
                <div style={{ background: '#f7f7f7', padding: '12px 20px', fontSize: 14, color: '#888', maxWidth: 1150, margin: '0 auto', borderRadius: '2px' }}>
                    <Breadcrumbs aria-label="breadcrumb">
                        {breadcrumbs.map((item, idx) =>
                            item.href ? (
                                <Link key={idx} href={item.href} style={{ color: '#888', textDecoration: 'none' }}>
                                    {item.label}
                                </Link>
                            ) : (
                                <span key={idx} style={{ color: '#222', fontWeight: 500 }}>{item.label}</span>
                            )
                        )}
                    </Breadcrumbs>
                </div>
            )}
        </div>
        {isLoading && <AppLoading />}
        {children}
    </>
)

export default ExamLayoutWrapper
