import { useState, useEffect, useRef } from 'react';
import useAnimatedPlaceholder from '../../hooks/useAnimatedPlaceholder';
import './styles.css';


const AnimatedInput = () => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef(null);
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
    }
  };

  // Focus handler to hide placeholder
  const handleFocus = () => {
    setIsFocused(true);
    // No need for select() on div, but we could implement selection via Range API if needed
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
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter adds a newline - let default behavior happen
        return;
      } else {
        // Just Enter submits the form
        e.preventDefault();
        if (value.trim()) {
          onSubmit(value);
        }
      }
    }
  };

  // Update div content when value changes (useful for clearing after submit)
  useEffect(() => {
    if (divRef.current && divRef.current.innerText.trim() !== value) {
      divRef.current.innerText = value;
      
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
      {isAnimating && (
        <div className="placeholder-text">
          {displayText}
          <span className="cursor-blink"></span>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
