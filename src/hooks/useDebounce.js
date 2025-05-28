import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param {number} delay - Delay in milliseconds before executing the function
 * @returns {Function} - Debounced function wrapper
 */
const useDebounce = (delay = 300) => {
  const timerRef = useRef(null);

  // Clear the timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Debounce function
  const debounce = useCallback((fn) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      fn();
      timerRef.current = null;
    }, delay);
  }, [delay]);

  return debounce;
};

export default useDebounce;
