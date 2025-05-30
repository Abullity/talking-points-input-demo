/**
 * Utility functions for inserting agent chips
 */
import { createAgentChip } from './agentUtils';
import { positionCursorAfter } from './domUtils';

/**
 * Insert agent chip at @ position
 * @param {Object} agent - Agent object to insert
 * @param {Element} divRef - Reference to the editable div
 * @param {Object} atSignPosition - Position of @ character
 * @param {Function} setValue - Function to update value state
 * @param {Function} closeAgentSelector - Function to close agent selector dropdown
 */
export const insertAgentChip = (agent, divRef, atSignPosition, setValue, closeAgentSelector) => {
  if (!divRef || atSignPosition === null) return;
  
  const selection = window.getSelection();
  const range = document.createRange();
  
  // Create a chip element for the selected agent
  const chipElement = createAgentChip(agent.name);
  
  // Find the @ character and replace it along with any filter text
  const textNodes = document.createTreeWalker(
    divRef, 
    NodeFilter.SHOW_TEXT,
    null, 
    false
  );
  
  let currentNode;
  let found = false;
  
  // Find the text node containing the @ character
  while ((currentNode = textNodes.nextNode()) && !found) {
    const text = currentNode.nodeValue;
    let atIndex = text.indexOf('@');
    
    while (atIndex !== -1) {
      // Check if this is the @ we're looking for
      const nodeRange = document.createRange();
      nodeRange.setStart(currentNode, atIndex);
      nodeRange.setEnd(currentNode, atIndex + 1); // Just the @ symbol
      
      const rect = nodeRange.getBoundingClientRect();
      const matchesPosition = (
        Math.abs(rect.left - atSignPosition.left) < 5 && 
        Math.abs(rect.top - atSignPosition.top) < 5
      );
      
      if (matchesPosition) {
        // Determine how much text after @ to remove (filter text)
        let endIndex = atIndex + 1;
        while (endIndex < text.length && text[endIndex] !== ' ' && text[endIndex] !== '\n') {
          endIndex++;
        }
        
        // Create range to replace @ and filter text
        range.setStart(currentNode, atIndex);
        range.setEnd(currentNode, endIndex);
        
        // Replace with chip
        range.deleteContents();
        range.insertNode(chipElement);
        
        // Add a space after if needed
        const nextNode = chipElement.nextSibling;
        if (!nextNode || (nextNode.nodeType === 3 && !nextNode.nodeValue.startsWith(' '))) {
          const space = document.createTextNode(' ');
          chipElement.parentNode.insertBefore(space, chipElement.nextSibling);
        }
        
        // Position cursor after chip
        positionCursorAfter(chipElement);
        found = true;
        break;
      }
      
      atIndex = text.indexOf('@', atIndex + 1);
    }
    
    if (found) break;
  }
  
  // Update input value
  if (found) {
    setValue(divRef.innerText.trim());
  }
  
  // Close dropdown
  closeAgentSelector();
};
