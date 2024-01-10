"use client"

import React, { useEffect, useState } from 'react'
import { Database, Enums } from '../../../../../types/supabase';
import Dropdown, { TriggerType } from '@/components/reuseables/Dropdown';
import Effects from '../../[hardware]/details/[preset]/components/Effects';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faImage } from '@fortawesome/free-solid-svg-icons';
import { PresetFormData } from '../page';
import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation';

type Props = {
  user: User;
  profileId: number;
}

type InitialState = {
  name: string;
  description: string;
  youtubeUrl: string;
  hardware: Enums<'hardware_type'>;
  downloadUrl: string;
  effects: Enums<'effect_type'>[];
}

const CDNURL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/sign/images/"

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

  //const [effects, setEffects] = useState<Enums<'effect_type'>[]>([])

  const [coverPhoto, setCoverPhoto] = useState<File | undefined>(undefined)

  const router = useRouter()

  const supabase = createClientComponentClient<Database>()

  // useEffect(() => {}, [effects])
  
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!user) return

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
        alert('There was an error, please try again')
        return
      }

      tmpState.photoUrl = CDNURL + coverPhotoRes.data?.path
    }

    await submitPreset(tmpState, profileId)
      .then(async (res) => {
        if (res.data === null)
          return alert('There was an error, please try again')

        const resData = res.data
        const transformedData = formState.effects.map(item => ({ effect: item, preset_id: resData.preset_id }))
        const { data, error } = await submitEffects(transformedData)

        if (data)
          return alert('There was an error, please try again')

        return router.push(`/presets/${resData.hardware}/details/${resData.preset_id}`)
      })
      .catch(error => {
        console.log(error)
        alert('There was an error, please try again')
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
                  value={formState.name}
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

      <button className='button-auto text-sm w-full mb-[50px]'>Submit</button>
    </form>
  )
}
