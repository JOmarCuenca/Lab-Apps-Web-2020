import { useState, useEffect} from 'react';

/**
 * Está función se encarga de calcular
 * el tamaño de la pantalla
 */
export const useWindowSize = () => {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return windowSize;
}

/**
 * This function gets the current date of the pc and returns the date at 0:00.
 * 
 * @returns Date
 */
export function getToday(){
  const now = new Date();
  return new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0);
}