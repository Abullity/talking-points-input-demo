import { useState, useEffect } from 'react'
import './App.css'
import AnimatedTextarea from './components/AnimatedTextarea'


const topics = [
  'Vaccines',
  'Maga',
  'Climate Change',
  'Immigration',
  'China',
  'Israel',
  'Gun Control'
];


function App() {
  const [currentTopic, setCurrentTopic] = useState(topics[0]);
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

  const [inputText, setInputText] = useState('');
  
  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };
  
  const handleSubmit = (text) => {
    // Process the submission
    alert('Processing request: ' + text);
    // You would typically send the text to your backend here
    // Then clear the input
    setInputText('');
  };

  return (
    <div className="app-container">
      <div className="hero-banner">
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
        <p className="subheadline">The best, fact-checked, stress-tested talking points on every issue</p>
        
        <div className="input-section">
          <AnimatedTextarea 
            value={inputText} 
            onChange={handleTextChange} 
            onSubmit={handleSubmit}
            rows={6} 
          />
        </div>
      </div>
    </div>
  )
}

export default App;
