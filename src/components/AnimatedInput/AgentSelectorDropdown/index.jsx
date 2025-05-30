import React, { useEffect, useRef } from 'react';
import { agents } from '../../../config';
import './styles.css';

const AgentSelectorDropdown = ({ 
  isVisible, 
  position, 
  onSelectAgent, 
  onClose, 
  filterText = '',
  selectedIndex = 0
}) => {
  const dropdownRef = useRef(null);
  
  // Filter agents based on input after @ symbol
  const filteredAgents = filterText 
    ? Object.values(agents).filter(agent => 
        agent.name.toLowerCase().includes(filterText.toLowerCase())
      )
    : Object.values(agents);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="agent-selector-dropdown" 
      ref={dropdownRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className="dropdown-header">
        <span className="dropdown-title">Select Agent</span>
        <button className="dropdown-close" onClick={onClose}>×</button>
      </div>
      
      {filteredAgents.length > 0 ? (
        <ul className="agent-list">
          {filteredAgents.map((agent, index) => (
            <li 
              key={agent.id} 
              className={`agent-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => onSelectAgent(agent)}
            >
              <span className="agent-name">{agent.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-results">No agents found</div>
      )}
    </div>
  );
};

export default AgentSelectorDropdown;
