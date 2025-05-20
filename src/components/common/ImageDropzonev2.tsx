import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button, Image } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'

type Props = {
    file: File | null
    setFile: (file: File | null) => void
    imageUrl?: string | null | undefined // Thêm thuộc tính imageUrl
    setImageUrl?: (url: string | null) => void
    isWarning: boolean
    description: ReactNode
    required?: boolean
    height?: string | number
    width?: string | number
    backgroundColor?: string
}

export default function ImageDropzone({
    file,
    setFile,
    imageUrl,
    setImageUrl,
    isWarning = true,
    description,
    required = false,
    height = '187px',
    width = '300px',
    backgroundColor = '#fff'
}: Props) {
    // const [files, setFiles] = useState<FileWithPath[]>([])
    // const [file, setFile] = useState<File | null>(null)
    const openRef = useRef<() => void>(null)
    const [visibleError, setVisibleError] = useState<boolean | null>(false)

    const removeFile = () => {
        setFile(null)
        setImageUrl && setImageUrl(null)
        if (required) {
            setVisibleError(true)
        }
    }

    useEffect(() => {
        if (file || imageUrl) setVisibleError(false)
    }, [file, imageUrl])

    const renderUploadUI = (children: any) => {
        return (
            <div
                className={`border-dashed border p-2 rounded ${visibleError ? 'border-[red]' : 'border-[#D9D9D9]'}`}
                style={{ height: height, width: width, backgroundColor: backgroundColor }}
            >
                {children}
            </div>
        )
    }

    if (!file && imageUrl) {
        // Hiển thị ảnh từ URL nếu có imageUrl
        return renderUploadUI(
            <div className='preview-container h-full w-full flex flex-col gap-2'>
                <div className='preview-img flex-1 h-0'>
                    <Image className='w-full h-full object-contain' src={imageUrl} />
                </div>
                <div className='preview-actions h-[36px] w-full flex justify-around gap-2'>
                    <Button className='w-[45%] border-[#2189E566]' variant='outline' onClick={() => openRef.current?.()}>
                        Thay đổi
                    </Button>
                    <Button variant='outline' className='w-[45%] border-[#FF2E5240]' color='red' onClick={removeFile}>
                        Xóa
                    </Button>
                </div>
            </div>
        )
    }

    if (file == null) {
        return renderUploadUI(
            <Dropzone
                openRef={openRef}
                className='h-full w-full'
                accept={IMAGE_MIME_TYPE}
                onDrop={(files: any) => {
                    setFile(files[0] || null)
                }}
                classNames={{ inner: 'w-full h-full flex flex-col justify-center items-center gap-[10%]' }}
                multiple={false}
            >
                <div className='w-[50%] h-[50%] border-dashed border rounded border-[#4E5973] flex justify-center items-center'>
                    {/* <IconUpload className='stroke-[#007BFF]' onClick={() => { }} /> */}
                </div>
                <div className='mr-auto ml-auto'>
                    {description}
                    {isWarning ? <span className='text-[red]'> (*)</span> : <></>}
                </div>
            </Dropzone>
        )
    }

    return renderUploadUI(
        <div className='preview-container h-full w-full flex flex-col gap-2'>
            <div className='preview-img flex-1 h-0'>
                <Image
                    className='w-full h-full object-contain'
                    // key={index}
                    src={URL.createObjectURL(file)}
                // onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
            </div>
            <div className='preview-actions h-[36px] w-full flex justify-around gap-2'>
                <Button className='w-[45%] border-[#2189E566]' variant='outline' onClick={() => openRef.current?.()}>
                    Thay đổi
                </Button>
                <Button variant='outline' className='w-[45%] border-[#FF2E5240]' color='red' onClick={removeFile}>
                    Xóa
                </Button>
            </div>
        </div>
    )
}
