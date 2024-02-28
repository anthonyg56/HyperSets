
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '../types/supabase'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export default async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  // const { data: { session }} = await supabase.auth.getSession()

  // function handleRouting() {
  //   const url = request.nextUrl.clone()
    
  //   if (session && url.pathname === '/auth/login' || '/auth/confirm' || '/auth/register' || '/auth/forgot') {

  //   } else if (!session && url.pathname ==='/preset/new' || '/preset/') {

  //   } else if (!session && url.pathname.startsWith('/auth/')) {

  //   }
  // }


  return response
  
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}