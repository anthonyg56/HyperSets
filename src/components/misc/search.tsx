"use client"

import { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { createSupabaseClient } from "@/lib/supabase/client";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import Avatar from "../reusables/avatar";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Small } from "../ui/typography";
import { NavbarProfileQueryResults } from "../layout/navbar";
import { Tables } from "../../../types/supabase";
import SearchDisplay from "../displays/search-display";

export default function SearchBar({ isOpen, setIsOpen}: Props) {
  const supabase = createSupabaseClient()

  const [profiles, setProfiles] = useState<ProfileSearchQuery[]>([]);
  const [presets, setPresets] = useState<PresetSearchQuery[]>([]);

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const searchTerm = searchParams.get('query') || ''

  useEffect(() => {
    if (searchTerm !== '' && isOpen === true)
      fetchAll(searchTerm)
    else if (searchTerm !== '' && isOpen === false) {
      const params = new URLSearchParams(searchParams);

      params.delete('query')

      setPresets([])
      setProfiles([])

      replace(`${pathname}?${params.toString()}`);
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen === true)
      setIsOpen(false)
  }, [pathname])

  async function fetchAll(searchTerm: string) {
    setLoading(true)
    const [profiles, presets] = await Promise.all([
      fetchProfiles(searchTerm),
      fetchPresets(searchTerm),
    ])
    
    setProfiles(profiles ?? [])
    setPresets(presets ?? [])
    setLoading(false)
  }

  async function fetchProfiles(searchTerm: string) {
    if (searchTerm.length <= 2) return null
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar, profile_id, name')
      .ilike('username', `%${searchTerm}%`)
      .order('created_on', { ascending: false })
      .returns<ProfileSearchQuery[] | null>()

    return data
  }

  async function fetchPresets(searchTerm: string) {
    if (searchTerm.length <= 2) return null
    const { data } = await supabase
      .from('presets')
      .select('*, profile:profile_id(username, avatar)')
      .ilike('name', `%${searchTerm}%`)
      .order('created_on', { ascending: false })
      .returns<PresetSearchQuery[] | null>()

    return data
  }

  function handleSearch(search: string) {
    const params = new URLSearchParams(searchParams);
    const term = search.trim();

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    fetchAll(term)
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="w-full h-full md:flex justify-center items-center relative hidden">
      <CommandDialog open={isOpen} onOpenChange={val => {
        if (val === false) {
          setProfiles([])
          setPresets([])
        }

        setIsOpen(val)
      }}>
        <CommandInput 
          onValueChange={val => {
            // fetchAll(val)
            handleSearch(val)
          }}
          defaultValue={searchTerm}
          placeholder="Search" 
          className="my-auto bg-transparent max-w-[515px]"
        />

        <CommandList>
          {loading === false && presets.length === 0 && profiles.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty> 
          ) : loading === true ? (
            <CommandEmpty>Loading...</CommandEmpty>
          ) : <SearchDisplay loading={loading} presets={presets} profiles={profiles} />}
        </CommandList>
      </CommandDialog>
    </div>
  )
}

type Props = {
  isOpen: boolean,
  setIsOpen: (val: boolean) => void
}

export interface ProfileSearchQuery extends NavbarProfileQueryResults {}
export interface PresetSearchQuery extends Tables<'presets'> {
  profile: PresetProfileData
}

export type PresetProfileData = Pick<Tables<'profiles'>, 'username' | 'avatar'>