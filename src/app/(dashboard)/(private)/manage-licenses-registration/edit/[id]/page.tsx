import LicenseRegistrationForm from '@/views/manage-licenses-registrations/LicenseRegistrationForm'
import React from 'react'


const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)

    return <LicenseRegistrationForm screenType={'UPDATE'} id={id} />
}

export default Page
