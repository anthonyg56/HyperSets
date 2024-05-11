import { createSupabaseServerClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  
  if (token_hash && type) {
    // if (type === 'recovery') {
    //   redirectTo.pathname = '/forgot/new'
    //   redirectTo.searchParams.set('token_hash', token_hash)
    //   return NextResponse.redirect(redirectTo)
    // }

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash
    })

    if (!error) {
      
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/login'
  return NextResponse.redirect(redirectTo)
}
