"use client"

import { faImage, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

export default function CoverPhotoForm() {
  const [coverPhoto, setCoverPhoto] = useState<File | undefined>(undefined)

  const uploadCoverPhoto = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setCoverPhoto(target)
  }

  const removeCoverPhoto = (e: any) => setCoverPhoto(undefined)

  return (
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
                //value={formState.name}
                onChange={uploadCoverPhoto}
                placeholder='My Awesome Preset'
                className='hidden !w-[0.1] h-[0.1] opacity-0 absolute -z-10'
              />
            </label>

          </div>
        </div>
      </div>
    </div>
  )
}
