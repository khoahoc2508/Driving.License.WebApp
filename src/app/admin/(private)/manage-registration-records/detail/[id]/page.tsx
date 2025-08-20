import RegistrationRecordDetail from '@/views/manage-registration-records/detail'
import React from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    return <RegistrationRecordDetail id={id} />
}

export default Page
