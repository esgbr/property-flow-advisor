
// Import our centralized announce function
import { announce as accessibilityAnnounce } from './accessibilityUtils';

/**
 * Custom hook for announcing messages to screen readers
 * This is used to provide important updates via screen readers
 */

// Function to announce a message with configurable politeness
export function announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): void {
  accessibilityAnnounce(message, politeness);
}

// Custom hook to use the announcer
export default function useAnnouncement() {
  return { announce };
}
