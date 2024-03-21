import { useEffect, useState } from "react";
import { ProfileQueries } from "../../../types/query-results";
import { createSupabaseClient } from "../supabase/client";

type Props = {
  profile_id?: number | null,
  query?: string,
}

export default function useProfile<T = ProfileQueries[keyof ProfileQueries]>( profile_id?: number | null, query?: string,) {
  const [profile, setProfile] = useState<T | T[] | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()

  useEffect(() => {
    if (profile_id) {
      fetchProfile()
    } else {
      fetchCurrentProfile()
    }
  }, [])

  async function fetchProfile() {
    if (!profile_id) return

    setLoading(true)

    const { data } = await supabase
      .from('profile')
      .select(query ?? '*')
      .eq('profile_id', profile_id)
      .single<T>()

    setProfile(data ?? [])
    setLoading(false)
  }

  async function fetchCurrentProfile() {
    const { data: { session }} = await supabase.auth.getSession()
    if (!session) return

    setLoading(true)

    const { data } = await supabase
      .from('profile')
      .select(query ?? '*')
      .eq('user_id', session.user.id)
      .single<T>()

    setLoading(false)
    return data
  }

  async function updateProfile() {

  }

  return {
    profile,
    loading,
    setProfile,
    fetchCurrentProfile,
  }
}