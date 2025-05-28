import { useState, useEffect, useRef } from 'react';
import useAnimatedPlaceholder from '../../hooks/useAnimatedPlaceholder';
import useDebounce from '../../hooks/useDebounce';
import AgentChip from './AgentChip';
import './styles.css';

// List of names to detect and convert to agent chips
const agentNames = [
  'Donald Trump',
  'Greta Thunberg',
  'Elon Musk',
  'Alex Epstein',
  'Joe Biden'
];

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
      debounce(() => detectAndReplaceAgentNames());
    }
  };
  
  // Function to detect agent names in text and convert them to chips
  const detectAndReplaceAgentNames = () => {
    console.log('Checking for agent names...');
    if (!divRef.current) return;
    
    const content = divRef.current.innerHTML;
    const textNodes = [];
    
    // Find all text nodes in the div
    const findTextNodes = (node) => {
      if (node.nodeType === 3) { // Text node
        textNodes.push(node);
      } else if (node.nodeType === 1 && node.nodeName !== 'SPAN') { // Element node but not a span
        Array.from(node.childNodes).forEach(findTextNodes);
      }
    };
    
    findTextNodes(divRef.current);
    
    // Process each text node
    textNodes.forEach(textNode => {
      const text = textNode.nodeValue;
      
      // Check for agent names in the text
      agentNames.forEach(name => {
        const regex = new RegExp(`\\b${name}\\b`, 'i'); // Case insensitive search with word boundaries
        if (regex.test(text)) {
          // Create range to replace the text
          const range = document.createRange();
          const startOffset = text.toLowerCase().indexOf(name.toLowerCase());
          range.setStart(textNode, startOffset);
          range.setEnd(textNode, startOffset + name.length);
          
          // Create the agent chip element
          const span = document.createElement('span');
          span.setAttribute('contenteditable', 'false');
          span.setAttribute('class', 'agent-chip-container');
          span.innerHTML = `<span class="agent-chip"><span class="agent-label">Agent</span><span class="agent-name">${name}</span></span>`;
          
          // Replace the text with the agent chip
          range.deleteContents();
          range.insertNode(span);
          
          // Add a space after the chip if there isn't one
          const nextNode = span.nextSibling;
          if (!nextNode || (nextNode.nodeType === 3 && !nextNode.nodeValue.startsWith(' '))) {
            const space = document.createTextNode(' ');
            span.parentNode.insertBefore(space, span.nextSibling);
          }
          
          // Position cursor after the chip
          const selection = window.getSelection();
          const newRange = document.createRange();
          newRange.setStartAfter(span);
          newRange.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      });
    });
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
    // Check for a backspace to handle chips deletion
    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      // Get the element before the cursor
      const node = selection.anchorNode;
      if (!node) return;
      
      // Check if we're at the beginning of a text node right after a chip
      if (node.nodeType === 3 && selection.anchorOffset === 0) {
        const previousSibling = node.previousSibling;
        if (previousSibling && previousSibling.classList && previousSibling.classList.contains('agent-chip-container')) {
          e.preventDefault();
          previousSibling.remove();
          return;
        }
      }
      
      // Check if the current element or parent is the chip container
      let chipElement = null;
      if (node.nodeType === 1 && node.classList && node.classList.contains('agent-chip-container')) {
        chipElement = node;
      } else if (node.parentNode && node.parentNode.classList && node.parentNode.classList.contains('agent-chip-container')) {
        chipElement = node.parentNode;
      } else if (node.parentNode && node.parentNode.parentNode && 
                node.parentNode.parentNode.classList && 
                node.parentNode.parentNode.classList.contains('agent-chip-container')) {
        chipElement = node.parentNode.parentNode;
      }
      
      if (chipElement) {
        e.preventDefault();
        chipElement.remove();
        return;
      }
    }
    
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
