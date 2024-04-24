"use client"

import { Button } from "@/components/ui/buttons/button";
import { createSupabaseClient } from "@/lib/supabase/client";
import { DownloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useToast } from "../use-toast";
import { Tables } from "../../../../types/supabase";

type Props = {
  downloads: number,
  preset_id: number,
  download_url: string,
  profile_id?: number,
}

export default function DownloadPresetButton({ preset_id, download_url, profile_id, downloads }: Props) {
  /* Before routing the user to the download page, we need to communicate with the database first for some operations. Once that is done, this will update to true and via useEffect; the user will be redirected to the download page. */
  const [downloadUpdated, setDownloadUpdated] = useState(false)

  /* This state is used to check if the user has already downloaded the preset. If they have, we will update the row instead of inserting a new one. */
  const [userDownloadRow, setUserDownloadRow] = useState<Tables<'downloads'> | null>(null)

  const { toast } = useToast()

  const supabase = createSupabaseClient()
  
  /* Routes user to download page after download is updated */
  useEffect(() => {
    if (downloadUpdated) {
      window.location.assign(download_url);
    }
  }, [downloadUpdated, download_url])

  useEffect(() => {
    async function checkIfDownloaded() {
      if (!profile_id) return

      const { data } = await supabase
        .from('downloads')
        .select('*')
        .eq('profile_id', profile_id)
        .eq('preset_id', preset_id)
        .single()

      setUserDownloadRow(data)
    }

    checkIfDownloaded()
  }, [])

  async function increaseDownload(e: any) {
    e.preventDefault()

    if (!profile_id) return

    try {
      await supabase
        .from('downloads')
        .update({ downloaded: downloads + 1 })
        .eq('profile_id', profile_id)
        .eq('preset_id', preset_id)
        .then(async ({ data, error }) => {
          if (error) {
            throw error
          } else if (userDownloadRow !== null) {
            /* If there is a row, update the downloaded count */
            await supabase
              .from('downloads')
              .update({ downloaded: userDownloadRow.downloaded + 1 })
          } else {
            /* If there is no row, insert a new one */
            await supabase
              .from('downloads')
              .insert({ profile_id, preset_id, downloaded: 1 })
          }

          setDownloadUpdated(true)

          return { data, error }  
        })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error trying to the file, please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Button variant={"default"} className="flex flex-row gap-x-1" onClick={increaseDownload}>
      <DownloadIcon width={18} height={18} /> Download
    </Button>
  )
}