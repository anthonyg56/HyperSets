"use client"

import React, { useState } from 'react'
import { Enums } from '../../../../../types/supabase';

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

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setState((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <form>
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
    </form>
  )
}
