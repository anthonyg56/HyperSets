"use client"

import * as tus from 'tus-js-client'

import { Muted } from "@/components/ui/typography"
import { CreateAPresetSchema } from "@/lib/schemas"
import { createSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UseFormReturn } from "react-hook-form"
import { useToast } from '../ui/use-toast'
import { Session } from '@supabase/supabase-js'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'

const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || ''

type Props = {
  form: UseFormReturn<CreateAPresetSchema>,
}

export default function DropZone({ form }: Props) {
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [uploading, setUploading] = useState(false)
  const supabase = createSupabaseClient()
  const { toast } = useToast()

  const loading = form.formState.isSubmitting
  const photoUrl = form.getValues('photoUrl')

  const onDrop = useCallback(async <T extends File>(acceptedFiles: T[]) => {
    setUploading(true)
    const { data: { session }} = await supabase.auth.getSession()

    if (session === null) {
      setUploading(false)
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      await uploadFile('avatars', `@${session.user.user_metadata.full_name}_avatar_${file.name}`, file, session)
      setUploading(false)
      return
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  })

  async function uploadFile(bucketName: string, fileName: string, file: File, session: Session) {
    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true', // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType: 'image/png',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
        onError: function (error) {
          
          toast({
            title: "Uh oh!",
            description: "There was an error uploading your image, please try again later",
          })
          reject(error)
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          setUploadPercentage(Number(percentage))
        },
        onSuccess: async function () {
          const { data, error } = await supabase
            .from('profile')
            .update({ avatar: upload.url })
            .eq('user_id', session?.user.id ?? '')

          if (error || data === null) {
            reject(error)
            return
          }

          toast({
            title: "Image uploaded successfully",
          })

          form.setValue('photoUrl', upload.url ?? undefined)
          resolve(null)
        },
      })

      // Check if there are any previous uploads to continue.
      return upload.findPreviousUploads().then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
      })
    })
  }


  return (
    <div>
      {photoUrl === undefined ? (
        <div {...getRootProps({
          className: cn([
            'border-2 border-dashed border-muted-foreground rounded-md p-4 text-center cursor-pointer transition-all duration-300 ease-in-out w-full h-[100px]',
            'flex items-center justify-center space-y-2',
            'hover:border-primary/50',
            isDragActive ? 'border-primary' : 'border-gray-300',
            loading === true && 'opacity-50',
          ])
        })}>
          <input {...getInputProps({
            placeholder: "Your avatar",
            disabled: loading === true,
            type: "file",
            ringPrimary: true
          })} />
          <Muted>Drag &rsquo;n&rsquo; drop some files here, or click to select files</Muted>
        </div>
      ) : (
        <Card>
          {uploadPercentage !== 100 ? (
            <div>
              <Progress value={uploadPercentage} />
            </div>
          ) : (
            <div>
              
            </div>
          )}
        </Card>
      )}
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

