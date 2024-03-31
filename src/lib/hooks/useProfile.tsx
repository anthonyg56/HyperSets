import { useEffect, useState } from "react";
import { ProfileFormSchema } from "../schemas";
import { createSupabaseClient } from "../supabase/client";
import { ProfileQueries, ProfileSettingsQuery, ProfilesTable } from "../../../types/query-results";

export default function useProfile<T = ProfileQueries[keyof ProfileQueries]>( profile_id?: number | null, query: string = '*',) {
  const [profile, setProfile] = useState<T | T[] | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)

    let queryBuilder = supabase
      .from('profile')
      .select(query ?? '*')

    if (profile_id) {
      queryBuilder = queryBuilder.eq('profile_id', profile_id)
    } else {
      const { data: { session }} = await supabase.auth.getSession()
      if (!session) return
      queryBuilder = queryBuilder.eq('profile_id', session.user.user_metadata.options.profile_id)
    }

    const { data } = await queryBuilder.single<T>()

    console.log(data)
    setProfile(data)
    setLoading(false)
  }

  async function updateProfile(values: ProfileFormSchema, profile: ProfileSettingsQuery) {
    let newValues = {
      name: values.name,
      username: values.username,
      bio: values.bio || null,
    } as ProfileSettingsQuery

    const { error } = await supabase
      .from('profile')
      .update(newValues)
      .eq('profile_id', profile.profile_id)
      .select('name, username, bio')
      .returns<ProfilesTable | null>()

    if (error) {
      return {
        valid: false,
        message: 'No profile was found to update.',
      }
    }

    if (values.avatar) {
      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`avatars/${profile.profile_id}`, values.avatar)

      if (error) {
        return {
          valid: false,
          message: 'Failed to upload avatar.',
        }
      }
    }

    if (values.banner) {
      const { error } = await supabase
        .storage
        .from('banners')
        .upload(`banners/${profile.profile_id}`, values.banner)

      if (error) {
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
    checkUsername,
    updateProfile,
  }
}