import React, { useState, useRef, useEffect } from 'react';
import { agents } from '../../../../config';
import './styles.css';

const agentsList = Object.values(agents);

const JudgeChip = ({ onChange }) => {
  const [judge, setJudge] = useState(agentsList.find(agent => agent.id === 'gemini-2.5-flash'));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Notify parent component when judge changes
    if (onChange) {
      onChange(judge);
    }
  }, [judge, onChange]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleJudgeSelect = (selectedJudge) => {
    setJudge(selectedJudge);
    setShowDropdown(false);
  };

  return (
    <div className="judge-chip-container" ref={dropdownRef}>
      <div 
        className="judge-chip" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span className="judge-label">Judge:</span>
        <span className="judge-name">{judge.name}</span>
      </div>
      
      {showDropdown && (
        <div className="judge-dropdown">
          {agentsList.map((agent) => (
            <div 
              key={agent.id} 
              className={`judge-option ${agent.id === judge.id ? 'selected' : ''}`}
              onClick={() => handleJudgeSelect(agent)}
            >
              {agent.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JudgeChip;
