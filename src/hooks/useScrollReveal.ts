import { useState, useEffect, useRef, RefObject } from 'react';

// Options for the hook
interface UseScrollRevealOptions {
  threshold?: number;       // How much of the element needs to be visible (0-1)
  delay?: number;           // Delay before animation starts (ms)
  rootMargin?: string;      // Margin around the root
  triggerOnce?: boolean;    // Whether to trigger only once
}

/**
 * Hook that reveals elements when they enter the viewport
 */
export const useScrollReveal = <T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T>, boolean] => {
  const {
    threshold = 0.1,
    delay = 0,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleDelay = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting) {
        // If no delay, reveal immediately
        if (delay === 0) {
          setIsVisible(true);
        } else {
          // Otherwise wait for the delay
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
        
        // Unobserve if only triggering once
        if (triggerOnce && observer) {
          observer.unobserve(element);
        }
      } else if (!triggerOnce) {
        // If not trigger once, hide when out of view
        setIsVisible(false);
      }
    };

    const observer = new IntersectionObserver(handleDelay, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [threshold, delay, rootMargin, triggerOnce]);

  return [ref, isVisible];
}; 