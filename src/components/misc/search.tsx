"use client"

import { use, useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { PresetSearchQuery, ProfileSearchQuery } from "../../../types/query-results";
import { createSupabaseClient } from "@/lib/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import Avatar from "../reusables/avatar";
import { capitalizeFirstLetter } from "@/lib/utils";
import { set } from "zod";
import { Small } from "../ui/typography";

export default function SearchBar() {
  const [profiles, setProfiles] = useState<ProfileSearchQuery[]>([])
  const [presets, setPresets] = useState<PresetSearchQuery[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const supabase = createSupabaseClient()
  const searchParams = useSearchParams();
  const { replace } = useRouter()
  const pathname = usePathname()

  const searchTerm = searchParams.get('query') || ''

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
      .from('profile')
      .select('username, avatar, profile_id, name')
      .ilike('username', `%${searchTerm}%`)
      .order('created_on', { ascending: false })
      .returns<ProfileSearchQuery[]>()

    return data
  }

  async function fetchPresets(searchTerm: string) {
    if (searchTerm.length <= 2) return null
    const { data } = await supabase
      .from('presets')
      .select('*, profile:profile_id(username, avatar)')
      .ilike('name', `%${searchTerm}%`)
      .order('created_on', { ascending: false })
      .returns<PresetSearchQuery[]>()

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

  const presetItems = [
    {
      name: 'Keyboard',
      presets: presets.filter(preset => preset.hardware === 'Keyboard'),
    },
    {
      name: 'Mouse',
      presets: presets.filter(preset => preset.hardware === 'Mouse'),
    },
    {
      name: 'Headset',
      presets: presets.filter(preset => preset.hardware === 'Headset'),
    },
    {
      name: 'Microphone',
      presets: presets.filter(preset => preset.hardware === 'Microphone'),
    }
  ]

  return (
    <div className="w-full h-full md:flex justify-center items-center relative hidden ">
      <Command className="max-w-[515px] my-auto h-auto absolute top-[6px] w-full ">
        <div className="bg-transparent">
          <CommandInput 
            onValueChange={val => {
              // 
              // fetchAll(val)
              handleSearch(val)

            }} 
            defaultValue={searchTerm}
            placeholder="Search" 
            className="my-auto bg-transparent" 
            onFocus={e => setOpen(true)} 
            onBlur={e => setOpen(false)}
          />
        </div>


        {open && <CommandList className=" h-full z-[1000]">
          {loading === false && <CommandEmpty>No results found.</CommandEmpty>}
          {loading && <Small>Loading...</Small>}
          {presetItems.map((item) => {
            return loading === false && item.presets.length > 0 && (
              <CommandGroup heading={capitalizeFirstLetter(item.name)} key={`${item.name}`}>
                {item.presets.map((preset) => (
                  <CommandItem key={`${item.name} - ${preset.preset_id}`} value={`${preset.name} - ${preset.preset_id}`}>{capitalizeFirstLetter(preset.name)}</CommandItem>
                ))}
              </CommandGroup>
            )
          })}

          {loading === false && profiles.length > 0 && <CommandGroup heading="Profiles" className="h-full">
            {profiles.map((profile) => (
              <CommandItem key={profile.profile_id} value={profile.username ?? ''}>
                <Avatar {...profile} />
                <p>{profile.name}</p>
              </CommandItem>
            ))}
          </CommandGroup>}
          {/* <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup> */}
        {loading === false && profiles.length > 8 || presetItems.some(item => item.presets.length > 8) && (
          <div>
            <Small>View More</Small>
          </div>
        )}
        </CommandList>}
      </Command>
    </div>

  )
}