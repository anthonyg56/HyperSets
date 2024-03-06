
import { P, H2, Small, } from "@/components/ui/typography";
import Image from "next/image";

import { cn, convertDate } from "@/lib/utils";
import { } from "react";
import { Tables } from "../../../../types/supabase";
import { Button } from "@/components/ui/button";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PresetCardList, { Count } from "@/components/cards/preset-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { usernameSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import ProfileBackground from "@/components/misc/profile-bg";
import Avatar from "@/components/misc/avatar";
import moment from "moment";

interface ProfileQueryData extends Tables<'profile'>, Count<'downloads'>, Count<'presets'> {}

type Props = {
  params: {
    username: string
  }
}
// Users should be able to see an edit button when hovering over a preset if its theirs
export default async function Page({ params: { username } }: Props) {
  const supabase = await createSupabaseServerClient()
  const { data: user, error: userError } = await supabase.auth.getUser()

  const { data: profile, error } = await supabase
    .from('profile')
    .select('*, downloads(count), presets(count)')
    .eq('username', username)
    .returns<ProfileQueryData>()

 console.log(profile?.downloads)
 console.log(error)

  if (!profile || error) {
    // In the future, redirect to a user not found page
    redirect('/presets')
  }

  return (
    <div className="relative">
      <ProfileBackground banner={profile.banner} />
      <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,100),rgba(0,0,0,0.5))] text-white">
        <div className="grid grid-cols-12 max-w-screen-2xl container h-full w-full min-h-[calc(100vh_-_57px)]">

          {/* <Image /> */}

          {/* <---------- Profile Info ----------> */}
          <div className="col-span-5 flex flex-col h-full justify-center">
            <Avatar avatar={profile.avatar} name={profile.name} username={profile.username} />
            <div className="mt-4">

              <H2>{profile.name} {user && profile.user_id === user.user?.id &&  <Button size="icon" variant='outline' className="-translate-y-1 ml-2"><FontAwesomeIcon icon={faPencil} /></Button>}</H2>
              <div>
                <P classNames="underline">{profile.avatar}</P>
                <Small classNames="text-muted-foreground">Member Since: {convertDate(profile.created_on as string)}</Small>
              </div>

              <P>{profile.bio}</P>
            </div>
            <div className="grid grid-cols-6 pt-6">
              <div className="col-span-2">
                {/* # of Downloads */}
                <P>Downloads</P>
                <H2>{profile.downloads !== undefined ? profile.downloads[0].count : 0}</H2>
              </div>
              <div className="col-span-2">
                {/* Average Rating */}
                <P>Average Rating</P>
                <H2>4.5</H2>
              </div>
              <div className="col-span-2">
                {/* # of Presets Made */}
                <P>Presets Made</P>
                <H2>{profile.presets !== undefined ? profile.presets[0].count : 0}</H2>
              </div>
            </div>
          </div>
          <PresetCardList page="Profile" />
        </div>
      </div>
    </div>
  )
}