import { CheckIcon, CircleIcon } from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import { createSupabaseClient } from "@/lib/supabase/client";

type Props = {
  setRevalidate: (value: boolean) => void,
  profile_id: number | null,
}

export default function  MarkAsReadButton({ setRevalidate, profile_id }: Props) {
  const supabase = createSupabaseClient();

  async function markAllAsRead() {
    if (!profile_id) return;
    await supabase.from("notifications").update({ unread: false }).eq("retriver_id", profile_id);
    setRevalidate(true);
  }

  const CircleCheckIcon = () => (
    <div className="relative flex justify-center w-5 h-5 translate-y-[2px]">
      <CheckIcon className="w-[18px] h-[18px] translate-x-[1px] translate-y-[-3px] absolute text-primary" />
      <CircleIcon className="w-4 h-4 group-hover:text-zinc" />
    </div>
  )

  return (
    <Button onClick={e => markAllAsRead()} variant="ghost" size="sm" className="group group-hover:text-primary px-0 ml-auto mr-10 text-xs font-semibold text-zinc-700 dark:text-zinc-50 hover:bg-transparent gap-1">
      <CircleCheckIcon /> Mark all as read
    </Button>
  )
}