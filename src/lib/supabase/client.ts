
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../types/supabase";
import { baseURL } from "@/lib/constants";
// import { ToastState } from "../contexts/Layout";

export function createSupbaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function resendConfirmationEmail(email: string) {
  const supabase = createSupbaseClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${baseURL}/auth/confirm`
    }
  })

  // if (error) {
  //   updateToast({
  //     title: "Error",
  //     isOpen: true,
  //     description: "There was an error, please try to resend again",
  //     action: {
  //       text: "Resend",
  //       fn: async (e: any) => resendConfirmationEmail(email, updateToast)
  //     }
  //   })
  // }

  // updateToast({
  //   title: "Error",
  //   isOpen: true,
  //   description: "Confirmation email sent ✅",
  // })
}