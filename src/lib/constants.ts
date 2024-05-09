const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

// Public CDN URL for supabase storage
export const PUBLIIC_CDN_URL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object/public/" as const

export const AUTHENTICATE_CDN_URL = "https://mxmzlgtpvuwhhpsjmxip.supabase.co/storage/v1/object" as const
export const baseURL = getURL()

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 30
export const MAX_IMAGE_FILE_SIZE = 52428800; 
export const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']