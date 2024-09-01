import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Section1.css';

function Section1({ handleScroll }) {
  const [isButtonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 500); // Adjust the delay time

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div id="section1" className="section">
      
      <Link to="/"><h1 className="title-home">MOTIVDLE</h1></Link>
      <Link to="/"><p className="subtitle-home">MOTIVATION ONCE A DAY IS ENOUGH.</p></Link>
      <button
        id="scrollButton"
        className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
        onClick={handleScroll}
      >
        THE MOTIVDLE GAME
      </button>
      <button
        id="gameButton"
        className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
        onClick={() => window.location.href = "/motivation-only"}
      >
        MOTIVATIONAL QUOTE
      </button>
    </div>
  );
}

export default Section1;
