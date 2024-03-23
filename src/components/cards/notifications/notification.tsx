import { Card, CardContent } from "../../ui/card";
import { H4, Small } from "../../ui/typography";
import { capitalizeEachWord, capitalizeFirstLetter, cn } from "@/lib/utils";
import Avatar from "../../reusables/avatar";
import { CommentCardQuery, NotificationsView, PresetCardQuery } from "../../../../types/query-results";
import { DotFilledIcon } from "@radix-ui/react-icons";
import moment from "moment";
import useComments from "@/lib/hooks/useComments";
import CommentCard from "../comments/comment";
import usePresets from "@/lib/hooks/usePresets";
import { PresetCard } from "../presets/preset";

type NotificationCardProps = {
  notificationData: NotificationsView,
}

enum NotificationActionMessage {
  Download = "downloaded",
  Comment = "commented on",
  Like = "liked your comment on",
}

export default function NotificationCard({ notificationData }: NotificationCardProps) {
  const profile = {
    username: notificationData?.username,
    avatar: notificationData?.avatar,
    profile_id: notificationData?.profile_id as number,
    name: notificationData?.name,
  }

  const preset =  {
    name: notificationData?.preset_name as string,
    preset_id: notificationData?.preset_id as number,
    downloads: notificationData?.downloads as number,
    youtube_id: notificationData?.youtube_id,
    photo_url: notificationData?.photo_url,
    hardware: notificationData?.hardware as NonNullable<typeof notificationData.hardware>,
    created_on: notificationData?.preset_created_on as string,
    profile
  }

  const comment = {
    text: notificationData?.comment_text as string,
    comment_id: notificationData?.comment_id as number,
    likes: notificationData?.likes as number,
    preset_id: notificationData?.preset_id,
    created_at: notificationData?.comment_created_on as string,
    profile
  }

  const capitalizedName = capitalizeEachWord(notificationData?.name ?? "deleted user");
  const capitalizedUsername = capitalizeFirstLetter(notificationData?.username ?? "deletedUser");
  const capitalizedPresetsName = capitalizeEachWord(preset?.name ?? 'deleted');
  const notificationType = notificationData.download_id ? "Download" : notificationData.comment_id ? "Comment" : "Like";
  const message = NotificationActionMessage[notificationType as keyof typeof NotificationActionMessage];
  const timeCreated = moment(notificationData.created_at).startOf('hour').fromNow();

  return (
    <div className="h-full">
      {/**Unread Notification Banner */}
      {notificationData.unread && <div className="w-[6px] h-full absolute left-0 top-0 bg-primary/50"></div>}

      {/* Notification Content */}
      <div className="flex flex-row w-full">

        {/* Notification Avatar */}
        <div className="pr-5">
          <Avatar avatar={notificationData?.avatar ?? null} name={capitalizedName} username={capitalizedUsername} />
        </div>

        {/* Notification Text */}
        <div className="w-full flex flex-col relative">
          {notificationData.unread && <DotFilledIcon className="absolute right-0 top-0 w-6 h-6 text-primary translate-x-2 -translate-y-4"/>}
          {/* Top Row: Username and Action performed + unread dot */}
          <div className="relative w-8/12">
            <H4 classNames="text-sm">{capitalizedName} <span className="font-normal">{message}</span> {capitalizedPresetsName}</H4>
            <Small classNames="text-xs text-muted-foreground translate-y-2">{timeCreated}</Small> 
          </div>
          <div className={cn(["relative py-3"])}>
            <div className={cn([{
            'bg-zinc-800 rounded-md pt-2': notificationType === 'Comment' && notificationData.comment_id
            }])}>
              {notificationType === 'Download' && preset && preset.profile.username !== null && (
                <Card>
                  <CardContent className="pt-6">
                    <PresetCard preset={preset} classNames="h-[150px] lg-[322px]"/>
                  </CardContent>
                </Card>
              )}
              {notificationType === 'Comment' && notificationData.comment_id && notificationData.preset_id !== null && (
                <CommentCard notification comment={comment} />  
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}