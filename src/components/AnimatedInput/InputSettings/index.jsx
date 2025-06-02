import React from 'react';
import './styles.css';
import JudgeChip from './JudgeChip';
import ExchangesChip from './ExchangesChip';


const InputSettings = ({ mode }) => {
  return (
    <div className="input-settings">
      <JudgeChip />
      <ExchangesChip />
    </div>
  );
};

export default InputSettings;
