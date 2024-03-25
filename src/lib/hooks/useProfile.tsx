import { useEffect, useState } from "react";
import { ProfileQueries, ProfileSettingsQuery, ProfilesTable } from "../../../types/query-results";
import { createSupabaseClient } from "../supabase/client";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormSchema } from "../schemas";

type Props = {
  profile_id?: number | null,
  query?: string,
}

export default function useProfile<T = ProfileQueries[keyof ProfileQueries]>( profile_id?: number | null, query?: string,) {
  const [profile, setProfile] = useState<T | T[] | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()

  useEffect(() => {
      fetchProfile()
  }, [profile_id])

  async function fetchProfile() {
    if (!profile_id) return

    setLoading(true)

    let queryBuilder = supabase
      .from('profile')
      .select(query ?? '*')

    if (profile_id) {
      queryBuilder = queryBuilder.eq('profile_id', profile_id)
    } else {
      const { data: { session }} = await supabase.auth.getSession()
      if (!session) return
      queryBuilder = queryBuilder.eq('user_id', session.user.user_metadata.profile_id)
    }

    const { data } = await queryBuilder.single<T>()

    setProfile(data ?? [])
    setLoading(false)
  }

  async function updateProfile(values: ProfileFormSchema, profile: ProfileSettingsQuery) {
    let tmpAvatar: File | undefined
    let tmpBanner: File | undefined
    let newValues = {} as ProfileSettingsQuery

    if (values.name !== profile.name) newValues.name = values.name
    if (values.username !== profile.username) newValues.username = values.username
    if (values.bio !== profile.bio) newValues.bio = values.bio || null;
    if (values.avatar) tmpAvatar = values.avatar
    if (values.banner) tmpBanner = values.banner

    const { data, error } = await supabase
      .from('profile')
      .update(newValues)
      .eq('profile_id', profile.profile_id)
      .select('name, username, bio')
      .returns<ProfilesTable | null>()

    if (!data) {
      return {
        valid: false,
        message: 'No profile was found to update.',
      }
    }

    if (tmpAvatar) {
      const { data: avatarData } = await supabase
        .storage
        .from('avatars')
        .upload(`avatars/${profile.profile_id}`, tmpAvatar)

      if (avatarData) {
        return {
          valid: false,
          message: 'Failed to upload avatar.',
        }
      }
    }

    if (tmpBanner) {
      const { data: bannerData } = await supabase
        .storage
        .from('banners')
        .upload(`banners/${profile.profile_id}`, tmpBanner)

      if (bannerData) {
        return {
          valid: false,
          message: 'Failed to upload banner.',
        }
      }
    }

    return {
      valid: true,
      message: 'Profile updated successfully.',
    }
  }

  async function checkUsername(username: string | undefined) {
    const cleansedUsername = username?.trim().toLowerCase()

    if (!cleansedUsername) {
      return {
        valid: false,
        message: "Username is invalid.",
      }
    }

    const { data: profile } = await supabase
      .from('profile')
      .select('username')
      .eq('username', cleansedUsername)
      .single()

    if (profile === null) {
      return {
        valid: false,
        message: "username is already in use.",
      }
    }

    return {
      valid: true,
      message: "Username is available.",
    }
  }

  return {
    profile,
    loading,
    setProfile,
    checkUsername,
    updateProfile,
  }
}