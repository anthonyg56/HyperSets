"use client"

import { P } from "@/components/ui/typography"
import { CreateAPresetSchema } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UseFormReturn } from "react-hook-form"
import { Session } from '@supabase/supabase-js'
import { PUBLIIC_CDN_URL } from '@/lib/constants'



import { UploadViews } from './uploadImage'
import { useToast } from '@/components/ui/use-toast'
import { ImageOffIcon } from 'lucide-react'
import Image from 'next/image'
import { CancelSVG, LoadingSVG } from '@/components/misc/svgs'

type Props = {
  currentUploadView: UploadViews | null,
  form: UseFormReturn<CreateAPresetSchema>,
  updateSelected: (selected: UploadViews) => void,
}

export default function UploadAnImage({ form, currentUploadView,  updateSelected }: Props) {
  const supabase = createSupabaseClient()

  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

  const { toast } = useToast()

  const photoUrl = form.getValues('photoUrl')

  useEffect(() => {
    async function beforeUnload(e: any) {
      await removeFile()
      return ''
    }

    window.addEventListener('beforeunload', beforeUnload)

    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
      setUploading(false)
    }
  }, [])

  const onDrop = useCallback(async <T extends File>(acceptedFiles: T[]) => {
    setUploading(true)

    const { data: { session } } = await supabase.auth.getSession()

    if (session === null) {
      setUploading(false)
      toast({
        title: "You need to be signed in to upload an image",
        description: "Please sign in to upload an image",
      })
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      await uploadFile(file, session)
      setUploading(false)
      return
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open,  } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    disabled: uploading === true,
  })

  async function uploadFile(file: File, session: Session) {
    setUploading(true)

    if (session === null) {
      toast({
        title: "You need to be signed in to upload an image",
        description: "Please sign in to upload an image",
      })
      return
    }

    try {
      await supabase.storage
        .from('preset backgrounds')
        .upload(`${session.user.id}/${file.name}`, file, { upsert: true })
        .then(async ({ data, error }) => {
          if (error || !data) 
            throw new Error()

          form.setValue('photoUrl', `${PUBLIIC_CDN_URL}preset%20backgrounds/${data.path}`)
          updateSelected(UploadViews.Local)

          return data
        })
    } catch (error: any) {
      toast({
        title: "Uh oh!",
        description: "There was an error uploading your image, please try again later",
      })
    } finally {
      setUploading(false)
    }
  }

  async function removeFile(e?: any) {
    e.preventDefault()

    if (photoUrl === undefined) return

    setRemoving(true)
    const { data: { session } } = await supabase.auth.getSession()

    if (session === null) {
      toast({
        title: "You need to be signed in to remove an image",
        description: "Please sign in to remove an image",
      })
      return
    }

    const path = photoUrl.replace(`${PUBLIIC_CDN_URL}preset%20backgrounds/`, '')

    await supabase.storage
      .from('preset backgrounds')
      .remove([path])
      .then(({ data, error }) => {
        if (error || !data) 
          throw new Error()

        form.setValue('photoUrl', undefined)
        updateSelected(UploadViews.Local)
      })
      .catch((error: any) => {
        toast({
          title: "Uh oh!",
          description: "There was an error removing your image, please try again later",
        })
      })

    setRemoving(false)
  }

  if (currentUploadView !== UploadViews.Local) return null

  
  /* If there is no photoUrl, show the dropzone, else show the uploaded image */
  return photoUrl === undefined || photoUrl === null || photoUrl.includes('default_banners') ? (
    <div {...getRootProps({ className: cn(["h-[400px] flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"]),  })}>
      {uploading === false ? (
        <>
          <div className="flex flex-col items-center gap-1 text-center">
            <ImageOffIcon className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-2xl font-bold tracking-tight">
              Image not uploaded
            </h3>
            <p className="text-sm text-muted-foreground">
              You can upload an image by dragging and dropping it here, or by clicking in the selected area.
            </p>
            <input {...getInputProps({
              placeholder: "Your avatar",
              type: "file",
              ringPrimary: true
            })} />
          </div>
        </>
      ) : uploading === true ? (
        <div className='flex flex-col justify-center items-center'>
          <LoadingSVG className="animate-spin w-12 h-12" />
          <P>Uploading image</P>
        </div>
      ) : removing && (
        <div className='flex flex-col justify-center items-center'>
          <LoadingSVG className="animate-spin w-12 h-12" />
          <P>Removing image</P>
        </div>
      )}
    </div>
  ) : (
    <div className="h-[400px] flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm relative">
      <CancelSVG className="fill-primary absolute -top-2 -right-2 w-6 h-6 hover:cursor-pointer" onClick={(e: any) => removeFile(e)} />
      <Image
        src={photoUrl}
        alt={`Yotutube Video Thumbnail failed to load`}
        sizes="100vw"
        width={0}
        height={0}
        quality={100}
        className={cn([
          "h-full w-full object-cover object-center -z-10 rounded-md",
        ])}
      />
      <div className='w-full h-full absolute left-0 top-0 -z-20 flex flex-col items-center justify-center'>
        <LoadingSVG className="animate-spin w-12 h-12" />
        <P>Loading image</P>
      </div>
    </div>
  )
}

// type Props = {
//   form: UseFormReturn<SignupSchema>
// }

// export default function ImagesInfo({ form }: Props) {
//   const [avatar, setAvatar] = useState<File | null>(null)
//   const [banner, setBanner] = useState<File | null>(null)

//   const [crop, setCrop] = useState<Crop>({
//     unit: '%',
//     width: 30,
//     height: 30,
//     x: 10,
//     y: 10,
//   })

//   const loading = form.formState.isSubmitting

//   async function updateView(e: any) {
//     e.preventDefault()
//   }

//   function AvatarCropPhoto() {
//     if (avatar === null) return null
//     const src = URL.createObjectURL(avatar)
//     return (
//       <ReactCrop crop={crop} onChange={(crop, percentageCrop) => setCrop(percentageCrop)} circularCrop >
//         <img src={src} />
//       </ReactCrop>
//     )
//   }

//   function BannerCropPhoto() {
//     if (banner === null) return null
//     const src = URL.createObjectURL(banner)
//     return (
//       <ReactCrop crop={crop} onChange={(crop, percentageCrop) => setCrop(percentageCrop)} circularCrop >
//         <img src={src} />
//       </ReactCrop>
//     )
//   }

//   const onDrop = useCallback(<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => {

//   }, [])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: {
//       'image/*': ['.jpg', '.jpeg', '.png']
//     },
//     onDrop
//   })

//   return (
//     <div className="space-y-4">
//       <DropZone form={form} type="avatar" setAvatar={setAvatar} />
//     </div>
//   )
// }

// return new Promise((resolve, reject) => {
//   const upload = new tus.Upload(file, {
//     endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
//     retryDelays: [0, 3000, 5000, 10000, 20000],
//     headers: {
//       authorization: `Bearer ${session.access_token}`,
//       'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
//     },
//     uploadDataDuringCreation: true,
//     removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
//     metadata: {
//       bucketName: bucketName,
//       objectName: fileName,
//       contentType: 'image/png',
//       cacheControl: '3600',

//     },
//     chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
//     onError: function (error) {
//       
//       toast({
//         title: "Uh oh!",
//         description: "There was an error uploading your image, please try again later",
//       })
//       reject(error)
//     },
//     onProgress: function (bytesUploaded, bytesTotal) {
//       const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
//       setUploadPercentage(Number(percentage))
//     },
//     onSuccess: function () {
//       toast({
//         title: "Image uploaded successfully",
//       })

//       upload.url

//       // form.setValue('photoUrl', upload.url ?? undefined)
//       resolve(null)
//     },
//   })

//   // Check if there are any previous uploads to continue.
//   return upload.findPreviousUploads().then(function (previousUploads) {
//     // Found previous uploads so we select the first one.
//     if (previousUploads.length) {
//       upload.resumeFromPreviousUpload(previousUploads[0])
//     }

//     // Start the upload
//     upload.start()
//   })
// })

