import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, CardFooter } from "../ui/card";
import { H4, Small } from "../ui/typography";
import { Tables } from "../../../types/supabase";
import { capitalizeEachWord, convertDate } from "@/lib/utils";
import Avatar from "../misc/avatar";

export default function NotificationCard({data: { 
  unread, 
  sender, 
  preset, 
  id, 
  created_at, 
  last_updated, 
  notification_type,
  comment, 
  like,
}}: NotificationCardProps) {
  const capitalizedName = capitalizeEachWord(sender.name);
  const capitalizedPresetsName = capitalizeEachWord(preset.name);
  const { notificationCard, notificationText } = getNotificationElements()

  function getNotificationElements() {
    let notificationText: JSX.Element | null = null
    let notificationCard: JSX.Element | null = null

    switch(notification_type) {
      case 'Comment': 
        notificationText = (
          <H4 classNames="text-sm">{capitalizedName}<span className='font-extralight'>left a</span> comment <span className='font-extralight'>on your preset</span>{capitalizedPresetsName}</H4>
        )
        notificationCard = (
          <CommentNotificationCard commentText={comment?.text}/>
        )
        break;
      case 'Rate':
        notificationText = (
          <H4 classNames="text-sm">{capitalizedName}<span className='font-extralight'>left a</span> ratting <span className='font-extralight'>on your preset</span> {capitalizedPresetsName}</H4>
        )
        notificationCard = (
          <RatingNotificationCard />
        )
        break;
      case 'Like':
        notificationText = (
          <H4 classNames="text-sm">{capitalizedName}<span className='font-extralight'>left a</span> comment <span className='font-extralight'>on your preset</span> {capitalizedPresetsName}</H4>
        )
        notificationCard = (
          <LikeNotificationCard />
        )
        break;
      case 'Download':
        notificationText = (
          <H4 classNames="text-sm">{capitalizedName}<span className='font-extralight'>left a</span> comment <span className='font-extralight'>on your preset</span> {capitalizedPresetsName}</H4>
        )
        notificationCard = (
          <DownloadNotificationCard />
        )
        break;
      default:
        break;
    }

    return {
      notificationText,
      notificationCard,
    }
  }

  function readNotification() {
    // Mark notification as read
  }

  return (
    <Card>
      <CardContent className='flex flex-row p-3'>
        {unread && <FontAwesomeIcon icon={faCircle} className="absolute top-3 right-3 text-primary w-2 h-2" />}
        <Avatar avatar={sender.avatar} name={sender.name} username={sender.username} />
        <div>
          {notificationText}
          {notificationCard}
        </div>
      </CardContent>
      <CardFooter className='pb-3'>
        <Small classNames="font-normal text-muted-foreground ml-auto">{convertDate(created_at)}</Small>
      </CardFooter>
    </Card>
  )
}

function CommentNotificationCard({ commentText }: { commentText: string | undefined }) {
  return (
    <Card className='px-2 py-1 max-h-[100px] overflow-hidden mt-3'>
      <Small>{commentText}</Small>
    </Card>
  )
}

function RatingNotificationCard() {
  return (
    <Card className='px-2 py-1 max-h-[100px] overflow-hidden mt-3'>
      <Small>Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view</Small>
    </Card>
  )
}

function LikeNotificationCard() {
  return (
    <Card className='px-2 py-1 max-h-[100px] overflow-hidden mt-3'>
      <Small>Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view</Small>
    </Card>
  )
}

function DownloadNotificationCard() {
  return (
    <Card className='px-2 py-1 max-h-[100px] overflow-hidden mt-3'>
      <Small>Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view Click to view</Small>
    </Card>
  )
}

type OmitedFields = 'sender_id' | 'preset_id' | 'like_id' | 'comment_id' 

type LikeField = {
  like?: SenderField,
}

type SenderField = {
  sender: Pick<Tables<'profile'>, 'username' | 'avatar' | 'name'>
}

type PresetField = {
  preset: Pick<Tables<'presets'>, 'name' | 'photo_url'>
}

type CommentField = {
  comment?: Pick<Tables<'comments'>, 'text'>
}

export interface NotifcationCardData extends Omit<Tables<'notifications'>, OmitedFields>, LikeField, SenderField, PresetField, CommentField {}

type NotificationCardProps = {
  data: NotifcationCardData,
}