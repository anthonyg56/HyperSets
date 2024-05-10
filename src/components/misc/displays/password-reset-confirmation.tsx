import Link from "next/link";
import Title from "../title";
import { Button } from "../../ui/button";

export default function PasswordResetConfirmationDisplay() {
  return (
    <div className="container max-w-[400px] min-h-[calc(100vh_-_57px)] flex flex-col justify-center items center h-full">
      <Title
        title='Success!'
        subTitle='Your password has been successfully reset. Click below to log in magically.'
        center
      />
      <div className="flex flex-col space-y-4">
        <Button type="submit" className="w-full"><Link href="/login">Login</Link></Button>
      </div>
    </div>
  )
}