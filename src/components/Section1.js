
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Ensure Link is imported from react-router-dom
import './Section1.css';
import logo from '../assets/m-button3.png';


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
      <Link to="/"><p className="subtitle-home">GUESS WHO SAYS THE INSPIRATION</p></Link>
      
      <button
        id="scrollButton"
        className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
        onClick={handleScroll}
      >
        <img src={logo} alt="Logo" className="button-logo" /> {/* Add your logo here */}
        THE MOTIVDLE GAME
      </button>
      
    </div>
  );
}

export default Section1;