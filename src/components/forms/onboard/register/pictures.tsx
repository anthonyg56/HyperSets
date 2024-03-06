"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupSchema } from "@/lib/schemas"
import { useCallback, useState } from "react"
import { DropEvent, FileRejection, useDropzone } from "react-dropzone"
import { UseFormReturn } from "react-hook-form"
import ReactCrop, { type Crop } from 'react-image-crop'

type Props = {
  form: UseFormReturn<SignupSchema>
}

export default function ImagesInfo({ form }: Props) {
  const [avatar, setAvatar] = useState<File | null>(null)
  const [banner, setBanner] = useState<File | null>(null)

  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 30,
    height: 30,
    x: 10,
    y: 10,
  })

  const loading = form.formState.isSubmitting

  async function updateView(e: any) {
    e.preventDefault()
  }

  function AvatarCropPhoto() {
    if (avatar === null) return null
    const src = URL.createObjectURL(avatar)
    return (
      <ReactCrop crop={crop} onChange={(crop, percentageCrop) => setCrop(percentageCrop)} circularCrop >
        <img src={src} />
      </ReactCrop>
    )
  }

  function BannerCropPhoto() {
    if (banner === null) return null
    const src = URL.createObjectURL(banner)
    return (
      <ReactCrop crop={crop} onChange={(crop, percentageCrop) => setCrop(percentageCrop)} circularCrop >
        <img src={src} />
      </ReactCrop>
    )
  }

  const onDrop = useCallback(<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    onDrop
  })

  return (
    <div className="space-y-4">
      <DropZone form={form} type="avatar" setAvatar={setAvatar} />
    </div>
  )
}

type DropZoneProps = {
  type: 'avatar' | 'banner',
  form: UseFormReturn<SignupSchema>,
  setAvatar?: (file: File) => void,
  setBanner?: (file: File) => void,
}

function DropZone({ type, form, setAvatar, setBanner }: DropZoneProps) {
  const onDrop = useCallback(<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {
    if (type === 'avatar' && acceptedFiles.length > 0) {
      setAvatar?.(acceptedFiles[0])
      form.setValue('avatar', acceptedFiles[0])
    } else {
      setBanner?.(acceptedFiles[0])
      form.setValue('banner', acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,

  })

  const loading = form.formState.isSubmitting

  return (
          <div {...getRootProps()}>
            <input {...getInputProps({
              placeholder: "Your avatar",
              disabled: loading === true,
              type: "file",
              ringPrimary: true
            })} />
          </div>

  )
}