import RegistrationRecordDetail from '@/views/manage-registration-records/detail'

const Page = ({ params }: { params: { id: string } }) => {
    const { id } = params

    return <RegistrationRecordDetail id={id} />
}

export default Page
