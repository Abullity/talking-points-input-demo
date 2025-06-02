import React from 'react';
import './styles.css';
import JudgeChip from './JudgeChip';
import ExchangesChip from './ExchangesChip';

const InputSettings = ({ mode, onJudgeChange }) => {
  const handleJudgeChange = (selectedJudge) => {
    if (onJudgeChange) {
      onJudgeChange(selectedJudge);
    }
  };

  return (
    <div className="input-settings">
      <JudgeChip onChange={handleJudgeChange} />
      <ExchangesChip />
    </div>
  );
};

export default InputSettings;
