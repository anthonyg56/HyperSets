import Image from "next/image";
import Link from "next/link";
import { Small } from "../ui/typography";
import { HardwareCard } from "@/lib/data";
import { cn } from "@/lib/utils";

type Props = {
  hardware: HardwareCard;
}

export default function HardwareCard({ hardware }: Props) {
  const { classNames, gradient, name, photo, table } = hardware

  return (
    <Link href={`/presets/${table}`} className={cn([
      'text-center w-full h-full z-50',
      classNames
    ])}>
      <div className='flex-col bg-hyper-dark-white w-full flex relative justify-center h-full mb-5 rounded-md overflow-hidden'>
        <Image
          src={photo.src}
          alt={photo.alt}
          sizes="100vw"
          quality={100}
          className="object-contain h-full w-full"
        />
        <Image
          src={gradient.src}
          alt={gradient.alt}
          sizes="100vh"
          quality={100}
          className='shadow-[0_8px_30px_rgb(0,0,0,0.12)] absolute z-[-5] object-cover h-full w-full'
        />
        <Small>{name}</Small>
      </div>
    </Link>
  )
}