import { useEffect } from 'react';
import { BUSINESS_NAME } from '../data/constants';

// Hook to set page title and meta description
export function useSEO({ title, desc }) {
  useEffect(() => {
    document.title = title ? `${title} | ${BUSINESS_NAME}` : BUSINESS_NAME;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc || "");
  }, [title, desc]);
}