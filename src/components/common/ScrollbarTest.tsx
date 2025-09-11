'use client'

import React from 'react'
import { useScrollbarHover } from '@/hooks/useCustomScrollbar'

const ScrollbarTest = () => {
    const scrollbarRef = useScrollbarHover()

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Scrollbar Test Component</h2>
            <div
                ref={scrollbarRef}
                className="custom-scrollbar bg-gray-100 p-4 h-64 w-64 overflow-auto"
            >
                <div className="space-y-4">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="bg-white p-3 rounded shadow">
                            <h3 className="font-semibold">Item {i + 1}</h3>
                            <p className="text-sm text-gray-600">
                                This is a test item to create scrollable content.
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                <p>Hover vào vùng này để thấy scrollbar thumb xuất hiện với màu #a8a8a8</p>
                <p>Scrollbar sẽ tự động ẩn khi không hover</p>
            </div>
        </div>
    )
}

export default ScrollbarTest
