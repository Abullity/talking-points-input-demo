import React from 'react';
import './styles.css';

const AgentChip = ({ name }) => {
  return (
    <span className="agent-chip">
      <span className="agent-label">Agent</span>
      <span className="agent-name">{name}</span>
    </span>
  );
};

export default AgentChip;
