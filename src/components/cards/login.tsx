import Image from 'next/image'
import HeroImage from '../../../public/cozy-setup.jpg'
import LoginForm from '../forms/login'
import { cn } from '@/lib/utils'
import { Card } from '../ui/card'
import Title from '../titles/core'

export default function LoginCard() {
  return (
    <Card className={cn([
      "flex flex-col h-full overflow-hidden w-full self-start my-auto items-center",
      "md:flex-col-reverse md:h-[1000px] md:w-full",
      "lg:h-[650px] lg:grid lg:grid-cols-[40%_60%]",
    ])}>
      <div className='flex flex-col w-full h-full justify-center items-center py-10'>
        <Title title="Welcome Back" subTitle="Welcome back! Please enter your details." center/>
        <LoginForm />
      </div>

      <Image
        src={HeroImage}
        alt="Hero"
        quality={100}
        className={cn([
          "object-cover object-[75%_50%] h-full hidden ",
          "md:table-cell",
        ])}
      />
    </Card>
  )
}