"use client"

import { useEffect, useRef, useState } from "react"

type QualityOptions = 'maxresdefault.jpg' | 'sddefault.jpg' | 'hqdefault.jpg' | 'mqdefault.jpg' | 'default.jpg'

// In order from highest to lowest quality starting at 0
const qualityOptions = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg', 'mqdefault.jpg', 'default.jpg'] as const


// Returns the highest quality thumbnail available via its file name, ref qualityOptions
export default function useThumbnail(videoId: string | null) {
  const [quality, setQuality] = useState<QualityOptions | null>(null)

  // Control states
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Counter to keep track of how many times we've tried to fetch the thumbnail
  const fetchAttemptsRefs = useRef(0)

  const baseUrl = 'https://img.youtube.com/vi/'

  useEffect(() => {
    

    // Recursive function to fetch the thumbnail
    async function fetchThumbnail() {
      setLoading(true)
      
      try {
        
        const response = await fetch(`https://img.youtube.com/vi/${videoId}/${qualityOptions[fetchAttemptsRefs.current]}`, {
          headers: {
            'Access-Control-Allow-Origin': '',
          }
        })
          .then(async res => {
            
            if (!res.ok && fetchAttemptsRefs.current < qualityOptions.length && fetchAttemptsRefs.current >= 0) {
              fetchAttemptsRefs.current++
              await fetchThumbnail()
            } else if (!res.ok && quality === null && fetchAttemptsRefs.current >= qualityOptions.length) {
              throw new Error()
            }
            return qualityOptions[fetchAttemptsRefs.current]
          })

        setQuality(response)
      } catch (error) {
        setError("Failed to fetch the thumbnail")
        setQuality(null)
      } finally {
        setLoading(false)
      }
    }

    if (videoId)
      fetchThumbnail()
  }, [videoId])



  return { quality, baseUrl, loading, error }
}