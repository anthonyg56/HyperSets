import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodRawShape, z } from "zod";
import moment from "moment";

export const newTodayDate = moment();

export function convertDate(date: string) {
  return moment(date).format("MMMM Do YYYY, h:mm a");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeEachWord(str: string | null): string | null {
  if (!str) return null;

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

export function checkFileType(file: File) { // Verifies that the file type is an image
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (fileType === "webp" || fileType === "jpg" || fileType === "png" || fileType === "")
      return true;
  }
  return false;
}

// Cool little abstraction i made overthinking a problem, 
// could be useful in the future if somethings needs to happen directly after validation... outside of hooks :/
export function validateSchema<T extends ZodRawShape>(formData: unknown, schema: z.ZodObject<T>) {
  const results = schema.safeParse(formData)

  if (!results.success) {
    return null
  }

  return results.data
}

type ValueOf<T> = T[keyof T];

type NonEmptyArray<T> = [T, ...T[]]

type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

export function stringUnionToArray<T>() {
  return <U extends NonEmptyArray<T>>(...elements: MustInclude<T, U>) => elements;
}