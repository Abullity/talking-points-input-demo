import { findTextNodes, positionCursorAfter } from './domUtils';
import '../AgentChip/styles.css';


/**
 * Create an agent chip element
 * @param {string} agentName - Name of the agent
 * @returns {Element} - The created agent chip element
 */
export const createAgentChip = (agentName) => {
  const span = document.createElement('span');
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('class', 'agent-chip-container');
  span.innerHTML = `<span class="agent-chip"><span class="agent-label">Agent</span><span class="agent-name">${agentName}</span></span>`;
  return span;
};


/**
 * Check if text contains any agent names
 * @param {string} text - Text to check
 * @param {Array} agents - List of agents
 * @returns {boolean} - True if text contains any agent name
 */
export const containsAgentName = (text, agents) => {
  return Object.values(agents).some(agent => {
    const regex = new RegExp(`\\b${agent.name}\\b`, 'i');
    return regex.test(text);
  });
};


/**
 * Detect and replace agent names in text
 * @param {Element} divRef - Reference to the editable div
 * @param {Array} agents - List of agents from config
 * @param {Function} setValue - Function to update input value
 */
export const detectAndReplaceAgentNames = (divRef, agents, setValue) => {
  if (!divRef) return;
  
  const textNodes = findTextNodes(divRef);
  let replacementsMade = false;
  
  // Process each text node
  textNodes.forEach(textNode => {
    const text = textNode.nodeValue;
    
    // Check for agent names in the text
    Object.values(agents).forEach(agent => {
      const regex = new RegExp(`\\b${agent.name}\\b`, 'i'); // Case insensitive with word boundaries
      if (regex.test(text)) {
        // Create range to replace the text
        const range = document.createRange();
        const startOffset = text.toLowerCase().indexOf(agent.name.toLowerCase());
        range.setStart(textNode, startOffset);
        range.setEnd(textNode, startOffset + agent.name.length);
        
        // Create the agent chip element
        const chipElement = createAgentChip(agent.name);
        
        // Replace the text with the agent chip
        range.deleteContents();
        range.insertNode(chipElement);
        
        // Add a space after the chip if there isn't one
        const nextNode = chipElement.nextSibling;
        if (!nextNode || (nextNode.nodeType === 3 && !nextNode.nodeValue.startsWith(' '))) {
          const space = document.createTextNode(' ');
          chipElement.parentNode.insertBefore(space, chipElement.nextSibling);
        }
        
        // Position cursor after the chip
        positionCursorAfter(chipElement);
        replacementsMade = true;
      }
    });
  });
  
  // Update state if changes were made
  if (replacementsMade && divRef) {
    setValue(divRef.innerText.trim());
  }
};
