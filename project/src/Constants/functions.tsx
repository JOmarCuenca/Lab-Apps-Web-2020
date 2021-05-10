import { useState, useEffect} from 'react';
import { MEDITATION_TYPES } from './constants';

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

/**
 * Returns a more readable form of a big number
 * @returns string Ej. "2K"
 */
export function usersPrettify(numUsers : number) : string {
  let users : string;
  if(numUsers < 0)
    return "...";
  else if(numUsers > 1000000) // Millions
    users = `${Math.trunc(numUsers/1000000)}M`;
  else if(numUsers > 1000) // Thousands
    users = `${Math.trunc(numUsers/1000)}K`;
  else
    users = `${numUsers}`;
  return users;
}

/**
     * Function that returns the name of the meditation desired.
     * @param m Type of meditation
     * @returns Name of the meditation
     */
export function getMeditiationName(m: MEDITATION_TYPES): string {
  switch (m) {
      case MEDITATION_TYPES.ZEN:
          return "ZEN";
      case MEDITATION_TYPES.SHINTO:
          return "SHINTO";
      case MEDITATION_TYPES.BUDHA:
          return "BUDHA";
      case MEDITATION_TYPES.TIBET:
          return "TIBET";
      case MEDITATION_TYPES.CHAKRA:
          return "CHAKRA";
      case MEDITATION_TYPES.PSY:
          return "PSY";
  }
}