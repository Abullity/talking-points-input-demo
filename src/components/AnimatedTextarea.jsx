import { useState, useEffect, useRef } from 'react';
import './AnimatedTextarea.css';

const AnimatedTextarea = ({ 
  onChange, 
  value, 
  className = '', 
  rows = 5,
  disabled = false,
  onSubmit = () => {}
}) => {
  const placeholders = [
    'Give me a debate between Alex Epstein and Greta Thunberg on net-zero energy',
    'Show me talking points on climate change from both liberal and conservative perspectives',
    'Provide key arguments for and against nuclear energy',
    'What are the main points in the debate about universal healthcare?',
    'Give me talking points on artificial intelligence regulation'
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  
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

  // Handle auto-resizing when content changes
  useEffect(() => {
    if (value) {
      adjustHeight();
    }
  }, [value]);

  // Initialize height adjustment when component mounts
  useEffect(() => {
    adjustHeight();
  }, []);
  
  // Manage the typing and deleting animation
  useEffect(() => {
    if (!value && !isFocused) { // Only animate when textarea is empty and not focused
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
          // Move to the next placeholder
          const nextIndex = (placeholderIndex + 1) % placeholders.length;
          setPlaceholderIndex(nextIndex);
          setCurrentPlaceholder(placeholders[nextIndex]);
          setIsTyping(true);
        }
      }
      
      return () => clearTimeout(timeout);
    }
  }, [displayText, isTyping, currentPlaceholder, placeholderIndex, placeholders, value]);

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
    
    // Reset the animation to start from the beginning
    if (!value) {
      setDisplayText('');
      setIsTyping(true);
      // Optionally reset to the first placeholder or choose a random one
      setPlaceholderIndex(0); 
      setCurrentPlaceholder(placeholders[0]);
    }
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
        onChange={onChange}
        className={`animated-textarea ${className}`}
        rows={rows}
        placeholder=""
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {!value && !isFocused && (
        <div className="placeholder-text">
          {displayText}
          <span className="cursor-blink"></span>
        </div>
      )}
    </div>
  );
};

export default AnimatedTextarea;
