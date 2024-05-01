"use client"

import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type Props = {
  img: string | null;
  alt: string;
  gradient?: boolean; // for that image fade effect on profiles page
  overlay?: boolean; // default overlay
  children: React.ReactNode;
}

export default function BackgroundImage({ img, children, gradient, overlay }: Props) {
  const pathname = usePathname()

  return (
    <div className="relative h-full">
      <Image
        src={img ?? ""}
        alt="Alloys orgiins hero"
        width={0}
        height={0}
        sizes="100vw 100%"
        quality={100}
        className={cn([
          'absolute object-cover object-bottom w-full h-full -z-10', {
            'h-[350px] md:h-[750px] ': pathname.startsWith('/profile'),
            'h-[350px] md:h-full': pathname.startsWith('/presets/'),
          }
        ])}
      />
      <div className={cn(["w-full h-full", {
        'bg-gradient-to-b md:bg-gradient-to-l from-transparent from-0% to-[#0a0a0a] to-40% md:to-70% text-white': overlay,
        'bg-gradient-to-b from-transparent from-0% to-[#0a0a0a] to-[18%] md:to-50%': gradient,
      } ])}>
        {children}
      </div>
    </div>
  )
}