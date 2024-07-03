// src/components/Quote.js

import React, { useEffect } from 'react';
import './Quote.css'; 
import { Link } from 'react-router-dom';

function Quote() {
  useEffect(() => {
    const quoteyElement = document.querySelector('.quotey');
    setTimeout(() => {
      quoteyElement.classList.add('fade-in');
    }, 400); // Adjust the delay as needed
  }, []);
  
  return (
    <div>
      <div className="background-quote"></div>
        
       
        <div className="overlay2">
        <Link to="/"><h1 className="title-quote">Motivdle</h1></Link>
        <Link to="/"><p className="subtitle-quote">Inspire. Empower. Achieve.</p></Link>
        <p className="quotey fade-in-element">"Dreams don't work unless you do. - John C. Maxwell"</p>
        <Link to="/image">
                    <button className="quote-button2" id="transitionButton">Motivational Image</button>
                </Link>
                </div>
   
    
  </div>
  );
}

export default Quote;
