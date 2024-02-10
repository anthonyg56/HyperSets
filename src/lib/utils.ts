import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeEachWord(str: string): string {
  const words = str.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" ");
}

export function capitalizeFirstLetter(str: string): string {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractYouTubeVideoId(url: string) {
  var regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\/)?(?:(?:watch|embed)(?:\?v=|\/)?|list=(?:\w+&)?)([\w\-]+))(?:\S+)?$/;
  var match = url.match(regex);
  if (match) {
      return match[6]; // The video ID is in the 6th group of the match.
  } else {
      return null; // If the URL doesn't match the regex, return null.
  }
}
