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
        <p className="quotey fade-in-element">"Dreams don't work unless you do. - John C. Maxwell"</p>
        <Link to="/image">
                    <button className="quote-button2">Motivational Image</button>
                </Link>
                </div>
   
    
  </div>
  );
}

export default Quote;
