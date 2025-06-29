'use client'
import Header from './Header'
import AppLoading from '@/@core/components/AppLoading'
import React from 'react'

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
