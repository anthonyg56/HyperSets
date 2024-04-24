import { useEffect, useState } from "react"
import { createSupabaseClient } from "../supabase/client";

export default function useProfile<T>( profile_id?: number | null, query: string = '*',) {
  const [profile, setProfile] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)

    let queryBuilder = supabase
      .from('profiles')
      .select(query ?? '*')

    if (profile_id) {
      queryBuilder = queryBuilder.eq('profile_id', profile_id)
    } else {
      const { data: { session }} = await supabase.auth.getSession()
      if (!session) return
      queryBuilder = queryBuilder.eq('profile_id', session.user.user_metadata.profile_id)
    }

    const { data } = await queryBuilder.single<T>()

    
    setProfile(data)
    setLoading(false)
  }



  return {
    profile,
    loading,
  }
}