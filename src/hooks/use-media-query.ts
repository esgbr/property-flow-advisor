
import { useState, useEffect } from 'react';

/**
 * Hook für die reaktive Abfrage von Medienmerkmalen
 * @param query Die Medienabfrage als String, z.B. "(min-width: 768px)"
 * @returns Ein Boolean, der angibt, ob die Medienabfrage übereinstimmt
 */
export function useMediaQuery(query: string): boolean {
  // Prüfen auf Server-seitiges Rendering
  const getMatches = (): boolean => {
    // Stellen Sie sicher, dass wir im Browser sind, bevor matchMedia aufgerufen wird
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  // Effekt zum Aktualisieren des Statuswerts, wenn das Fenster die Größe ändert
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Aktualisieren Sie den Status wenn sich die Übereinstimmung ändert
    const handler = (): void => setMatches(mediaQuery.matches);
    
    // Fügen Sie den Ereignis-Listener hinzu
    mediaQuery.addEventListener('change', handler);
    
    // Anfangszustand überprüfen und setzen
    setMatches(mediaQuery.matches);
    
    // Ereignislistener beim Aufräumen entfernen
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Hook zur Überprüfung der Mobilansicht
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

// Hook zur Überprüfung der Tablet-Ansicht
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

// Hook zur Überprüfung der Desktop-Ansicht
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

export default useMediaQuery;
