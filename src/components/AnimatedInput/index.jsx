import { useState, useEffect, useRef } from 'react';
import useAnimatedPlaceholder from '../../hooks/useAnimatedPlaceholder';
import useDebounce from '../../hooks/useDebounce';
import { agents } from '../../config';
import './styles.css';

// Import utility functions
import { detectAndReplaceAgentNames } from './utils/agentUtils';
import { handleBackspaceKey, handleEnterKey } from './utils/keyboardUtils';


const AnimatedInput = () => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef(null);
  const debounce = useDebounce(500); // Use our custom hook with 500ms delay
  const { displayText, resetAnimation, isAnimating } = useAnimatedPlaceholder({ 
    isInputEmpty: !value || value.trim() === '',
    isFocused 
  });

  const onSubmit = (text) => {
    alert(text);
    setValue('');
    if (divRef.current) {
      divRef.current.innerHTML = '';
    }
  };
  
  // Handle content changes
  const handleInput = () => {
    if (divRef.current) {
      const text = divRef.current.innerText.trim();
      setValue(text);
      
      // Debounce the detection and replacement of agent names
      debounce(() => {
        console.log('Checking for agent names...');
        detectAndReplaceAgentNames(divRef.current, agents, setValue);
      });
    }
  };

  // Focus handler to hide placeholder
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Blur handler to show placeholder when div loses focus and is empty
  const handleBlur = () => {
    setIsFocused(false);
    // Only reset animation if the div is empty
    if (!value || value.trim() === '') {
      resetAnimation();
    }
  };

  // Handle keyboard events - Enter to submit, Shift+Enter for newline
  const handleKeyDown = (e) => {
    // Check for a backspace to handle chips deletion
    if (e.key === 'Backspace') {
      if (handleBackspaceKey(e)) {
        return;
      }
    }
    
    if (e.key === 'Enter') {
      handleEnterKey(e, value, onSubmit);
    }
  };

  // Update div content when value changes (useful for clearing after submit)
  useEffect(() => {
    if (divRef.current && value === '' && divRef.current.innerHTML !== '') {
      divRef.current.innerHTML = '';
      
      // If the value is cleared, ensure the animation can restart
      if (!value || value.trim() === '') {
        resetAnimation();
      }
    }
  }, [value, resetAnimation]);
  
  return (
    <div className="input-container">
      <div
        ref={divRef}
        className="input"
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      { isAnimating && (
        <div className="placeholder-text">
          {displayText}
          <span className="cursor-blink"></span>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
