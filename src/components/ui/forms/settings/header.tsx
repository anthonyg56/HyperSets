"use client"

import { Button } from "@/components/ui/buttons/button";
import { H3, H4, Muted } from "@/components/ui/typography";

type Props = {
  isSubmitting: boolean;
  mode: 'edit' | 'view';
  setMode: (mode: 'edit' | 'view') => void;
  title: string;
  subtitle: string;
}

export default function SettingsHeader({ mode, setMode, title, subtitle, isSubmitting }: Props) {
  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col">
        <H3>{title}</H3>
        <Muted>{subtitle}</Muted>
      </div>
      <div className="flex flex-row ml-auto gap-x-4">
        {mode === 'edit' && <Button variant="secondary" type="submit" disabled={isSubmitting}>Save Changes</Button>}
        {mode === 'edit' && <Button variant="destructive" type="button" onClick={e => setMode('view')}>Cancel</Button>}
        {mode === 'view' && <Button variant="secondary" type="button" onClick={e => setMode('edit')}>Edit</Button>}
      </div>
    </div>
  )
}