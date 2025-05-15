import React, { CSSProperties, HTMLAttributes, forwardRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

// Animation types
export type RevealAnimation = 
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down';

// Animation durations
export type RevealDuration = 'fast' | 'normal' | 'slow';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  animation?: RevealAnimation;
  duration?: RevealDuration;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

/**
 * A component that reveals its children when scrolled into view.
 */
export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ 
    animation = 'fade-up', 
    duration = 'normal', 
    delay = 0, 
    threshold = 0.1,
    triggerOnce = true,
    className, 
    style, 
    children,
    ...props 
  }, forwardedRef) => {
    const [ref, isVisible] = useScrollReveal<HTMLDivElement>({
      threshold,
      delay,
      triggerOnce,
    });

    // Map animation types to CSS classes
    const getAnimationClass = (animation: RevealAnimation) => {
      switch (animation) {
        case 'fade-up':    return 'translate-y-10 opacity-0';
        case 'fade-down':  return 'translate-y-[-10px] opacity-0'; 
        case 'fade-left':  return 'translate-x-10 opacity-0';
        case 'fade-right': return 'translate-x-[-10px] opacity-0';
        case 'zoom-in':    return 'scale-95 opacity-0';
        case 'zoom-out':   return 'scale-105 opacity-0';
        case 'flip-up':    return 'rotateX(-10deg) opacity-0';
        case 'flip-down':  return 'rotateX(10deg) opacity-0';
        default:           return 'opacity-0';
      }
    };

    // Map durations to CSS classes
    const getDurationClass = (duration: RevealDuration) => {
      switch (duration) {
        case 'fast':   return 'duration-300';
        case 'slow':   return 'duration-1000';
        default:       return 'duration-700';
      }
    };

    // Combine all our classes
    const revealClass = cn(
      // Base transition class
      'transition-all ease-out',
      // Animation duration class
      getDurationClass(duration),
      // Initial transformation class (before revealing)
      !isVisible && getAnimationClass(animation),
      // Apply the custom className
      className,
    );

    // Apply inline styles for the transform CSS property when needed
    const combinedStyle: CSSProperties = {
      ...style,
      // Only add transform for flip animations when not visible
      transform: !isVisible && (animation === 'flip-up' || animation === 'flip-down') 
        ? `perspective(1000px) ${animation === 'flip-up' ? 'rotateX(-10deg)' : 'rotateX(10deg)'}`
        : style?.transform,
      opacity: isVisible ? 1 : 0,
    };

    // Use the forwarded ref if provided, otherwise use our internal ref
    const combinedRef = (node: HTMLDivElement) => {
      // Apply the forwarded ref if it exists
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
      
      // Apply our internal ref
      if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div
        ref={combinedRef}
        className={revealClass}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Reveal.displayName = 'Reveal'; 