'use client'

// React Imports
import { useState } from 'react'

// Component Imports
import CustomPagination from './CustomPagination'

// Example usage of CustomPagination component
const CustomPaginationExample = () => {
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const totalItems = 150 // Example total items

    const handlePageChange = (page: number) => {
        setPageNumber(page)
        console.log('Page changed to:', page)
    }

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setPageNumber(1) // Reset to first page when page size changes
        console.log('Page size changed to:', newPageSize)
    }

    return (
        <div>
            <h3>Custom Pagination Example</h3>
            <p>Current Page: {pageNumber}</p>
            <p>Page Size: {pageSize}</p>
            <p>Total Items: {totalItems}</p>

            <CustomPagination
                totalItems={totalItems}
                pageSize={pageSize}
                pageNumber={pageNumber}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                showPageSizeSelector={true}
                showTotalItems={true}
            />
        </div>
    )
}

export default CustomPaginationExample

