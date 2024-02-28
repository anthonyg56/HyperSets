import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Tables } from "../../../types/supabase";

import { Card, CardContent, } from "../ui/card";
import { Small, P, } from "../ui/typography";
import { Button } from "../ui/button";
import Avatar from "../misc/avatar";



type ProfileData = {
  username: string,
  name: string,
  avatar: string,
}

export interface CommentCardData extends Omit<Tables<'comments'>, 'user_id'> { 
  profile: ProfileData,
}

type Props = {
  comment: CommentCardData | null
}

export default async function CommentCard({ comment }: Props) {
  const supabase = await createSupabaseServerClient()

  if (!comment) {
    return null
  }

  const { profile: { username, name, avatar, }, comment_id, created_at, last_updated, text  } = comment
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('comment_id', comment_id)
    .limit(1)
    .single()
    // .then(({ data }) => {
    //   if (!data) {
    //     return 0
    //   }
    //   return data.reduce((acc, curr) => acc + curr.rating, 0) / data.length
    // })

  let filledStars: JSX.Element[] = []
  let emptyStars: JSX.Element[] = []

  if (data !== null)
    while (data.rating  > 0) {
      filledStars.push(<FontAwesomeIcon icon={faStar} width={12} height={16} />)
    }

  let i = 0
  while (i < 5 - filledStars.length) {
    emptyStars.push(<FontAwesomeIcon icon={faStarOutline} width={12} height={16} />)
  }

  const { data: likeData, error: likeError, count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true})
    .eq('comment_id', comment_id)
    .limit(1)
    .single()

  return (
    <Card className="relative mb-4">
      <FontAwesomeIcon icon={faEllipsis} width={12} height={12} className="ml-auto absolute right-4 top-4" />
      <CardContent className="pt-6">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <Avatar
              avatar={avatar}
              name={name}
              username={username}
            />
            <div className="flex flex-col mr-3 text-center">
              <Button variant={"ghost"}>
                <FontAwesomeIcon icon={faHeart} width={14} height={14}/>
              </Button>
              <Small>{count}</Small>
            </div>
            
          </div>
          
          <div>
            <div className="flex flex-row">
              <Small>{name}</Small>
              <div className="flex flex-row ml-2 my-auto">
                { data !== null && filledStars }
                {data !== null && emptyStars }
              </div>
            </div>

            <div>
              <P classNames="text-muted-foreground">{text}</P>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}