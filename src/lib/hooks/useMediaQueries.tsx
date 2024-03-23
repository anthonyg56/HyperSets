import React, { useEffect } from "react";

const componentType = typeof window === 'undefined' ? 'server' : 'client';

export default function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (componentType === 'server') return;

    const matchQueryList = window.matchMedia(query);
    matchQueryList.addEventListener("change", handleChange);

    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);

  useEffect(() => {
    if (componentType === 'server') return;
    
    const matchQueryList = window.matchMedia(query);
    const match = matchQueryList.matches;
    if (matches !== match) setMatches(match);
  }, [])

  function handleChange(e: any) {
    setMatches(e.matches);
  }

  return matches;
}