/**
 * Find all text nodes within a given parent node
 * @param {Node} parentNode - The parent node to search within
 * @returns {Array} - Array of text nodes
 */
export const findTextNodes = (parentNode) => {
  const textNodes = [];
  const traverse = (node) => {
    if (node.nodeType === 3) { // Text node
      textNodes.push(node);
    } else if (node.nodeType === 1 && node.nodeName !== 'SPAN') { // Element node but not a span
      Array.from(node.childNodes).forEach(traverse);
    }
  };
  
  traverse(parentNode);
  return textNodes;
};


/**
 * Find chip element at cursor position
 * @param {Node} node - The node at cursor position
 * @returns {Element|null} - The chip element or null if not found
 */
export const findChipElementAtCursor = (node) => {
  if (!node) return null;
  
  // Check if the node itself is a chip container
  if (node.nodeType === 1 && node.classList && node.classList.contains('agent-chip-container')) {
    return node;
  }
  
  // Check if parent is a chip container
  if (node.parentNode && node.parentNode.classList && 
      node.parentNode.classList.contains('agent-chip-container')) {
    return node.parentNode;
  }
  
  // Check if grandparent is a chip container
  if (node.parentNode && node.parentNode.parentNode && 
      node.parentNode.parentNode.classList && 
      node.parentNode.parentNode.classList.contains('agent-chip-container')) {
    return node.parentNode.parentNode;
  }
  
  return null;
};


/**
 * Position cursor after the specified element
 * @param {Element} element - Element to position cursor after
 */
export const positionCursorAfter = (element) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStartAfter(element);
  range.setEndAfter(element);
  selection.removeAllRanges();
  selection.addRange(range);
};


/**
 * Checks if we're at the beginning of a text node after a chip
 * @param {Node} node - The current node
 * @param {Selection} selection - Current selection
 * @returns {Element|null} - Previous sibling chip element or null
 */
export const getPreviousChipElement = (node, selection) => {
  if (node.nodeType === 3 && selection.anchorOffset === 0) {
    const previousSibling = node.previousSibling;
    if (previousSibling && previousSibling.classList && 
        previousSibling.classList.contains('agent-chip-container')) {
      return previousSibling;
    }
  }
  return null;
};
