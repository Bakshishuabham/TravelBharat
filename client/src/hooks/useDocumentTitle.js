import { useEffect } from 'react';

/**
 * Sets document.title dynamically per page.
 * @param {string} title - Page-specific title
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} – TravelBharat`
      : 'TravelBharat – Explore India State by State';
    return () => {
      document.title = 'TravelBharat – Explore India State by State';
    };
  }, [title]);
}
