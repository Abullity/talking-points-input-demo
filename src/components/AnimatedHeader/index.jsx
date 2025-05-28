import { useState, useEffect } from 'react';
import './styles.css';

const topics = [
  'Vaccines',
  'Maga',
  'Climate Change',
  'Immigration',
  'China',
  'Israel',
  'Gun Control'
];


const AnimatedHeader = () => {
  const [currentTopic, setCurrentTopic] = useState(topics[Math.floor(Math.random() * topics.length)]);
  const [nextTopic, setNextTopic] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  
  useEffect(() => {
    const rotateTopic = () => {
      const currentIndex = topics.indexOf(currentTopic);
      const nextIndex = (currentIndex + 1) % topics.length;
      
      setNextTopic(topics[nextIndex]);
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentTopic(topics[nextIndex]);
        setIsChanging(false);
      }, 600);
    };
    
    const interval = setInterval(rotateTopic, 3000);
    return () => clearInterval(interval);
  }, [currentTopic, topics]);

  return (
    <h1 className="headline">
      <div className="headline-fixed">Talking Points on</div>
      <div className="topic-container">
        {isChanging ? (
          <>
            <div className="topic current-topic slide-out">{currentTopic}</div>
            <div className="topic next-topic slide-in">{nextTopic}</div>
          </>
        ) : (
          <div className="topic">{currentTopic}</div>
        )}
      </div>
    </h1>
  );
};

export default AnimatedHeader;