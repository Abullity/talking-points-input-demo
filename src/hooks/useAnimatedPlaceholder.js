import { useState, useEffect } from 'react';

const defaultPlaceholders = [
  'Give me a debate between Alex Epstein and Greta Thunberg on net-zero energy',
  'Show me talking points on climate change from both liberal and conservative perspectives',
  'Provide key arguments for and against nuclear energy',
  'What are the main points in the debate about universal healthcare?',
  'Give me talking points on artificial intelligence regulation'
];

/**
 * Custom hook for creating animated placeholder text that cycles through examples
 * with typing and deleting animations.
 * 
 * @param {Object} options - Configuration options
 * @param {string[]} options.placeholders - Array of placeholder texts to cycle through
 * @param {boolean} options.isInputEmpty - Whether the input field is empty
 * @param {boolean} options.isFocused - Whether the input field is focused
 * @returns {Object} States and values for the animated placeholder
 */
const useAnimatedPlaceholder = ({
  placeholders = defaultPlaceholders,
  isInputEmpty = true,
  isFocused = false
}) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  
  // Manage the typing and deleting animation
  useEffect(() => {
    if (isInputEmpty && !isFocused) { // Only animate when input is empty and not focused
      let timeout;
      
      if (isTyping) {
        if (displayText.length < currentPlaceholder.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentPlaceholder.substring(0, displayText.length + 1));
          }, 100); // Typing speed
        } else {
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, 2000); // Pause at the end of typing
        }
      } else {
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(displayText.substring(0, displayText.length - 1));
          }, 50); // Deleting speed (faster than typing)
        } else {
          // Choose a random placeholder that's different from the current one
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * placeholders.length);
          } while (randomIndex === placeholderIndex && placeholders.length > 1);
          
          setPlaceholderIndex(randomIndex);
          setCurrentPlaceholder(placeholders[randomIndex]);
          setIsTyping(true);
        }
      }
      
      return () => clearTimeout(timeout);
    }
  }, [displayText, isTyping, currentPlaceholder, placeholderIndex, placeholders, isInputEmpty, isFocused]);

  /**
   * Reset the animation when the input loses focus and is empty
   */
  const resetAnimation = () => {
    if (isInputEmpty) {
      setDisplayText('');
      setIsTyping(true);
      
      // Choose a random placeholder for the reset
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      setPlaceholderIndex(randomIndex);
      setCurrentPlaceholder(placeholders[randomIndex]);
    }
  };

  return {
    displayText,
    resetAnimation,
    isAnimating: isInputEmpty && !isFocused
  };
};

export default useAnimatedPlaceholder;
