"use client";

import { useEffect, useState } from "react";

/**
 * Wraps the site-wide Nav/Footer and hides them when the current page is
 * rendered inside an iframe (e.g. the registration-consent PolicyModal
 * popup), so the popup shows a clean document instead of the whole site
 * chrome nested inside itself.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    try {
      setIsEmbedded(window.self !== window.top);
    } catch {
      // Cross-origin access to window.top throws; being unable to read it
      // at all is itself a strong signal that we're framed somewhere.
      setIsEmbedded(true);
    }
  }, []);

  if (isEmbedded) return null;
  return <>{children}</>;
}
