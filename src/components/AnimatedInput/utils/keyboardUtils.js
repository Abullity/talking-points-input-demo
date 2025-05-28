import { findChipElementAtCursor, getPreviousChipElement } from './domUtils';


/**
 * Handle backspace key for chip deletion
 * @param {Event} e - Keyboard event
 * @returns {boolean} - True if event was handled
 */
export const handleBackspaceKey = (e) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;
  
  const node = selection.anchorNode;
  if (!node) return false;
  
  // Check if we're at the beginning of a text node right after a chip
  const previousChip = getPreviousChipElement(node, selection);
  if (previousChip) {
    e.preventDefault();
    previousChip.remove();
    return true;
  }
  
  // Check if the current element or parent is a chip container
  const chipElement = findChipElementAtCursor(node);
  if (chipElement) {
    e.preventDefault();
    chipElement.remove();
    return true;
  }
  
  return false;
};


/**
 * Handle enter key for submission or newline
 * @param {Event} e - Keyboard event
 * @param {string} value - Current input value
 * @param {Function} onSubmit - Function to call on submit
 * @returns {boolean} - True if event was handled
 */
export const handleEnterKey = (e, value, onSubmit) => {
  if (e.shiftKey) {
    // Shift+Enter adds a newline - let default behavior happen
    return false;
  } else {
    // Just Enter submits the form
    e.preventDefault();
    if (value && value.trim()) {
      onSubmit(value);
      return true;
    }
    return false;
  }
};
