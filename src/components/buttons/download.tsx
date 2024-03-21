"use client"

import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type Props = {
  preset_id: number,
  download_url: string,
  user_id: string | null,
}

export default function DownloadPresetButton({ preset_id, download_url, user_id }: Props) {
  const [downloadAdded, setDownloadAdded] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (downloadAdded) {
      window.location.assign(download_url);
    }
  }, [downloadAdded])

  async function increaseDownload(e: any) {
    let profile_id: number | undefined = undefined

    if (user_id) {
      const { data: currentProfile } = await supabase
        .from('profile')
        .select('profile_id')
        .eq('user_id', user_id)
        .single()

      profile_id = currentProfile?.profile_id
    }

    await supabase
      .from('downloads')
      .insert({ preset_id, profile_id })

    setDownloadAdded(true)
  }

  return (
    <Button variant={"default"} className="flex flex-row gap-x-1" onClick={increaseDownload}>
      <DownloadIcon width={18} height={18} /> Download
    </Button>
  )
}