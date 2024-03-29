
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const code = searchParams.get('code')

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      
      return NextResponse.redirect(redirectTo)
    }
  }

  // The only time a code should be available is for google OAuth, need to figure out what to do with it
  if (code) {
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!user) {
      redirectTo.pathname = '/auth/login'
      return NextResponse.redirect(redirectTo)
    }

    redirectTo.pathname = `/auth/${user.id}/settings`
    return NextResponse.redirect(redirectTo)
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/login'
  return NextResponse.redirect(redirectTo)
}