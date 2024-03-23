"use client"

import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type Props = {
  preset_id: number,
  download_url: string,
  profile_id: number | null,
}

export default function DownloadPresetButton({ preset_id, download_url, profile_id }: Props) {
  const [downloadAdded, setDownloadAdded] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (downloadAdded) {
      window.location.assign(download_url);
    }
  }, [downloadAdded])

  async function increaseDownload(e: any) {
    e.preventDefault()

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