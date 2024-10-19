import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Section1.css';
import logo from '../assets/m-button3.png';

function Section1({ handleScroll }) {
  const [isButtonVisible, setButtonVisible] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false); // State for the nav menu

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleNavMenu = () => {
    setIsNavOpen(!isNavOpen); // Toggle the nav menu
  };

  return (
    <div id="section1" className="section1">
      {/* Title and Subtitle */}
      <Link to="/"><h1 className="title-home">MOTIVDLE</h1></Link>
      

      <p className="description">
          The game where you guess who says the motivational quote, and in hopes of taking away some inspiration.
          I'm a big fan of quotes from actual achievers so the quotes are strictly from real-life winners.
        </p>
      
      {/* Play button to scroll to Section 2 */}
      <button
        id="scrollButton"
        className={`test-button ${isButtonVisible ? 'fade-in' : ''}`}
        onClick={handleScroll}
      >
        THE MOTIVDLE GAME
      </button>

      

      
    </div>
  );
}

export default Section1;
