"use client"
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Test from '@public/cozy-setup.jpg'

type Props = {
  banner: string | null;
}

export default function ProfileBackground({ banner }: Props) {
  const { theme } = useTheme()

  return (
    <>
          <Image
        src={banner ?? Test}
        alt="Alloys orgiins hero"
        fill
        quality={100}
        className={cn([
          'absolute -z-10 object-cover object-left',
          '',
          ''
        ])}
      />
    </>
  )
}