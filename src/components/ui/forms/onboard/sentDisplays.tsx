import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Small } from "@/components/ui/typography";
import Title from "@/components/reusables/title";
import { Button } from "../../buttons/button";

type Props = {
  resetView: () => void
}
export function PasswordSentDisplay({ resetView }: Props) {
  return (
    <div className="">
      <Title title="Email Sent" subTitle="Check your email for the recovery link." center iconProps={{ icon: faEnvelope, }} />
      <Button variant="secondary" className="w-full" onClick={e => {
        e.preventDefault()
        resetView()
      }}>Resend</Button>
      <Small classNames="w-full text-center block pt-4 font-normal text-muted-foreground">Return back to <Link href={'/login'} className="text-primary">Login</Link></Small>
    </div>
  )
}
