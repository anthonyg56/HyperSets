import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { searchParams } = new URL(request.url)

  const next = searchParams.get('next') ?? '/'
  const code = searchParams.get('code')

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  if (code) {
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!user) {
      redirectTo.pathname = '/login'
      return NextResponse.redirect(redirectTo)
    }

    redirectTo.pathname = `/presets`
    return NextResponse.redirect(redirectTo)
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/login'
  return NextResponse.redirect(redirectTo)
}