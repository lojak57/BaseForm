import React, { useState, useEffect } from 'react';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export const RotatingText: React.FC<RotatingTextProps> = ({
  words,
  interval = 3000, // Default to 3 seconds per word
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    // Create a fade-out/fade-in effect
    const changeWord = () => {
      // First fade out
      setIsVisible(false);
      
      // Wait for fade out animation to complete
      setTimeout(() => {
        // Change the word while it's invisible
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        setCurrentWord(words[(currentIndex + 1) % words.length]);
        
        // Then fade back in
        setIsVisible(true);
      }, 500); // Half a second for fade out
    };

    const timer = setInterval(changeWord, interval);
    return () => clearInterval(timer);
  }, [currentIndex, interval, words]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span 
        className={`
          absolute inset-0 transition-opacity duration-500 transform
          ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-3'}
        `}
      >
        {currentWord}
      </span>
      
      {/* This invisible span maintains the layout space */}
      <span className="invisible">
        {/* Use the longest word to determine space needed */}
        {words.reduce((longest, word) => 
          word.length > longest.length ? word : longest, ''
        )}
      </span>
    </span>
  );
}; 