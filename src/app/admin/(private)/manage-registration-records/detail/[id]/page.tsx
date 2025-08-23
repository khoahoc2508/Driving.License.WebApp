import React from 'react'

import RegistrationRecordDetail from '@/views/manage-registration-records/detail'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)

    
return <RegistrationRecordDetail id={id} />
}

export default Page
