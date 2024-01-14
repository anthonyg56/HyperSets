"use client"

import React, { useEffect, useState } from 'react'
import { Database, Enums, Tables } from '../../../../../types/supabase';
import Dropdown, { TriggerType } from '@/components/reuseables/Dropdown';
import Effects from '../../[hardware]/details/[preset]/components/Effects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import { PresetFormData } from '../page';
import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation';
import Toast from '@/components/reuseables/toast/Toast';
import clsx from 'clsx';
import { validateDownloadURL, validateYoutubeURL } from '@/lib/utils/validate';
import { CDNURL } from '@/lib/utils/constants';

type Props = {
  user: User;
  profileId: number;
  presetId?: number;
  hardware?: string;
}

type InitialState = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'>;
  downloadUrl: string;
  effects: {
    effect: Enums<'effect_type'>;
  }[];
}

export default function Form(props: Props) {
  const { profileId, user } = props
  const [formState, setState] = useState<InitialState>({
    name: '',
    description: '',
    youtubeUrl: '',
    hardware: 'Keyboard',
    downloadUrl: '',
    effects: [],
  })
  const [toastState, setToast] = useState({
    isOpen: false,
    description: ""
  })
  const [dummyData, setData] = useState<string>('') // For the hiden input elment to upload an image
  //const [effects, setEffects] = useState<Enums<'effect_type'>[]>([])
  const [dropDownErrors, setErrors] = useState({
    effects: false,
    hardware: false
  })
  const [coverPhoto, setCoverPhoto] = useState<File | undefined>(undefined)

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const isValid = formState.name.length > 7 &&
      formState.description.length > 20 &&
      validateYoutubeURL(formState.youtubeUrl) || coverPhoto &&
      formState.hardware === "Keyboard" || "Mouse" || "Microphone" || "Headset" &&
      validateDownloadURL(formState.downloadUrl) &&
      formState.effects.length > 0

    if (!user || !isValid) {
      setToast({
        isOpen: true,
        description: "Please fill out the required fields and try again"
      })
      return
    }

    let tmpState: {
      name: string;
      description: string;
      youtubeUrl: string;
      hardware: Enums<'hardware_type'>;
      downloadUrl: string;
      photoUrl?: string | undefined;
    } = formState

    if (coverPhoto) {
      const coverPhotoRes = await submitCoverPhoto(coverPhoto, user.id as string)

      if (coverPhotoRes.error && coverPhotoRes.data === null) {
        console.log(coverPhotoRes.error)
        setToast({
          isOpen: true,
          description: "There was an error, please try again"
        })
        return
      }

      tmpState.photoUrl = CDNURL + coverPhotoRes.data?.path
    }

    await submitPreset(tmpState, profileId)
      .then(async (res) => {
        if (res.data === null)
          return setToast({
            isOpen: true,
            description: "There was an error, please try again"
          })

        const resData = res.data
        const transformedData = formState.effects.map(item => ({ effect: item.effect, preset_id: resData.preset_id }))
        const { data, error } = await submitEffects(transformedData)

        if (!data)
          return setToast({
            isOpen: true,
            description: "There was an error, please try again"
          })

        return router.push(`/presets/${resData.hardware}/details/${resData.preset_id}`)
      })
      .catch(error => {
        console.log(error)
        setToast({
          isOpen: true,
          description: "There was an error, please try again"
        })
        return
      })
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

  const submitPreset = async (formData: PresetFormData, profileId: number | undefined) => {
    const { data, error } = await supabase
      .from('presets')
      .insert([{
        name: formData.name,
        description: formData.description,
        download_url: formData.downloadUrl,
        hardware: formData.hardware as Enums<'hardware_type'>,
        profile_id: profileId as number,
        youtube_url: formData.youtubeUrl,
        photo_url: formData.photoUrl
      }])
      .select()
      .limit(1)
      .single()

    return { data, error }
  }

  const submitEffects = async (effects: { preset_id: number, effect: Enums<'effect_type'> }[]) => {
    const { data, error } = await supabase
      .from('effects')
      .insert(effects)

    return { data, error }
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
    prevEffectState.push({effect})

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
    const index = prevEffectState.indexOf({effect})

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
    <form action={handleSubmit}>
      <div>
        <div>
          <h4 className='label-text pb-1'>Cover Photo</h4>
        </div>

        <div className='flex flex-row gap-[20px] pb-[22px]'>
          {!coverPhoto ? (
            <div className='min-w-[100px] h-[100px] bg-hyper-grey rounded-[5px] flex justify-center items-center'>
              <FontAwesomeIcon icon={faImage} className='w-[48px] h-[38px] text-hyper-dark-white' />
            </div>
          ) : (
            <div className='min-w-[100px] max-w-[150px] h-[100px] opverflow-hidden rounded-[5px] relative'>
              {coverPhoto && <FontAwesomeIcon icon={faCircleXmark} className='absolute right-0 text-hyper-red translate-y-[-5px] translate-x-[5px]' onClick={removeCoverPhoto} />}
              <img src={URL.createObjectURL(coverPhoto)} alt="cover-photo" className='object-cover object-center' />
            </div>
          )}

          <div className=''>
            <p className='italic text-xs'>Please upload square image, size less than 100KB</p>
            <div className='bg-[#F8FCFF] mt-[10px] text-hyper-red font-medium rounded-lg py-2 px-3'>
              <label htmlFor="coverPhoto" className='border-[1px] border-hyper-red rounded-md px-5 py-[6px]'>
                {coverPhoto ? 'Change File' : 'Choose File'}
                <input
                  type="file"
                  id="coverPhoto"
                  name='coverPhoto'
                  value={dummyData}
                  onChange={uploadCoverPhoto}
                  placeholder='My Awesome Preset'
                  className={clsx([
                    'hidden !w-[0.1] h-[0.1] opacity-0 absolute -z-10',
                  ])}
                />
              </label>

            </div>
          </div>
        </div>
      </div>

      <div className='input-container'>
        <label htmlFor="name" className='label-text'>Name<span className='text-hyper-red'>*</span></label>
        <input
          type="text"
          name='name'
          value={formState.name}
          onChange={handleChange}
          placeholder='My Awesome Preset'
          className={clsx([
            formState.name.length > 7 && 'active:border-hyper-green !border-hyper-green border-[1px]',
            formState.name.length < 7 &&  formState.name.length > 0 &&  'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="description" className='label-text'>Description<span className='text-hyper-red'>*</span></label>
        <textarea
          rows={5}
          name='description'
          value={formState.description}
          onChange={handleChange}
          placeholder='Description'
          className={clsx([
            formState.description.length > 20 && 'active:border-hyper-green !border-hyper-green border-[1px]',
            formState.description.length < 20 &&  formState.description.length > 0 &&  'active:border-hyper-red border-hyper-red outline-none'
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="youtubeUrl" className='label-text'>Youtube Link<span className='text-hyper-red'>*</span></label>
        <input
          type="text"
          name='youtubeUrl'
          value={formState.youtubeUrl}
          onChange={handleChange}
          placeholder='Copy and paste the url here'
          className={clsx([
            validateYoutubeURL(formState.youtubeUrl) && 'active:border-hyper-green !border-hyper-green border-[1px]',
            !validateYoutubeURL(formState.youtubeUrl) && formState.youtubeUrl.length > 0 && 'active:border-hyper-red border-hyper-red outline-none',
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="downloadUrl" className='label-text'>Download Link<span className='text-hyper-red'>*</span></label>
        <input
          type="text"
          name='downloadUrl'
          value={formState.downloadUrl}
          onChange={handleChange}
          placeholder='Dropbox, Mega, Google Drive...'
          className={clsx([
            validateDownloadURL(formState.downloadUrl) && 'active:border-hyper-green !border-hyper-green border-[1px]',
            !validateDownloadURL(formState.downloadUrl) && formState.downloadUrl.length > 0 && 'active:border-hyper-red border-hyper-red outline-none',
          ])}
        />
      </div>

      <div className='input-container'>
        <label htmlFor="" className='label-text'>Effects<span className='text-hyper-red'>*</span>:</label>
        <Dropdown
          items={effectDropdownItems}
          trigger={TriggerType.Text}
          triggerLable='Add an effect'
          lableClsx={[
            dropDownErrors.effects && 'active:border-hyper-red border-hyper-red outline-none',
            formState.effects.length > 0 && 'active:border-hyper-green !border-hyper-green border-[1px]'
          ]}
        />
        {formState.effects.length > 0 && <Effects
          removeEffect={removeEffect}
          effects={formState.effects}
          title={false}
        />}
      </div>
      
      <div className='input-container'>
        <label htmlFor="" className='label-text'>Hardware<span className='text-hyper-red'>*</span>:</label>
        <Dropdown
          items={hardwareDropdownItems}
          trigger={TriggerType.Text}
          triggerLable={formState.hardware ? formState.hardware : 'What hardware is this preset for?'}
          lableClsx={[
            dropDownErrors.hardware && 'active:border-hyper-red border-hyper-red outline-none',
            formState.hardware.length > 0 && 'active:border-hyper-green !border-hyper-green border-[1px]'
          ]}
        />
      </div>

      <button className='button-auto text-sm w-full mb-[50px]'>{props.presetId ? "Update" : "Submit"}</button>

      <Toast 
        title='Error'
        description={toastState.description}
        open={toastState.isOpen}
        setOpen={handleToast}
      />
    </form>
  )
}
