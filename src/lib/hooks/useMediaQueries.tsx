import React, { useEffect } from "react";

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);
  const matchQueryList = window.matchMedia(query);

  useEffect(() => {
    matchQueryList.addEventListener("change", handleChange);

    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  useEffect(() => {
    const match = matchQueryList.matches;
    if (matches !== match) setMatches(match);
  }, [])

  function handleChange(e: any) {
    setMatches(e.matches);
  }
  return matches;
}