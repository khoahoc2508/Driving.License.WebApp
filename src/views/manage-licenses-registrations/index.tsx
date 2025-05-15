'use client'

import { useState } from 'react'
import data from '../react-table/data'
import Table from './Table'
import { Button } from '@mui/material'
import DebouncedInput from '@/components/common/DebouncedInput'

const ManageLicensesRegistrations = () => {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterLicense, setFilterLicense] = useState('')
    const filteredData = data.filter(item =>
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    )
    const onChangeSearch = (value: string) => {
        setSearch(value)
    }
    return <>
        <div className='flex justify-between items-center'>
            <DebouncedInput
                value={search}
                onChange={onChangeSearch}
                placeholder='Tìm kiếm'
            />

            <div className='flex gap-4 items-center'>
                <div className='flex gap-1 items-center'>
                    <i className="ri-filter-2-line text-3xl"></i>
                    <span>Lọc</span>
                </div>
                <Button variant="contained" color="primary" onClick={() => {/* Add your click handler here */ }} >
                    Thêm mới
                </Button>
            </div>
        </div>
        <Table data={filteredData} />
    </>
}
export default ManageLicensesRegistrations
