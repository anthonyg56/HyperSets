import React from 'react'

type Props = {
  youtubeUrl: string | null;
}

export default function YoutubePlayer(props: Props) {
  const { youtubeUrl } = props

  const transformUrl = (url: string) => {
    const newUrl = url?.replace('/watch?v=', '/embed/')
    return newUrl
  }

  const newUrl = transformUrl('https://www.youtube.com/watch?v=NTKhPc26B9M')

  return (
    <div>
      {youtubeUrl && youtubeUrl.length > 0 && <div className='pb-[50px]'>
        <iframe
          className="w-full h-[200px] rounded-lg"
          width="0"
          height="30"
          src={newUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>
      </div>}
    </div>

  )
}
