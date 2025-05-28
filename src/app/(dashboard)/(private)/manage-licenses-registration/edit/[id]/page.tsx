import React from 'react'

import LicenseRegistrationForm from '@/views/manage-licenses-registrations/form'


const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)

    return <LicenseRegistrationForm screenType={'UPDATE'} id={id} />
}

export default Page
