/**
 * Dua Organics — Scroll to Top Component
 * 
 * Automatically scrolls to the top of the page when
 * the route changes. Essential for SPA navigation.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
