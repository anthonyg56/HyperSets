import React, { useEffect } from "react";

const componentType = typeof window === 'undefined' ? 'server' : 'client';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);
  if (componentType === 'server') return null;
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