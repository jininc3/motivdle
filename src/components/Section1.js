import React from 'react';
import { Link } from 'react-router-dom';
import './Section1.css';

function Section1({ handleScroll, isButtonVisible }) {
  return (
    <div id="section1" className="section">
      <img src="/motivdle-logo.png" alt="Logo" className="logo" /> {/* Update the path here */}
      <Link to="/"><h1 className="title-home">Motivdle</h1></Link>
      <Link to="/"><p className="subtitle-home">Daily Motivation to inspire.</p></Link>
      {isButtonVisible && (
        <button id="scrollButton" className="test-button" onClick={handleScroll}>Motivational Quote</button>
      )}
    </div>
  );
}

export default Section1;
