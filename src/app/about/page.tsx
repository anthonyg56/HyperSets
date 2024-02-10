import Image from "next/image";
import Banner from '../../../public/cozy-setup.jpg'
import { H2, P } from "@/components/ui/typography";

export default function Page() {
  return (
    <>
    <div className="h-[700px] overflow-hidden">
      <Image
        src={Banner}
        alt='Hero Banner'
        quality={100}
        className="w-full h-full object-[50%_85%] object-cover"
      />
    </div>
    <div className="container text-center pt-8">
      <H2 classNames="inline-block mx-auto">About Us</H2>
      
      <P classNames="max-w-[1000px] mx-auto">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with: The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.</P>
    </div>
    </>
  )
}