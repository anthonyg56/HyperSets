export default function capitalizeEachWord(str: string): string {
  const words = str.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" ");
}

export function capitalizeFirstLetter(str: string): string {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
}