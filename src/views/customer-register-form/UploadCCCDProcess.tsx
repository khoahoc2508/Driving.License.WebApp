import { LicenseRegistrationCustomerResquest } from '@/types/LicensesRegistrations'
import React, { useState } from 'react'

import { useFormContext } from 'react-hook-form'



interface Props {
    setFrontCard: (value: File | null) => void
    frontCard: File | null
    // setFrontCardUrl: (value: string | null | undefined) => void
    // frontCardUrl: string | null | undefined
    setBackCard: (value: File | null) => void
    // setBackCardUrl: (value: string | null | undefined) => void
    // backCardUrl: string | null | undefined
    backCard: File | null
}

export default function UploadCCCDProcess() {
    return (
        <div>
            <h1>UploadCCCDProcess</h1>
        </div>
    )
}
