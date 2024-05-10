
import { capitalizeEachWord, capitalizeFirstLetter, cn } from "@/lib/utils";
import { DotFilledIcon } from "@radix-ui/react-icons";
import moment from "moment";
import CommentCard from "../comments/comment";
import { PresetCard } from "../presets/preset";
import { CommentsQueryResults } from "@/app/presets/[presetId]/page";
import Avatar from "@/components/misc/avatar";
import { H4, P, Small } from "../../typography";
import { Card, CardContent } from "../../card";
import { NotificationsQueryResults } from "@/components/layout/profile-controller";
import { Tables } from "../../../../../types/supabase";

export default function NotificationCard({ data, profile_id }: NotificationCardProps) {
  const { comments, likes, downloads } = data;

  const notificationType = downloads !== null ? "Download" : comments !== null ? "Comment" : "Like";

  const profile = assignProfile()
  const preset = assignPreset()

  if (!profile) return null;

  const capitalizedName = capitalizeEachWord(profile.name ?? "deleted user");
  const capitalizedUsername = capitalizeFirstLetter(profile.username ?? "deletedUser");
  const capitalizedPresetsName = capitalizeEachWord(preset?.name ?? 'deleted');


  const message = NotificationActionMessage[notificationType as keyof typeof NotificationActionMessage];
  const timeCreated = moment(data.created_at).startOf('hour').fromNow();

  const normalizedComments = comments ? {
    ...comments,
    profile: profile
  } : null as CommentsQueryResults | null

  // For the presetCard
  let transformedPreset = {
    ...preset!,
    profile
  }

  function assignProfile() {
    if (notificationType === 'Download' && downloads !== null && downloads.profile !== null) {
      return {
        ...downloads.profile,
        username: downloads.profile.username,
        avatar: downloads.profile.avatar
      }
    } else if (notificationType === 'Comment' && comments != null && 'profile' in comments && comments.profile !== null) {
      return {
        ...comments.profile,
        username: comments.profile.username,
        avatar: comments.profile.avatar
      }
    } else if (notificationType === 'Like' && likes !== null && 'profile' in likes && likes.profile !== null) {
      return {
        ...likes.profile,
        username: likes.profile.username,
        avatar: likes.profile.avatar
      }
    } else {
      return null
    }
  }

  function assignPreset() {
    if (notificationType === 'Download' && downloads !== null && downloads.preset !== null) {
      return downloads.preset
    } else if (notificationType === 'Comment' && comments !== null && 'preset' in comments && comments.preset !== null) {
      return comments.preset
    } else if (notificationType === 'Like' && likes !== null && 'comments' in likes && likes.comments !== null && 'preset' in likes.comments && likes.comments.preset !== null) {
      return likes.comments.preset
    } else {
      return null
    }
  }

  return (
    <div className="h-full">
      {/**Unread Notification Banner */}
      {data.unread && <div className="w-[6px] h-full absolute left-0 top-0 bg-primary/50"></div>}

      {/* Notification Content */}
      <div className="flex flex-row w-full">

        {/* Notification Avatar */}
        <div className="pr-5">
          <Avatar avatar={profile?.avatar ?? null} name={capitalizedName} username={capitalizedUsername} />
        </div>

        {/* Notification Text */}
        <div className="w-full flex flex-col relative">
          {data.unread && <DotFilledIcon className="absolute right-0 top-0 w-6 h-6 text-primary translate-x-2 -translate-y-4" />}
          {/* Top Row: Username and Action performed + unread dot */}
          <div className="relative w-8/12">
            <H4 classNames="text-sm">{capitalizedName} <span className="font-normal">{message}</span> {capitalizedPresetsName}</H4>
            <Small classNames="text-xs text-muted-foreground translate-y-2">{timeCreated}</Small>
          </div>
          <div className={cn(["relative py-3"])}>
            <div className={cn([{
              'bg-zinc-800 rounded-md pt-2': notificationType === 'Comment' && data.comment_id
            }])}>
              {notificationType === 'Download' && profile.username !== null && preset &&(
                <Card>
                  <CardContent className="pt-6">
                    <PresetCard preset={transformedPreset} classNames="h-[150px] lg-[322px]" />
                  </CardContent>
                </Card>
              )}
              {notificationType === 'Comment' && normalizedComments?.comment_id && normalizedComments?.preset_id !== null && (
                <CommentCard notification comment={normalizedComments} profile_id={profile_id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type NotificationCardProps = {
  data: NotificationsQueryResults,
  profile_id: number | null,
}

enum NotificationActionMessage {
  Download = "downloaded",
  Comment = "commented on",
  Like = "liked your comment on",
}