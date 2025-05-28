import { useState, useEffect, useRef } from 'react';
import useAnimatedPlaceholder from '../../hooks/useAnimatedPlaceholder';
import './styles.css';


const AnimatedTextarea = () => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const { displayText, resetAnimation, isAnimating } = useAnimatedPlaceholder({ isInputEmpty: !value, isFocused });

  const onSubmit = (text) => {
    alert(text);
    setValue('');
  };

  // Auto resize the textarea based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to default to correctly calculate the new height
      textarea.style.height = 'auto';
      // Set the height based on scrollHeight (content height)
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Initialize height adjustment when component mounts
  useEffect(() => {
    adjustHeight();
  }, []);

  // Handle auto-resizing when content changes
  useEffect(() => {
    if (value) {
      adjustHeight();
    }
  }, [value]);

  // Focus handler to highlight text on click and hide placeholder
  const handleFocus = () => {
    setIsFocused(true);
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  // Blur handler to show placeholder when textarea loses focus and is empty
  const handleBlur = () => {
    setIsFocused(false);
    resetAnimation();
  };

  // Handle keyboard events - Enter to submit, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter adds a newline - default behavior
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

  return (
    <div className="animated-textarea-container">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="animated-textarea"
        rows={5}
        placeholder=""
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

export default AnimatedTextarea;
