/**
 * Utility functions for handling keyboard navigation
 */

/**
 * Handle keyboard navigation in agent selector
 * @param {KeyboardEvent} e - The keyboard event
 * @param {boolean} showAgentSelector - Whether the agent selector is visible
 * @param {Array} filteredAgentsList - List of filtered agents
 * @param {Function} setSelectedAgentIndex - State setter for selected agent index
 * @param {Function} insertAgentChip - Function to insert agent chip
 * @param {Function} closeAgentSelector - Function to close agent selector
 * @param {Function} handleEnterKey - Function to handle enter key normally
 * @param {string} value - Current input value
 * @param {Function} onSubmit - Function to submit the form
 * @returns {boolean} - Whether the event was handled
 */
export const handleKeyboardNavigation = (
  e,
  showAgentSelector,
  filteredAgentsList,
  selectedAgentIndex,
  setSelectedAgentIndex,
  insertAgentChip,
  closeAgentSelector,
  handleEnterKey,
  value,
  onSubmit
) => {
  // Handle backspace separately
  
  // If dropdown is visible, handle navigation
  if (showAgentSelector) {
    if (filteredAgentsList.length > 0) {
      // Arrow up - navigate to previous agent
      if (e.key === 'ArrowUp') {
        e.preventDefault(); // Prevent cursor movement
        setSelectedAgentIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : filteredAgentsList.length - 1
        );
        return true;
      }
      
      // Arrow down - navigate to next agent
      if (e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent cursor movement
        setSelectedAgentIndex(prevIndex => 
          prevIndex < filteredAgentsList.length - 1 ? prevIndex + 1 : 0
        );
        return true;
      }
      
      // Enter - select the currently highlighted agent
      if (e.key === 'Enter') {
        e.preventDefault();
        insertAgentChip(filteredAgentsList[selectedAgentIndex]);
        return true;
      }
    }
    
    // Close dropdown on escape
    if (e.key === 'Escape') {
      closeAgentSelector();
      e.preventDefault();
      return true;
    }
    
    return false;
  } else if (e.key === 'Enter') {
    // Normal Enter handling when dropdown isn't visible
    return handleEnterKey(e, value, onSubmit);
  }
  
  return false;
};
