
import { P, H2, Small, } from "@/components/ui/typography";
import { Button } from "@/components/ui/buttons/button";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PresetCardList from "@/components/lists/presets";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Avatar from "@/components/reusables/avatar";
import { convertDate } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import BackgroundImage from "@/components/misc/backgroundImage";
import ToolTip from "@/components/reusables/toolTip";
import Link from "next/link";
import { Tables } from "../../../../types/supabase";
import { PresetCardQueryResults } from "@/app/presets/page";

type Props = {
  params: {
    username: string
  }
}

export default async function Page({ params: { username } }: Props) {
  const supabase = await createSupabaseServerClient()

  const [{ data: currentUser }, { data: profile }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
    .from('profiles')
    .select('*, downloads(count), presets(count)')
    .eq('username', username)
    .single<ProfilePageQueryResults>()
  ])

  if (profile === null) {
    // In the future, redirect to a user not found page
    return (
      <div className="w-full h-full pt-48 items-center flex flex-col justify-center text-center">
        <P>Profile not found</P>
        <Link href="/presets">
          <Button variant="link">
            Back to presets
          </Button>
        </Link>
      </div>
    )
  }
  
  const { data: presetsData } = await supabase.from('presets').select('*,profile:profile_id(username)').eq('profile_id', profile.profile_id).order('views', { ascending: false }).returns<PresetCardQueryResults[]>() 
  const presets = presetsData || []
  
  return (
    <BackgroundImage img={profile.banner} alt={`${profile.username}'s profile banner`} gradient>
        <div className="h-full w-full min-h-[calc(100vh_-_57px)] pt-[130px]">
          {/* <---------- Profile Info ----------> */}
          <div className="max-w-screen-2xl container flex flex-col space-y-6 h-full pb-6">
            <div className="flex flex-col items-center space-y-5">
              <div className="flex flex-col justify-end items-center">
                <Avatar avatar={profile.avatar} name={profile.name} username={profile.username} classNames={'w-[160px] h-[160px]'} />
                <H2 classNames="mt-4 relative">{profile.name} {currentUser && profile.profile_id === currentUser.user?.user_metadata.profile_id && (
                  <ToolTip size="icon" variant='outline' text="Edit your profile" classNames="absolute top-[-5px] right-[-15%]">
                    <Link href="/settings/profile"><FontAwesomeIcon icon={faPencil} className="w-[1.05rem h-[1.05rem]"/></Link>
                  </ToolTip>
                )}</H2>
                <Small classNames="text-muted-foreground">@{profile.username}</Small>
              </div>
              <div className="md:w-full justify-center gap-x-2 h-full flex-col md:flex-row space-y-2 hidden md:flex">
                <div className="frosted flex gap-x-[3px] justify-center items-center">
                  <CalendarIcon className="w-5 h-5" />
                  <Small classNames=""> Member Since: {convertDate(profile.created_on as string)}</Small>
                </div>

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

export interface ProfilePageQueryResults extends Tables<'profiles'> {
  downloads: { count: number }[]
  presets: { count: number }[]
}