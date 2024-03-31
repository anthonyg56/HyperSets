import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database, Tables } from '../../../types/supabase'
import { cookies,  } from 'next/headers'
import { redirect } from 'next/navigation'
import { pageRouteSchema } from '../schemas'

export async function createSupabaseServerClient(){
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}