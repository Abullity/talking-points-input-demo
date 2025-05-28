import React from 'react';
import './styles.css';

const AgentChip = ({ name, contentEditable=false }) => {
  return (
    <span className="agent-chip" contentEditable={contentEditable}>
      <span className="agent-label">Agent</span>
      <span className="agent-name">{name}</span>
    </span>
  );
};

export default AgentChip;
