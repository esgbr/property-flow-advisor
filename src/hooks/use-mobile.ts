
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener to check on window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
};

export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIfTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    // Check on initial load
    checkIfTablet();

    // Add event listener to check on window resize
    window.addEventListener('resize', checkIfTablet);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkIfTablet);
  }, []);

  return isTablet;
};

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Check on initial load
    checkIfDesktop();

    // Add event listener to check on window resize
    window.addEventListener('resize', checkIfDesktop);

    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  return isDesktop;
};

export const useScreenSize = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  return { isMobile, isTablet, isDesktop };
};
