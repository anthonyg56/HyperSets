import { capitalizeEachWord, cn } from "@/lib/utils";
import { Avatar as ShadAvatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ClassNameValue } from "tailwind-merge";

type Props = {
  avatar: string | null,
  username: string | null,
  name: string | null,
  classNames?: ClassNameValue,
}

export default function Avatar({ avatar, username, name, classNames }: Props) {
  const capitalized = capitalizeEachWord(name);
  const initials = extractFirstLetters(capitalized);
  const avatarSrc = avatar !== null ? avatar : "";

  function extractFirstLetters(input: string | null): string {
    if (!input) return '';
    return input.split(' ').map(word => word[0]).join('');
  }

  console.log(avatarSrc)
  return (
    <ShadAvatar className={cn(["", classNames])}>
      <AvatarImage src={avatarSrc} alt={`@${username}`} />
      <AvatarFallback>{initials}</AvatarFallback>
    </ShadAvatar>
  )
}
