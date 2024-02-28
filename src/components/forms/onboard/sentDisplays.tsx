import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Title from "../../titles/core";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Small } from "@/components/ui/typography";

export function PasswordSentDisplay() {
  return (
    <div className="">
      <Title title="Email Sent" subTitle="Check your email for the recovery link." center iconProps={{ icon: faEnvelope, }} />
      <div className="flex flex-row gap-x-4">
        <Button className="w-full"><a href="https://www.gmail.com" className="decoration-[none]">Open Gmail</a></Button>
        <Button variant="secondary" className="w-full"><Link href="/forgot">Resend</Link></Button>
      </div>
      <Small classNames="w-full text-center block pt-4 font-normal text-muted-foreground">Return back to <Link href={'/login'} className="text-primary">Login</Link></Small>
    </div>
  )
}
