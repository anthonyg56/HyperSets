
import { P, H2, Small, } from "@/components/ui/typography";

import { } from "react";
import { Button } from "@/components/ui/button";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PresetCardList from "@/components/lists/presets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Avatar from "@/components/reusables/avatar";
import { PresetCardQuery, ProfilePageQuery } from "../../../../types/query-results";
import { capitalizeFirstLetter, convertDate } from "@/lib/utils";
import { CalendarIcon, DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import BackgroundImage from "@/components/misc/backgroundImage";
import ToolTip from "@/components/reusables/toolTip";
import Link from "next/link";

type Props = {
  params: {
    username: string
  }
}

export default async function Page({ params: { username } }: Props) {
  const supabase = await createSupabaseServerClient()

  const { data: currentUser } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profile')
    .select('*, downloads(count), presets(count)')
    .eq('username', username)
    .single<ProfilePageQuery>()

  if (!profile) {
    // In the future, redirect to a user not found page
    redirect('/presets')
  }

  const [{ data: { user } }, { data: presetsData }] = await Promise.all([
    supabase.auth.admin.getUserById(profile.user_id),
    supabase.from('presets').select('*,profile:profile_id(username)').eq('profile_id', profile.profile_id).order('views', { ascending: false }).returns<PresetCardQuery[]>()
  ])

  if (user === null) {
    // In the future, redirect to a user not found page
    redirect('/presets')
  }

  const presets = presetsData || []
  const oAuthIdentities = user.identities?.map(identity => {

    return {
      provider: identity.provider,
      username: identity.identity_data?.full_name,
      email: identity.identity_data?.email
    }
  })

  

  return (
    <BackgroundImage img={profile.banner} alt={`${profile.username}'s profile banner`} gradient>
        <div className="h-full w-full min-h-[calc(100vh_-_57px)] pt-[130px]">
          {/* <---------- Profile Info ----------> */}
          <div className="max-w-screen-2xl container flex flex-col space-y-6 h-full pb-6">
            <div className="flex flex-col items-center space-y-5">
              <div className="flex flex-col justify-end items-center">
                <Avatar avatar={profile.avatar} name={profile.name} username={profile.username} classNames={'w-[160px] h-[160px]'} />
                <H2 classNames="mt-4 relative">{profile.name} {currentUser && profile.user_id === currentUser.user?.id && (
                  <ToolTip size="icon" variant='outline' text="Edit your profile" classNames="absolute right-[-20%]">
                    <Link href="/settings/profile"><FontAwesomeIcon icon={faPencil} /></Link>
                  </ToolTip>
                )}</H2>
                <Small classNames="text-muted-foreground">@{profile.username}</Small>
              </div>
              <div className="md:w-full justify-center gap-x-2 h-full flex-col md:flex-row space-y-2 hidden md:flex">
                <div className="frosted flex gap-x-[3px] justify-center items-center">
                  <CalendarIcon className="w-5 h-5" />
                  <Small classNames=""> Member Since: {convertDate(profile.created_on as string)}</Small>
                </div>
                <Separator orientation='vertical' className="h-[28px] w-[2px] justify-start hidden md:visible" />
                {oAuthIdentities?.map((identity, index) => {
                  return (
                    <div key={index} className="frosted flex !mt-0 py-[10px] px-3 gap-x-[5px] justify-center items-center">
                      {identity.provider === 'google' && <FontAwesomeIcon icon={faGoogle} className="w-5 h-5" />}
                      {identity.provider === 'discord' && <DiscordLogoIcon className="w-5 h-5" />}
                      {identity.provider === 'twitter' && <TwitterLogoIcon className="w-5 h-5" />}
                      <Small>{identity.provider === 'google' ? capitalizeFirstLetter(identity.email) : capitalizeFirstLetter(identity.username)}</Small>
                    </div>
                  )
                })}
              </div>
              <div className="max-w-[500px]  text-center text-muted-foreground">
                <P>{profile.bio}</P>
              </div>
              {/* <Small classNames="text-muted-foreground">Member Since: {convertDate(profile.created_on as string)}</Small> */}
            </div>

            <div className="flex flex-row gap-10 mx-auto text-center">
              <div className="">
                {/* # of Downloads */}
                <P>Downloads</P>
                <H2>{profile.downloads !== undefined ? profile.downloads[0].count : 0}</H2>
              </div>
              <div className="">
                {/* Average Rating */}
                <P>Average Rating</P>
                <H2>4.5</H2>
              </div>
              <div className="">
                {/* # of Presets Made */}
                <P>Presets Made</P>
                <H2>{profile.presets !== undefined ? profile.presets[0].count : 0}</H2>
              </div>
            </div>
          </div>
          <PresetCardList serverPresets={presets} profile_id={profile.profile_id} />
        </div>
    </BackgroundImage>

  )
}