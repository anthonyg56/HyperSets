import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string,
  error?: string,
}

async function GET(request: NextApiRequest, response: NextApiResponse<ResponseData>) {
  const supabase = await createSupabaseServerClient()

  const { tokenHash } = request.body as { tokenHash: string }
  
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash: tokenHash,
    })
    
    if (!error) {
      return response.status(200).json({ message: 'Success' })
    } else {
      return response.redirect('/login')
    }
  }

  return response.redirect('/login')
}

export default function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === '') {
    return GET(request, response)
  } else {
    return response.redirect('/login')
  }
}