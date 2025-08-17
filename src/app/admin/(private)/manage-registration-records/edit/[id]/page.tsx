import React from 'react'
import UpsertRegistrationRecord from '@/views/manage-registration-records/form'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)

    return <UpsertRegistrationRecord screenType={'UPDATE'} id={id} />
}

export default Page
