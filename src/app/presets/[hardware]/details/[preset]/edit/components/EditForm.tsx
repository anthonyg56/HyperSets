"use client"
import { PresetFormData } from '@/app/presets/new/page'
import Dropdown, { TriggerType } from '@/components/reuseables/Dropdown'
import { faImage, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User, createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Tables, Database, Enums } from '../../../../../../../../types/supabase'
import Effects from '../../components/Effects'
import Toast from '@/components/reuseables/toast/Toast'
import { v4 as uuidv4 } from 'uuid'
import clsx from 'clsx'
import { validateDownloadURL, validateYoutubeURL } from '@/lib/utils/validate'

type InitialState = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'>;
  downloadUrl: string;
  effects: Enums<'effect_type'>[];
  coverPhotoUrl: string | null;
}

type Props = {
  preset: Tables<'presets'>
  hardware: string;
  effects: Enums<'effect_type'>[];
}

const CDNURL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/sign/images/"

export default function Form(props: Props) {
  const { effects, hardware, preset } = props
  const [formState, setState] = useState<InitialState>({
    name: '',
    description: '',
    youtubeUrl: '',
    hardware: 'Keyboard',
    downloadUrl: '',
    effects: [],
    coverPhotoUrl: ''
  })
  const [toastState, setToast] = useState({
    isOpen: false,
    description: ""
  })
  const [dummy, setDummy] = useState("")
  const [tmpCoverPhoto, setCoverPhoto] = useState<File | undefined>(undefined)
  
  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    function setData() {
      setState((prevState) => ({
        name: preset.name,
        description: preset.description,
        downloadUrl: preset.download_url,
        hardware: preset.hardware,
        youtubeUrl: preset.youtube_url ? preset.youtube_url : "",
        coverPhotoUrl: preset.photo_url,
        effects: effects
      }))
    }

    setData()
  }, [])
  
  // const handleSubmit = async (e: any) => {
  //   e.preventDefault()

  //   const isNotFilledOut = !formState.name ||
  //     !formState.description ||
  //     !formState.youtubeUrl ||
  //     !formState.hardware ||
  //     !formState.downloadUrl ||
  //     formState.effects.length < 1

  //   if (!user || isNotFilledOut) {
  //     setToast({
  //       isOpen: true,
  //       description: "Please fill out the required fields and try again"
  //     })
  //     return
  //   }

  //   let tmpState: {
  //     name: string;
  //     description: string;
  //     youtubeUrl: string;
  //     hardware: Enums<'hardware_type'>;
  //     downloadUrl: string;
  //     photoUrl?: string | undefined;
  //   } = formState

  //   if (tmpCoverPhoto) {
  //     const coverPhotoRes = await submitCoverPhoto(tmpCoverPhoto, user.id as string)

  //     if (coverPhotoRes.error && coverPhotoRes.data === null) {
  //       console.log(coverPhotoRes.error)
  //       setToast({
  //         isOpen: true,
  //         description: "There was an error, please try again"
  //       })
  //       return
  //     }

  //     tmpState.photoUrl = CDNURL + coverPhotoRes.data?.path
  //   }

  //   await submitPreset(tmpState, profileId)
  //     .then(async (res) => {
  //       if (res.data === null)
  //         return setToast({
  //           isOpen: true,
  //           description: "There was an error, please try again"
  //         })

  //       const resData = res.data
  //       const transformedData = formState.effects.map(item => ({ effect: item, preset_id: resData.preset_id }))
  //       const { data, error } = await submitEffects(transformedData)

  //       if (!data)
  //         return setToast({
  //           isOpen: true,
  //           description: "There was an error, please try again"
  //         })

  //       return router.push(`/presets/${resData.hardware}/details/${resData.preset_id}`)
  //     })
  //     .catch(error => {
  //       console.log(error)
  //       setToast({
  //         isOpen: true,
  //         description: "There was an error, please try again"
  //       })
  //       return
  //     })
  // }

  const handleUpdate = async (e: any) => {

  
  }

  const submitCoverPhoto = async (coverPhoto: File, user_id: string) => {
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`${user_id}/${uuidv4()}`, coverPhoto, {
        cacheControl: '3600',
        upsert: false
      })

    return { data, error }
  }

  const updateCoverPhoto = async (coverPhoto: File, user_id: string) => {

  }

  const updatePreset = async (formData: PresetFormData, profileId: number | undefined) => {
    const { data, error } = await supabase
      .from('presets')
      .update({
        name: formState.name,
        description: formState.description,
        download_url: formState.downloadUrl,
        hardware: formState.hardware as Enums<'hardware_type'>,
        profile_id: profileId as number,
        youtube_url: formState.youtubeUrl,
        photo_url: formState.coverPhotoUrl
      })
      .eq('some_column', 'someValue')
      .select()
  }

  const updateEffects = async () => {

  }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const uploadCoverPhoto = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setCoverPhoto(target)
  }

  const addEffect = (effect: Enums<'effect_type'>) => {
    let prevEffectState = formState.effects
    prevEffectState.push(effect)

    return setState((prevState) => ({
      ...prevState,
      effects: prevEffectState
    }))
  }

  const setHardware = (hardware: Enums<'hardware_type'>) => setState((prevState) => ({
    ...prevState,
    hardware: hardware
  }))

  const removeCoverPhoto = (e: any) => setCoverPhoto(undefined)

  const removeEffect = (effect: Enums<'effect_type'>) => {
    let prevEffectState = formState.effects
    const index = prevEffectState.indexOf(effect)

    if (index !== -1) prevEffectState.splice(index, 1)
    if (index === -1) return

    return setState((prevState) => ({
      ...prevState,
      effects: prevEffectState
    }))
  }

  const handleToast = (open: boolean) => setToast((prevState) => ({
    ...prevState,
    isOpen: open
  }))

  const hardwareDropdownItems: {
    label: Enums<'hardware_type'>,
    onClickFunc: () => void
  }[] = [
      {
        label: "Headset",
        onClickFunc: () => setHardware("Headset")
      },
      {
        label: "Keyboard",
        onClickFunc: () => setHardware("Keyboard")
      },
      {
        label: "Microphone",
        onClickFunc: () => setHardware("Microphone")
      },
      {
        label: "Mouse",
        onClickFunc: () => setHardware("Mouse")
      },
    ]

  const effectDropdownItems: {
    label: Enums<'effect_type'>,
    onClickFunc: () => void
  }[] = [
      {
        label: "Breathing",
        onClickFunc: () => addEffect('Breathing')
      },
      {
        label: "Confetti",
        onClickFunc: () => addEffect('Confetti')
      },
      {
        label: "Screen Mirror",
        onClickFunc: () => addEffect('Screen Mirror')
      },
      {
        label: "Solid",
        onClickFunc: () => addEffect('Solid')
      },
      {
        label: "Sun",
        onClickFunc: () => addEffect('Sun')
      },
      {
        label: "Swipe",
        onClickFunc: () => addEffect('Swipe')
      },
      {
        label: "Twilight",
        onClickFunc: () => addEffect('Twilight')
      },
      {
        label: "Video Capture",
        onClickFunc: () => addEffect('Video Capture')
      },
      {
        label: "Wave",
        onClickFunc: () => addEffect('Wave')
      }
    ]

  return (
    <form>
      <div>
        <div>
          <h4 className='label-text pb-1'>Cover Photo</h4>
        </div>

        <div className='flex flex-row gap-[20px] pb-[22px]'>
          {tmpCoverPhoto ? (
            <div className='min-w-[100px] max-w-[150px] h-[100px] opverflow-hidden rounded-[5px] relative'>
              <FontAwesomeIcon icon={faCircleXmark} className='absolute right-0 text-hyper-red translate-y-[-5px] translate-x-[5px]' onClick={removeCoverPhoto} />
              <img src={URL.createObjectURL(tmpCoverPhoto)} alt="cover-photo" className='object-cover object-center' />
            </div>
          
          ) : formState.coverPhotoUrl ? (
            <div className='min-w-[100px] max-w-[150px] h-[100px] opverflow-hidden rounded-[5px] relative'>
              <img src={formState.coverPhotoUrl} alt="cover-photo" className='object-cover object-center' />
            </div>
          ) : (
            <div className='min-w-[100px] h-[100px] bg-hyper-grey rounded-[5px] flex justify-center items-center'>
              <FontAwesomeIcon icon={faImage} className='w-[48px] h-[38px] text-hyper-dark-white' />
            </div>
          )}
          <div className=''>
            <p className='italic text-xs'>Please upload square image, size less than 100KB</p>
            <div className='bg-[#F8FCFF] mt-[10px] text-hyper-red font-medium rounded-lg py-2 px-3'>
              <label htmlFor="coverPhoto" className='border-[1px] border-hyper-red rounded-md px-5 py-[6px]'>
                {tmpCoverPhoto || formState.coverPhotoUrl !== null ? 'Change File' : 'Choose File'}
                <input
                  type="file"
                  id="coverPhoto"
                  name='coverPhoto'
                  value={dummy}
                  onChange={uploadCoverPhoto}
                  placeholder='My Awesome Preset'
                  className='hidden !w-[0.1] h-[0.1] opacity-0 absolute -z-10'
                />
              </label>

            </div>
          </div>
        </div>
      </div>

      <div className='input-container'>
        <label htmlFor="name" className='label-text'>Name*</label>
        <input
          type="text"
          name='name'
          value={formState.name}
          onChange={handleChange}
          placeholder='My Awesome Preset'
          className={clsx([
            preset.name !== formState.name && formState.name.length > 7 && 'active:border-hyper-green !border-hyper-green border-[1px]',
            preset.name !== formState.name && formState.name.length < 7 &&  formState.name.length > 0 &&  'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="description" className='label-text'>Description*</label>
        <textarea
          rows={5}
          name='description'
          value={formState.description}
          onChange={handleChange}
          placeholder='Description'
          className={clsx([
            preset.description !== formState.description && formState.description.length > 7 && 'active:border-hyper-green !border-hyper-green border-[1px]',
            preset.description !== formState.description && formState.description.length < 7 &&  formState.description.length > 0 &&  'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="youtubeUrl" className='label-text'>Youtube Link*</label>
        <input
          type="text"
          name='youtubeUrl'
          value={formState.youtubeUrl}
          onChange={handleChange}
          placeholder='Copy and paste the url here'
          className={clsx([
            preset.youtube_url !== formState.youtubeUrl && formState.youtubeUrl.length > 7 && validateYoutubeURL(formState.youtubeUrl) && 'active:border-hyper-green !border-hyper-green border-[1px]',
            preset.youtube_url !== formState.youtubeUrl && formState.youtubeUrl.length < 7 &&  formState.youtubeUrl.length > 0 && !validateYoutubeURL(formState.youtubeUrl) && 'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="downloadUrl" className='label-text'>Download Link*</label>
        <input
          type="text"
          name='downloadUrl'
          value={formState.downloadUrl}
          onChange={handleChange}
          placeholder='Dropbox, Mega, Google Drive...'
          className={clsx([
            preset.download_url !== formState.downloadUrl && formState.downloadUrl.length > 7 && 'active:border-hyper-green !border-hyper-green border-[1px]',
            preset.download_url !== formState.downloadUrl && formState.downloadUrl.length < 7 &&  formState.downloadUrl.length > 0 && validateDownloadURL(formState.downloadUrl) && 'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="" className='label-text'>Effects*:</label>
        <Dropdown
          items={effectDropdownItems}
          trigger={TriggerType.Text}
          triggerLable='Add an effect'
        />
        {formState.effects.length > 0 && <Effects
          removeEffect={removeEffect}
          effects={formState.effects}
          title={false}
        />}
      </div>
      
      <div className='input-container'>
        <label htmlFor="" className='label-text'>Hardware*:</label>
        <Dropdown
          items={hardwareDropdownItems}
          trigger={TriggerType.Text}
          triggerLable={formState.hardware ? formState.hardware : 'What hardware is this preset for?'}
        />
      </div>

      <button className='button-auto text-sm w-full mb-[50px]'>Update</button>

      <Toast 
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </form>
  )
}