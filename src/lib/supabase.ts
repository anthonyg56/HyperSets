import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/supabase'
import { createServerClient, type  CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabase = createServerComponentClient<Database>({ cookies: () => cookies() })

export default supabase