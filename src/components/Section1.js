import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Section1.css';


function Section1({ handleScroll }) {
  const [isButtonVisible, setButtonVisible] = useState(false);
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);



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
        MOTIVDLE ROUND 1
      </button>

      

      
    </div>
  );
}

export default Section1;