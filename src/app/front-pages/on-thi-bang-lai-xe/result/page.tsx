'use client'

import { useSearchParams } from 'next/navigation'

import ExamResult from '@/views/front-pages/on-thi-bang-lai-xe/driving-license-pratice/ExamResult'

const Page = () => {
    const searchParams = useSearchParams()
    const examSubmissionId = searchParams.get('examSubmissionId')

    if (!examSubmissionId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy kết quả thi</h1>
                    <p className="text-gray-600">Vui lòng kiểm tra lại URL hoặc quay lại trang chủ.</p>
                </div>
            </div>
        )
    }

    return (
        <ExamResult examSubmissionId={examSubmissionId} />
    )
}

export default Page
