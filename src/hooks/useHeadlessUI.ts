import { useRef, useEffect } from 'react';

/**
 * Custom hook to handle Headless UI focus trapping
 * This ensures that focus is properly managed when using Headless UI components
 * with TypeScript strict mode
 */
export function useFocusTrap<T extends HTMLElement>(initialFocus = true): React.RefObject<T> {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (initialFocus && elementRef.current) {
      const focusableElements = elementRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [initialFocus]);

  return elementRef;
}

/**
 * Custom hook to handle Headless UI outside click detection
 * This ensures that clicks outside of a component are properly detected
 */
export function useOutsideClick<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

/**
 * Custom hook to handle Headless UI escape key detection
 * This ensures that pressing the escape key is properly detected
 */
export function useEscapeKey(callback: () => void): void {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [callback]);
}
