import Link from "next/link";
import Avatar from "../reusables/avatar";
import { ProfileNavQuery } from "../../../types/query-results";

type Props = {
  profile: ProfileNavQuery | null;
}

export default function ProfileButton({ profile }: Props) {
  if (!profile) return null

  const { avatar, name, username } = profile

  return (
    <Link href={`/profile/${username}`} className="px-1">
      <Avatar
        avatar={avatar}
        name={name}
        username={username}
        classNames="w-[30px] h-[30px] md:hidden"
      />
    </Link>
  )
}