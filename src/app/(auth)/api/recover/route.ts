import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
  message: string,
  error?: string,
}

export async function GET(request: NextRequest, response: NextResponse<ResponseData>) {
  const supabase = await createSupabaseServerClient()

  const searchParams = request.nextUrl.searchParams
  const token_hash = searchParams.get('token_hash')

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = '/login'

  if (!token_hash) {
    return NextResponse.redirect(redirectTo)
  }

  const { error } = await supabase.auth.verifyOtp({
    type: 'recovery',
    token_hash: token_hash,
  })

  if (!error) {
    return NextResponse.json({ message: 'Success' }, { status: 200 })
  }

  return NextResponse.redirect('/login')
}