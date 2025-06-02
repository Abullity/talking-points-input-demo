import React, { useState, useEffect } from 'react';
import { agents } from '../../../../config';
import './styles.css';


const agentsList = Object.values(agents);


const JudgeChip = () => {
  const [judge, setJudge] = useState(agentsList[0]);
  
  return (null);
};

export default JudgeChip;
