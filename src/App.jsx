import AnimatedHeader from './components/AnimatedHeader';
import AnimatedInput from './components/AnimatedInput';
import './App.css';


function App() {
  return (
    <div className="app-container">
      <div className="hero-banner">
        <AnimatedHeader />
        <p className="subheadline">The best, fact-checked, stress-tested talking points on every issue</p>
        <div className="input-section">
          <AnimatedInput />
        </div>
      </div>
    </div>
  )
}

export default App;
