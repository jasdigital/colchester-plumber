import { useEffect, useState } from 'react';

// Simple hash-based router hook
export function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#/, "") || "/");
  
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#/, "") || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  
  const navigate = (to) => {
    if (!to.startsWith("#")) window.location.hash = to;
    else window.location.hash = to.replace(/^#/, "");
  };
  
  return { route, navigate };
}