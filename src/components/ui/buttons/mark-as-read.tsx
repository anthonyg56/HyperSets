import { CheckIcon, CircleIcon } from "@radix-ui/react-icons"
import { Button } from "../button"
import { createSupabaseClient } from "@/lib/supabase/client";
import { NotificationsQueryResults } from "@/components/layout/profile-controller";

type Props = {
  updateNotifications: (items: NotificationsQueryResults[]) => void,
  setLoading: (value: boolean) => void,
  profile_id: number | null,
}

export default function  MarkAsReadButton({ updateNotifications, setLoading, profile_id }: Props) {
  const supabase = createSupabaseClient();

  async function markAllAsRead(e: any) {
    e.preventDefault()

    if (!profile_id) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .update({ unread: false })
      .eq("retriver_id", profile_id)
      .select(`
        *,
        downloads:download_id(
          *, profile:profile_id(*), preset:preset_id(*)
        ),
        comments:comment_id(
          *, profile:profile_id(*), preset:preset_id(*), ratings:profile_id(ratings!inner(rating))
        ),
        likes:like_id(
          *,  profile:profile_id(*), comments:comment_id(*, preset:preset_id!inner(*), ratings:profile_id(ratings!inner(rating))) 
        )
      `)
      .returns<NotificationsQueryResults[]>();

    updateNotifications(data ?? [])
    setLoading(false);
  }

  const CircleCheckIcon = () => (
    <div className="relative flex justify-center w-5 h-5 translate-y-[2px]">
      <CheckIcon className="w-[18px] h-[18px] translate-x-[1px] translate-y-[-3px] absolute text-primary" />
      <CircleIcon className="w-4 h-4 group-hover:text-zinc" />
    </div>
  )

  return (
    <Button onClick={e => markAllAsRead(e)} variant="ghost" size="sm" className="group group-hover:text-primary px-0 ml-auto mr-10 text-xs font-semibold text-zinc-700 dark:text-zinc-50 hover:bg-transparent gap-1">
      <CircleCheckIcon /> Mark all as read
    </Button>
  )
}