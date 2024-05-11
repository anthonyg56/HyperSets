import Title from "@/components/misc/title"
import { Button } from "@/components/ui/button"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { redirect } from "next/navigation"

type Props = {
  searchParams: {
    [x: string]: string | undefined
  }
}

export default async function Page({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient()
  
  const code = searchParams.code

  if (code === undefined) {
    redirect('/settings?section=security')
  }

  const { data: { user } } = await supabase
    .auth
    .exchangeCodeForSession(code)
    .then(data => data)
    .catch(error => redirect('/settings?section=security'))
  
  if (user === null)
    redirect(`/`)

  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title
        center
        title="Email Confirmed" 
        subTitle={`${user.email} has been added as your primary email address.`}
        iconProps={{ icon: faCheckCircle, className: "mx-auto" }}
      />
      <Button type="button" className="mt-2">
        <Link href="/settings?section=security">
          Go back to Security Settings
        </Link>
      </Button>
    </div>
  )
}