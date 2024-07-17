import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Section1.css';

function Section1({ handleScroll }) {
  const [isButtonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 500); // Adjust the delay time (3000ms = 3 seconds)

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div id="section1" className="section">
      <img src="/motivdle-logo.png" alt="Logo" className="logo" /> {/* Update the path here */}
      <Link to="/"><h1 className="title-home">MOTIVDLE</h1></Link>
      <Link to="/"><p className="subtitle-home">Daily Motivation To Inspire</p></Link>
      <button
        id="scrollButton"
        className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
        onClick={handleScroll}
      >
        MOTIVATIONAL QUOTE
      </button>
    </div>
  );
}

export default Section1;  