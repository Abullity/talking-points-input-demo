import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const ExchangesChip = ({ defaultValue = 3, onChange }) => {
  const [exchanges, setExchanges] = useState(defaultValue);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);
  
  // Define exchange options from 1 to 10
  const options = Array.from({length: 10}, (_, i) => i + 1);
  
  useEffect(() => {
    // Notify parent component when exchanges changes
    if (onChange) {
      onChange(exchanges);
    }
  }, [exchanges, onChange]);
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExchangeSelect = (value) => {
    setExchanges(value);
    setShowOptions(false);
  };

  return (
    <div className="exchanges-chip-container" ref={dropdownRef}>
      <div 
        className="exchanges-chip" 
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className="exchanges-label">Exchanges:</span>
        <span className="exchanges-value">{exchanges}</span>
      </div>
      
      {showOptions && (
        <div className="exchanges-dropdown">
          {options.map((value) => (
            <div 
              key={value} 
              className={`exchange-option ${value === exchanges ? 'selected' : ''}`}
              onClick={() => handleExchangeSelect(value)}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExchangesChip;
