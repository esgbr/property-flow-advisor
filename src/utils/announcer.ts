import { useEffect, useRef } from 'react';

/**
 * Hook for managing screen reader announcements
 * Uses aria-live regions to announce important changes to screen readers
 */
function useAnnouncement() {
  // Keep track of announcement elements
  const politeAnnouncerRef = useRef<HTMLDivElement | null>(null);
  const assertiveAnnouncerRef = useRef<HTMLDivElement | null>(null);

  // Initialize announcers when component mounts
  useEffect(() => {
    // Create polite announcer (for non-urgent info)
    if (!politeAnnouncerRef.current) {
      const politeElement = document.createElement('div');
      politeElement.setAttribute('aria-live', 'polite');
      politeElement.setAttribute('aria-atomic', 'true');
      politeElement.setAttribute('role', 'status'); 
      politeElement.className = 'sr-only';
      document.body.appendChild(politeElement);
      politeAnnouncerRef.current = politeElement;
    }

    // Create assertive announcer (for urgent info)
    if (!assertiveAnnouncerRef.current) {
      const assertiveElement = document.createElement('div');
      assertiveElement.setAttribute('aria-live', 'assertive');
      assertiveElement.setAttribute('aria-atomic', 'true');
      assertiveElement.setAttribute('role', 'alert');
      assertiveElement.className = 'sr-only';
      document.body.appendChild(assertiveElement);
      assertiveAnnouncerRef.current = assertiveElement;
    }

    // Cleanup when component unmounts
    return () => {
      if (politeAnnouncerRef.current) {
        document.body.removeChild(politeAnnouncerRef.current);
        politeAnnouncerRef.current = null;
      }
      if (assertiveAnnouncerRef.current) {
        document.body.removeChild(assertiveAnnouncerRef.current);
        assertiveAnnouncerRef.current = null;
      }
    };
  }, []);

  /**
   * Announce a message to screen readers
   * @param message The message to announce
   * @param politeness The politeness level of the announcement
   */
  const announce = (
    message: string, 
    politeness: 'polite' | 'assertive' = 'polite'
  ) => {
    // Get the appropriate announcer
    const announcer = politeness === 'assertive' 
      ? assertiveAnnouncerRef.current 
      : politeAnnouncerRef.current;

    // Make the announcement
    if (announcer) {
      // Clear previous announcement first (important for same text announcements)
      announcer.textContent = '';
      
      // Use setTimeout to force browser to recognize the change
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
    }
  };

  /**
   * Announce a page title to screen readers
   * @param title The page title to announce
   */
  const announcePageChange = (title: string) => {
    announce(`Page changed: ${title}`, 'polite');
  };

  return { announce, announcePageChange };
}

export default useAnnouncement;
