"use client"

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
  coverPhotoUrl: string | null;
}

type InitalEffectsState = {
  current: Partial<Tables<'effects'>>[];
  added: Omit<Tables<'effects'>, 'effect_id'>[];
  removed: Tables<'effects'>[];
}

type Props = {
  preset: Tables<'presets'>
  hardware: string;
  effects: Tables<'effects'>[];
  userId: string;
}

const CDNURL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/sign/images/"

export default function Form(props: Props) {
  const { effects, preset, userId } = props
  const [formState, setState] = useState<InitialState>({
    name: '',
    description: '',
    youtubeUrl: '',
    hardware: 'Keyboard',
    downloadUrl: '',
    coverPhotoUrl: ''
  })
  const [effectsState, setEffects] = useState<InitalEffectsState>({
    current: [],
    added: [],
    removed: []
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
      setState({
        name: preset.name,
        description: preset.description,
        downloadUrl: preset.download_url,
        hardware: preset.hardware,
        youtubeUrl: preset.youtube_url ? preset.youtube_url : "",
        coverPhotoUrl: preset.photo_url,
      })

      setEffects((prevState) => ({
        ...prevState,
        current: effects
      }))
    }

    setData()
  }, [])

  const handleUpdate = async (e: any) => {
    let tmpData: Partial<Tables<'presets'>> = {}

    if (preset.name !== formState.name && formState.name.length > 7) { tmpData.name = formState.name }
    if (preset.description !== formState.description && formState.description.length > 7) { tmpData.description = formState.description }
    if (preset.youtube_url !== formState.youtubeUrl && validateYoutubeURL(formState.youtubeUrl)) { tmpData.youtube_url = formState.youtubeUrl }
    if (preset.download_url !== formState.downloadUrl && validateDownloadURL(formState.downloadUrl)) { tmpData.download_url = formState.downloadUrl }
    if (preset.hardware !== formState.hardware) { tmpData.hardware = formState.hardware}

    if (tmpCoverPhoto) {
      const { data: photo, error: photoError } = await supabase
        .storage
        .from('images')
        .upload(`${userId}/${uuidv4()}`, tmpCoverPhoto, {
          cacheControl: '3600',
          upsert: false
        })


      if (photoError && photo === null) {
        console.log(photoError)
        setToast({
          isOpen: true,
          description: "There was an error, please try again"
        })
        return
      }

      tmpData.photo_url = CDNURL + photo.path
    }

    const { data: presetData, error: presetError } = await supabase
      .from('presets')
      .update(tmpData)
      .eq('reset_id', preset.preset_id)
      .select()
      .limit(1)
      .single()
    
    if (!presetData || presetError) return setToast((prevState) => ({
      ...prevState,
      isOpen: true,
      description: "There was an error uploading your preset. Please try again"
    }))

    if (effectsState.added.length > 0) {
      const { data, error } = await supabase
        .from('effects')
        .insert(effectsState.added)

      
    }

    if (effectsState.removed.length > 0) {
      let values = effectsState.removed.map(({ effect_id }) => effect_id)
      const { error } = await supabase
        .from('effects')
        .delete()
        .in('effect_id', values)
    
    }

    router.push(`/presets/${presetData.hardware}/details/${presetData.preset_id}`)
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
    let tmpCurrent = effectsState.current
    let tmpAdded = effectsState.added
    let tmpRemoved = effectsState.removed

    const index = tmpRemoved.findIndex((item) => item.effect === effect)

    if (index !== -1) {
      tmpCurrent.push(tmpRemoved[index])
      tmpRemoved.splice(index, 1)
      
      setEffects((prevStae) => ({
        ...prevStae,
        current: tmpCurrent,
        removed: tmpRemoved
      }))

      return
    }

    tmpCurrent.push({
      effect: effect,
      preset_id: preset.preset_id
    })

    tmpAdded.push({
      effect: effect,
      preset_id: preset.preset_id
    })

    setEffects((prevState) => ({
      ...prevState,
      added: tmpAdded,
      current: tmpCurrent
    }))
  }

  const removeEffect = (effect: Enums<'effect_type'>) => {
    let tmpCurrent = effectsState.current
    let tmpAdded = effectsState.added
    let tmpRemoved = effectsState.removed

    // Check if theres an effect thats been recently added first before remove one from the database
    const addedIndex = tmpAdded.findIndex(({ effect: item }) => item === effect)

    if (addedIndex !== -1) {
      tmpAdded.splice(addedIndex, 1)

      // Grab index of the effect thats been most recently pushed by the user
      const currentIndex = tmpCurrent.findIndex(({ effect: item, effect_id }) => item === effect && !effect_id)
      tmpCurrent.splice(currentIndex, 1)

      setEffects((prevState) => ({
        ...prevState,
        current: tmpCurrent,
        added: tmpAdded,
      }))

      return
    } 

    const currentIndex = tmpCurrent.findIndex(({ effect: item, effect_id }) => item === effect && effect_id)
    
    tmpRemoved.push(tmpCurrent[currentIndex] as Tables<'effects'>)
    tmpCurrent.splice(currentIndex,1)

    setEffects((prevState) => ({
      ...prevState,
      current: tmpCurrent,
      removed: tmpRemoved,
    }))
  }

  const setHardware = (hardware: Enums<'hardware_type'>) => setState((prevState) => ({
    ...prevState,
    hardware: hardware
  }))

  const removeCoverPhoto = (e: any) => setCoverPhoto(undefined)



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
    <form action={handleUpdate}>
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
            preset.download_url !== formState.downloadUrl && formState.downloadUrl.length > 7 && validateDownloadURL(formState.downloadUrl) && 'active:border-hyper-green !border-hyper-green border-[1px]',
            preset.download_url !== formState.downloadUrl && formState.downloadUrl.length < 7 &&  formState.downloadUrl.length > 0 && !validateDownloadURL(formState.downloadUrl) && 'active:border-hyper-red border-hyper-red outline-none'
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
        {effectsState.current.length > 0 && <Effects
          removeEffect={removeEffect}
          effects={effectsState.current}
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