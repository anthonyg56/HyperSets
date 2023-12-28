import { faComputerMouse, faMicrophone, faHeadset } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function Options() {
  return (
    <div className=''>
    <div className='text-container pb-[50px]'>
      <h2 className='title-2xl-upper'>More than RGB</h2>
      <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</h4>
    </div>

    {/** Different Preset Options */}
    <div className=''>
      {/** Mouse DPI */}
      <div className='pb-[50px]'>
        <div className='pb-5 flex justify-center'>
          <FontAwesomeIcon icon={faComputerMouse} height={60} width={60} className='w-[60px] h-[60px] text-hyper-dark-grey'/>
        </div>

        <div className='text-container'>
          <h3 className='title-xl'>Mouse DPI</h3>
          <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print</h4>
        </div>
      </div>

      {/** Mic Settings */}
      <div className='pb-[50px]'>
        <div className='pb-5 flex justify-center'>
          <FontAwesomeIcon icon={faMicrophone} height={60} width={60} className='w-[60px] h-[60px] text-hyper-dark-grey'/>
        </div>

        <div className='text-container'>
          <h3 className='title-xl'>Mic Settings</h3>
          <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print</h4>
        </div>
      </div>

      {/** Audio Tuning  */}
      <div className='pb-[50px]'>
        <div className='pb-5 flex justify-center'>
          <FontAwesomeIcon icon={faHeadset} height={60} width={60} className='w-[60px] h-[60px] text-hyper-dark-grey' />
        </div>

        <div className='text-container'>
          <h3 className='title-xl'>Audio Tuning</h3>
          <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print</h4>
        </div>
      </div>
    </div>
  </div>
  )
}
