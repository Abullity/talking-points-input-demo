/**
 * Utility functions for handling agent selection dropdown functionality
 */

/**
 * Check for @ character and position dropdown
 * @param {Element} divRef - Reference to the editable div
 * @param {Function} setShowAgentSelector - State setter for dropdown visibility
 * @param {Function} setDropdownPosition - State setter for dropdown position
 * @param {Function} setAtSignPosition - State setter for @ position
 * @param {Function} setFilterText - State setter for filter text
 * @param {Function} setSelectedAgentIndex - State setter for selected agent index
 * @returns {void}
 */
export const checkForAtSign = (
  divRef,
  setShowAgentSelector,
  setDropdownPosition,
  setAtSignPosition,
  setFilterText,
  setSelectedAgentIndex
) => {
  if (!divRef) return;
  
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  
  // Only process if we're in a text node
  if (node.nodeType !== 3) return;
  
  const text = node.nodeValue;
  const cursorPosition = range.startOffset;
  
  // Check if @ was just typed
  if (cursorPosition > 0 && text[cursorPosition - 1] === '@') {
    // Get position for dropdown
    const tempRange = document.createRange();
    tempRange.setStart(node, cursorPosition - 1);
    tempRange.setEnd(node, cursorPosition);
    
    const rect = tempRange.getBoundingClientRect();
    const inputRect = divRef.getBoundingClientRect();
    
    setDropdownPosition({
      top: rect.bottom - inputRect.top,
      left: rect.left - inputRect.left
    });
    
    setAtSignPosition({
      top: rect.top,
      left: rect.left
    });
    
    setShowAgentSelector(true);
    setFilterText('');
    setSelectedAgentIndex(0); // Reset the selected index when opening dropdown
  } else if (true) { // We'll always call this function's presence check below
    // Update filter text if dropdown is already showing
    // Simple check for filter text in current node
    const textBeforeCursor = text.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
      const filterContent = textBeforeCursor.substring(atIndex + 1);
      setFilterText(filterContent);
    } else {
      // If @ is no longer in current text, close dropdown
      setShowAgentSelector(false);
      setFilterText('');
      setAtSignPosition(null);
      setSelectedAgentIndex(0);
    }
  }
};

/**
 * Filter agents based on filter text
 * @param {Object} agents - List of agents from config
 * @param {string} filterText - Text to filter agents by
 * @returns {Array} - Filtered list of agents
 */
export const getFilteredAgents = (agents, filterText) => {
  return filterText
    ? Object.values(agents).filter(agent => 
        agent.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : Object.values(agents);
};

/**
 * Close agent selector dropdown
 * @param {Function} setShowAgentSelector - State setter for dropdown visibility
 * @param {Function} setFilterText - State setter for filter text
 * @param {Function} setAtSignPosition - State setter for @ position
 * @param {Function} setSelectedAgentIndex - State setter for selected agent index
 */
export const closeAgentSelector = (
  setShowAgentSelector,
  setFilterText,
  setAtSignPosition,
  setSelectedAgentIndex
) => {
  setShowAgentSelector(false);
  setFilterText('');
  setAtSignPosition(null);
  setSelectedAgentIndex(0); // Reset selected index when closing
};
