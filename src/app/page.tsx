import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComputerMouse, faMicrophone, faHeadset } from '@fortawesome/free-solid-svg-icons'

import Presets from '@/components/Presets/PresetsList'

export default function Home() {
  return (
    <div className='pt-[60px]'>

      {/* <--------------------- Hero Section ---------------------> */}

      <div className='relative h-screen flex items-center'>
        <div className='absolute w-full h-[50%] top-[-15px]'>
          <img src={'/Assets/alloys-origin-hero.png'} alt={'/Alloys Origin Hero'} width={0} height={0} className='-z-10 w-full h-full object-cover object-left' />
        </div>

        <div className='text-container z-10 translate-y-[60px] container'>
          <h1 className='title-2xl-upper'>HYPER SETS</h1>
          <h4 className='sub-text'>Community collection of HyperX NGenuity RGB presets</h4>
          <div className='translate-y-[25px]'>
            <Link href="/presets" className='button-auto'>Explore Presets</Link>
          </div>
        </div>
      </div>


      <div className='container'>
        {/* <--------------------- Upgrade Setup Section ---------------------> */}
        <div className='mb-[50px]'>
          <div className='w-full max-h-[250px] rounded-md overflow-hidden mb-[50px]'>
            <img src='/Assets/cozy-setup.jpg' alt='cozy setup' height={0} width={0} className='w-full h-full object-cover object-center' />
          </div>

          <div className='text-container'>
            <h2 className='title-2xl-upper'>Upgrade Your Setup</h2>
            <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</h4>
          </div>
        </div>

        {/* <--------------------- Featured Presets Section ---------------------> */}

        <Presets table='presets' />

        {/* <--------------------- Different Presets Section ---------------------> */}

        <div className=''>
          <div className='text-container pb-[50px]'>
            <h2 className='title-2xl-upper'>More than RGB</h2>
            <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</h4>
          </div>

          <div className=''>
            {/* <---------- Mouse DPI ----------> */}
            <div className='pb-[50px]'>
              <div className='pb-5 flex justify-center'>
                <FontAwesomeIcon icon={faComputerMouse} height={60} width={60} className='w-[60px] h-[60px] text-hyper-dark-grey' />
              </div>

              <div className='text-container'>
                <h3 className='title-xl'>Mouse DPI</h3>
                <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print</h4>
              </div>
            </div>

            {/* <---------- Mic Settings ----------> */}
            <div className='pb-[50px]'>
              <div className='pb-5 flex justify-center'>
                <FontAwesomeIcon icon={faMicrophone} height={60} width={60} className='w-[60px] h-[60px] text-hyper-dark-grey' />
              </div>

              <div className='text-container'>
                <h3 className='title-xl'>Mic Settings</h3>
                <h4 className='sub-text'>Lorem ipsum is placeholder text commonly used in the graphic, print</h4>
              </div>
            </div>

            {/* <---------- Audio Tuning ----------> */}
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

        {/* <--------------------- About Section ---------------------> */}

        <div className='bg-hyper-dark-grey mt-[100px] pt-[130px] pb-[60px] relative mb-[50px]'>
          <div className='rounded-md overflow-hidden absolute top-[0%] translate-y-[-50%]'>
            <img src='/Assets/setup.jpeg' alt='cozy setup' height={0} width={0} className='rounded-md mx-auto w-[85%] h-[75%] object-cover object-center' />
          </div>

          <div className='text-container'>
            <h2 className='title-2xl-upper'>More than RGB</h2>
            <p className='sub-text text-hyper-white'>Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
            <div className='translate-y-[25px]'>
              <Link href="/about" className='button-auto'>Learn More</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
