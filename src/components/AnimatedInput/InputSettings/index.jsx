import React, { useState } from 'react';
import './styles.css';
import JudgeChip from './JudgeChip';
import ExchangesChip from './ExchangesChip';

const InputSettings = ({ mode, onJudgeChange, onExchangesChange }) => {
  const handleJudgeChange = (selectedJudge) => {
    if (onJudgeChange) {
      onJudgeChange(selectedJudge);
    }
  };

  const handleExchangesChange = (value) => {
    if (onExchangesChange) {
      onExchangesChange(value);
    }
  };

  if (mode !== 'debate') {
    return null;
  }

  return (
    <div className="input-bottom-settings">
      <div className="input-settings">
        <JudgeChip onChange={handleJudgeChange} />
        <ExchangesChip onChange={handleExchangesChange} />
      </div>
    </div>
  );
};

export default InputSettings;
