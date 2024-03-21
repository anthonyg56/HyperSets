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

// export async function validateSessionServer(redirectTo?: string, toUser?: boolean) {
//   const { data: { session }, error } = await supabaseServer.auth.getSession()

//   if (!session) {
//     const url = redirectTo ?? '/auth/login'
//     redirect(url)
//   } else if (session && redirectTo !== undefined) {
//     redirect(redirectTo)
//   } else if (session && redirectTo !== undefined && toUser === true) { // If a user needs to be redirected to their account page
//     redirect(`/auth/${session.user.id}`)
//   }

//   return session
// }

// Every Page past /auth/[uuid]/settings will run this function, taking an extra step to validate the route uuid matches the session uuid
export async function validateRouteUuid({
  routeUuid, 
  userId}: {
    routeUuid: string,
    userId: string,
  },
  routeParamas: {  path: 'settings' | 'account' | 'table' | 'userProp', 
  table?: "downloads" | "presets", 
  userProp?: "name" | "email" | "password"}
) {

  function generateRoute() {
    let route: string
    switch (routeParamas.path) {
      case 'account':
        route = `/auth/${userId}/settings/account`;
        break;
      case 'settings':
        route = `/auth/${userId}/settings`;
        break;
      case 'table':
        route = `/auth/${userId}/settings/${routeParamas.table}`;
        break;
      case 'userProp':
        route = `/auth/${userId}/settings/account/${routeParamas.userProp}`;
        break;
      default:
        route = '';
        break;
    }

    return route
  }

  const route = generateRoute()
  
  if (routeUuid !== userId) 
    redirect(route)
}

type ProfileKeys = keyof Tables<'profile'>

export async function fetchProfileByUserId(userId: string, keys?: Array<ProfileKeys>) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single()
  
  if (!data || error) {
    alert('there was an error')
    redirect('/')
  }

  if (keys) {
    let transformedData = keys.map(key => ({ [key as keyof Tables<'profile'>]: data[key]?.valueOf() })) // Create an object out of the keys passed
    
    return transformedData as Partial<Tables<'profile'>>
  }

  return data
}

type PresetKeys = keyof Tables<'presets'>

export async function fetchPresetsById(id?: number, keys?: Array<PresetKeys>) {
  if (!id){
    redirect('/presets')
  }
  
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('preset_id', id)
    .limit(1)
    .single()
  
  if (!data || error) {
    alert('there was an error')
    redirect('/presets')
  }

  if (keys) {
    let transformedData = keys.map(key => ({ [key as keyof Tables<'presets'>]: data[key]?.valueOf() })) // Create an object out of the keys passed
    
    return transformedData as Partial<Tables<'presets'>>
  }

  return data
}

export async function fetchPresetsFormData(userId: string, presetId: number, hardware: string) {
  try {
    const supabase = await createSupabaseServerClient()
    const results = pageRouteSchema.parse({
      userId,
      presetId,
      hardware,
    })
  
    const { data: profile } = await supabase
    .from("profile")
    .select('profile_id')
    .eq('user_id', results.userId)
    .limit(1)
    .single()

  const { data: preset } = await supabase
    .from("presets")
    .select('*')
    .eq('preset_id', results.presetId)
    .limit(1)
    .single()

  const { data: effects } = await supabase
    .from("effects")
    .select('*')
    .eq('preset_id', results.presetId)

    if (!effects) {
      redirect('/presets')
    } else if (!preset) {
      redirect(`/presets/${hardware}`)
    } else if (!profile || profile.profile_id !== preset.profile_id){
      redirect(`/presets/${hardware}/details/${presetId}`)
    }

    return {
      preset,
      effects
    }
  } catch (e) {
    redirect(`/presets`)
  }
}

// export async function fetchTableByKey<T extends keyof Database['public']['Tables'], P = keyof Tables<T>>(table: T, filterBy: P extends string ? string : string, value: typeof filterBy, props?: Array<P>) {
//   const { data, error } = await supabaseServer
//     .from(table)
//     .select('*')
//     .eq(filterBy, value)
//     .limit(1)
//     .single()
  
//   if (!data || error) {
//     alert('there was an error')
//     redirect('/')
//   }

//   if (props) {
//     let transformedData = props.map(props => ({ [props as keyof Tables<'profile'>]: data[props]?.valueOf() })) // Create an object out of the keys passed
    
//     return transformedData as Partial<Tables<'profile'>>
//   }

//   return data
// }