"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "../supabase/client";

export default function useDefaultImages(shouldFetch: boolean) {
  const supabase = createSupabaseClient()

  // Default images from supabase bucket
  const [defaultAvatars, setDefaultAvatars] = useState<string[]>([])
  const [defaultBanners, setDefaultBanners] = useState<string[]>([])

  // Control States
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>();

  // Fetch the default images on mount
  useEffect(() => {
    if (shouldFetch === true)
      fetchDefaults()
  }, [])

  async function fetchDefaults() {
    try {
      // Fetch default images from all necessary buckets
      const [avatarList, bannerList] = await Promise.all([
        supabase.storage
          .from("default_avatars")
          .list()
          .then(({ data, error }) => {
            if (error || !data || data.length <= 0) {
              throw new Error(error?.message ?? "No default avatars found")
            }
            return data
          }),
        supabase.storage
          .from("default_banners")
          .list()
          .then(({ data, error }) => {
            if (error || !data || data.length <= 0) {
              throw new Error(error?.message ?? "No default banners found")
            }
            return data
          })
      ])

      // Get the public URLs
      const { avatarUrls, bannerUrls } = await Promise.all([
        avatarList.map((item) => {
          return supabase.storage.from("default_avatars").getPublicUrl(item.name).data.publicUrl
        }),
        bannerList.map((item) => {
          return supabase.storage.from("default_banners").getPublicUrl(item.name).data.publicUrl
        })
      ])
        .then(([avatarUrls, bannerUrls]) => ({ avatarUrls, bannerUrls })) // Return as object
        .catch((error) => {
          throw new Error(error.message)
        })

      // We either have all or none
      if (avatarUrls.length <= 0 || bannerUrls.length <= 0) {
        throw new Error("No urls available")
      }

      // Set the default avatars
      setDefaultAvatars(avatarUrls)
      setDefaultBanners(bannerUrls)

      // const randomIndex = Math.floor(Math.random() * avatarUrls.length)

      // setAvatar(avatarUrls[randomIndex])
      // setBanner(bannerUrls[randomIndex])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    error,
    loading,
    defaultAvatars,
    defaultBanners,
  }
}