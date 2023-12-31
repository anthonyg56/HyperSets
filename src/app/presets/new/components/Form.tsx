"use client"

import React, { useState } from 'react'
import { Enums } from '../../../../../types/supabase';
import Dropdown, { TriggerType } from '@/components/reuseables/Dropdown';
import generateEffects from '@/lib/utils/generateEffects';
import Effects from '../../[hardware]/details/[preset]/components/Effects';
import Hardware from '../../[hardware]/details/[preset]/components/Hardware';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faImage } from '@fortawesome/free-solid-svg-icons';

type InitialState = {
  name: string;
  description: string;
  youtubeLink: string;
  effect: Enums<'effect_type'>[];
  hardware: Enums<'hardware_type'> | undefined;
  downloadUrl: string;
  coverPhoto: File | undefined;
}

export default function Form() {
  const [formState, setState] = useState<InitialState>({
    name: '',
    description: '',
    youtubeLink: '',
    effect: [],
    hardware: undefined,
    downloadUrl: '',
    coverPhoto: undefined,
  })

  const [cover, setcover] = useState<string | undefined>(undefined)

  const handleSubmit = async (e: any) => {

  }

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  const uploadNewAvatar = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setState({
      ...formState,
      coverPhoto: target
    })
  }

  const addEffect = (effect: Enums<'effect_type'>) => {
    let prevEffectState = formState.effect
    prevEffectState.push(effect)

    setState((prevState) => ({
      ...prevState,
      effect: prevEffectState
    }))
  }

  const setHardware = (hardware: Enums<'hardware_type'>) => setState((prevState) => ({
    ...prevState,
    hardware: hardware
  }))

  const removeCoverPhoto = (e: any) => setState((prevState) => ({
    ...prevState,
    coverPhoto: undefined
  }))

  const removeEffect = (effect: Enums<'effect_type'>) => {
    let prevEffectState = formState.effect
    const index = prevEffectState.indexOf(effect)

    if (index !== -1) prevEffectState.splice(index, 1)
    if (index === -1) return

    setState((prevState) => ({
      ...prevState,
      effect: prevEffectState
    }))
  }

  const transformedEffectData = generateEffects(formState.effect)

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

  return (
    <form action={handleSubmit}>
      <div>
        <div>
          <h4 className='label-text pb-1'>Cover Photo</h4>
        </div>
        
        <div className='flex flex-row gap-[20px] pb-[22px]'>
          {!formState.coverPhoto ? (
            <div className='min-w-[100px] h-[100px] bg-hyper-grey rounded-[5px] flex justify-center items-center'>
              <FontAwesomeIcon icon={faImage} className='w-[48px] h-[38px] text-hyper-dark-white' />
            </div>
          ) : (
            <div className='min-w-[100px] max-w-[150px] h-[100px] opverflow-hidden rounded-[5px] relative'>
              {formState.coverPhoto && <FontAwesomeIcon icon={faCircleXmark} className='absolute right-0 text-hyper-red translate-y-[-5px] translate-x-[5px]' onClick={removeCoverPhoto} />}
              <img src={URL.createObjectURL(formState.coverPhoto)} alt="cover-photo" className='object-cover object-center' />
            </div>
          )}

          <div className=''>
            <p className='italic text-xs'>Please upload square image, size less than 100KB</p>
            <div className='bg-[#F8FCFF] mt-[10px] text-hyper-red font-medium rounded-lg py-2 px-3'>
              <label htmlFor="coverPhoto" className='border-[1px] border-hyper-red rounded-md px-5 py-[6px]'>
                {formState.coverPhoto ? 'Change File' : 'Choose File'}
                <input
                type="file"
                id="coverPhoto"
                name='coverPhoto'
                value={formState.name}
                onChange={uploadNewAvatar}
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
        <label htmlFor="youtubeLink" className='label-text'>Youtube Link*</label>
        <input
          type="text"
          name='youtubeLink'
          value={formState.youtubeLink}
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
        {formState.effect.length > 0 && <Effects
          removeEffect={removeEffect}
          effects={transformedEffectData}
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
