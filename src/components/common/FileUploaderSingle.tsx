// React Imports
import { useEffect, useState, useRef, type ReactNode } from 'react'

// MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Slider from '@mui/material/Slider'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import type { ControllerRenderProps } from 'react-hook-form'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import type { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface FileUploaderSingleProps {
  field: ControllerRenderProps<any, any>; // Accept the field object from react-hook-form
  error?: boolean
  helperText?: string
  description?: ReactNode
  enableCrop?: boolean // Bật/tắt chức năng crop
  aspect?: number // Tỷ lệ crop (mặc định 1:1)
  quality?: number // Chất lượng ảnh sau crop (0-1)
  enableRotate?: boolean // Bật xoay ảnh khi crop
  defaultRotateDeg?: number // Góc xoay mặc định
}

const FileUploaderSingle = ({
  field,
  error,
  helperText,
  description = 'Drop files here or click to upload.',
  enableCrop = false,
  aspect = 1,
  quality = 0.8,
  enableRotate = true,
  defaultRotateDeg = 0
}: FileUploaderSingleProps) => {
  // States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropModalOpen, setCropModalOpen] = useState(false)
  const [fileToCrop, setFileToCrop] = useState<File | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [imgSrc, setImgSrc] = useState<string>('')
  const [rotateDeg, setRotateDeg] = useState<number>(defaultRotateDeg)

  // Refs
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (field.value && typeof field.value[0] === 'string') {
      setPreviewUrl(process.env.NEXT_PUBLIC_STORAGE_BASE_URL + field.value[0])
    } else if (field.value && field.value[0] instanceof File) {
      setPreviewUrl(URL.createObjectURL(field.value[0]))
    } else {
      setPreviewUrl(null)
    }
  }, [field.value])

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0]

      if (enableCrop) {
        // Nếu bật crop, mở modal crop
        setFileToCrop(newFile)
        setImgSrc(URL.createObjectURL(newFile))
        setCropModalOpen(true)
      } else {
        // Nếu không bật crop, xử lý như cũ
        field.onChange([newFile])
        setPreviewUrl(URL.createObjectURL(newFile))
      }
    }
  })

  // Hàm tạo crop mặc định
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    )

    setCrop(crop)
  }

  // Hàm crop ảnh
  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
    const canvas = canvasRef.current

    if (!canvas) {
      throw new Error('Canvas not found')
    }

    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context not found')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const pixelRatio = window.devicePixelRatio

    // Kích thước canvas bằng vùng crop (pixel), tính đến xoay
    const cropW = crop.width * scaleX
    const cropH = crop.height * scaleY
    const radians = (rotateDeg * Math.PI) / 180

    // Tính kích thước hộp bao sau xoay
    const rotatedW = Math.abs(cropW * Math.cos(radians)) + Math.abs(cropH * Math.sin(radians))
    const rotatedH = Math.abs(cropW * Math.sin(radians)) + Math.abs(cropH * Math.cos(radians))

    canvas.width = rotatedW * pixelRatio
    canvas.height = rotatedH * pixelRatio

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    // Di chuyển origin tới trung tâm canvas để xoay quanh tâm
    ctx.translate(rotatedW / 2, rotatedH / 2)
    ctx.rotate(radians)

    // Vẽ ảnh theo vùng crop, dịch để vùng crop nằm giữa canvas trước khi xoay
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      cropW,
      cropH,
      -cropW / 2,
      -cropH / 2,
      cropW,
      cropH
    )

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], fileToCrop?.name || 'cropped-image.jpg', {
              type: 'image/jpeg',
            })

            resolve(file)
          }
        },
        'image/jpeg',
        quality
      )
    })
  }

  // Hàm xử lý sau khi crop
  const handleCropComplete = async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedFile = await getCroppedImg(imgRef.current, completedCrop)

        field.onChange([croppedFile])
        setPreviewUrl(URL.createObjectURL(croppedFile))
        setCropModalOpen(false)
        setFileToCrop(null)
        setImgSrc('')
        setCrop(undefined)
        setCompletedCrop(undefined)
        setRotateDeg(defaultRotateDeg)
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  // Hàm hủy crop
  const handleCropCancel = () => {
    setCropModalOpen(false)
    setFileToCrop(null)
    setImgSrc('')
    setCrop(undefined)
    setCompletedCrop(undefined)
    setRotateDeg(defaultRotateDeg)
  }

  const displayImage = previewUrl != "" ? previewUrl : null

  return (
    <Box height={"100%"}>
      <Box
        {...getRootProps({
          className: 'dropzone',
          sx: {
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 3,
            cursor: 'pointer',
            height: '100%',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }
        })}
        {...(displayImage && {
          sx: {
            height: 260,
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'divider',
            borderRadius: 1,
            p: 3,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main'
            }
          }
        })}
      >
        <input {...getInputProps()} />
        {displayImage ? (
          <img
            src={`${displayImage}`}
            alt="Uploaded file"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
            className='single-file-image'
          />
        ) : (
          <div className='flex items-center flex-col h-full justify-center'>
            <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
              <i className='ri-upload-2-line' />
            </Avatar>
            <Typography variant='h5' className='mbe-2.5'>
              {description}
            </Typography>
            <Typography color='text.secondary'>
              Kéo thả file để upload
            </Typography>
          </div>
        )}
      </Box>
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}

      {/* Modal crop ảnh */}
      <Modal
        open={cropModalOpen}
        onClose={handleCropCancel}
        aria-labelledby="crop-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography id="crop-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
            Crop Ảnh
          </Typography>

          {imgSrc && (
            <Box sx={{ mb: 2 }}>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ maxWidth: '100%', maxHeight: '400px', transform: enableRotate ? `rotate(${rotateDeg}deg)` : undefined }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </Box>
          )}

          {enableRotate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant='body2' sx={{ minWidth: 70 }}>Xoay</Typography>
              <Slider
                value={rotateDeg}
                onChange={(_, v) => setRotateDeg(v as number)}
                min={-180}
                max={180}
                step={1}
                sx={{ flex: 1 }}
              />
              <Typography variant='body2' sx={{ minWidth: 36, textAlign: 'right' }}>{rotateDeg}°</Typography>
            </Box>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleCropCancel} variant="outlined" color='secondary'>
              Hủy
            </Button>
            <Button
              onClick={handleCropComplete}
              variant="contained"
              disabled={!completedCrop}
            >
              Xác nhận
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Canvas ẩn để crop ảnh */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </Box>
  )
}

export default FileUploaderSingle
