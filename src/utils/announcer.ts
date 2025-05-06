
import { useState, useCallback } from 'react';

type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Custom hook for making announcements to screen readers
 */
const useAnnouncement = () => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  /**
   * Announce a message to screen readers
   * @param message Message to announce
   * @param priority Politeness level ('polite' or 'assertive')
   */
  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 100);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 100);
    }
  }, []);

  return {
    announce,
    politeMessage,
    assertiveMessage
  };
};

export default useAnnouncement;
