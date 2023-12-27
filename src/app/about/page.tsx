import React from 'react'

export default function page() {
  return (
    <div >
      <div className='pt-[60px]'>
        <img src="/Assets/about-banner.png" alt="about banner" className='w-full h-[430px] object-cover object-center' />
      </div>
      <div className='container translate-y-[-100px]'>
        <div className='pb-[50px]'>
          <iframe
            className="w-full h-[200px] rounded-lg"
            width="0"
            height="30"
            src="https://www.youtube.com/embed/UvAor0K02sY?si=W_i0HxbnwKJYXrwW"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </div>

        <div className='text-container'>
          <h2 className='title-2xl-upper'>About US</h2>
          <h4 className='sub-text'>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with: The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.</h4>
        </div>
      </div>
    </div>
  )
}
