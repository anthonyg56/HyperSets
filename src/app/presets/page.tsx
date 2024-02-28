import Image from "next/image";
import { cn } from "@/lib/utils";
import MySetupPic from '@public/cozy-setup.jpg';
import { H4, Small } from "@/components/ui/typography";
import PresetCardList from "@/components/cards/preset-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import HandleToast from "@/components/misc/handleToast";
type Props = {
  searchParams?: { 
    code: string | string[] | undefined 
  };
}
// Todo: Add a hero section to this page
// - Make hero component a carousel
// - Wrap Hero component in links
// Finish create a preset card
export default async function Page({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  let isRedirected = false

  if (session && session.user && searchParams?.code) {
    isRedirected = true
  }

  console.log(isRedirected)

  return (
    <div className="min-h-[calc(100vh_-_57px)] flex flex-col">
      <HandleToast  trigger={isRedirected} toastProps={{
        title: "Success!",
        description: "Thanks for joining us! You're account is created and now logged in.",
      }}/>
      <div className="container max-w-screen-2xl w-full relative rounded-lg overflow-hidden py-8">
        <Image
          src={MySetupPic}
          alt="Alloys orgiins hero"
          sizes="100vw 100%"
          quality={100}
          className={cn([
            'object-contain object-center rounded-lg asbsolute',
            '',
            ''
          ])}
        />
        <div className="flex flex-row items-center absolute right-12 bottom-12">
          <H4>Vaporwave</H4>
          <Small classNames="text-muted-foreground ml-2">By Anthony Gayflor</Small>
        </div>
      </div>
      <PresetCardList page="Preset" trigger={isRedirected} />
    </div>
  )
}