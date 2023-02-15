import { useEffect, useState } from 'react';

export const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    handleResize();
  }, []);

  function handleResize() {
    setWindowHeight(window?.innerHeight);
  }

  return {
    windowHeight,
  };
};
