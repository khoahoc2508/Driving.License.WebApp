'use client'
import React from 'react'

import Header from './Header'
import AppLoading from '@/@core/components/AppLoading'

const ExamLayoutWrapper = ({
    isLoading,
    children,
}: {
    isLoading: boolean
    children: React.ReactNode
}) => (
    <>
        {isLoading && <AppLoading />}
        <Header />
        {children}
    </>
)

export default ExamLayoutWrapper
