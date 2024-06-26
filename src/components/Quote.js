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
        <p className="quotey fade-in-element">“The best way to predict the future is to invent it.” - Alan Kay</p>
        <Link to="/image">
                    <button className="quote-button2">Go to Image Page</button>
                </Link>
                </div>
   
    
  </div>
  );
}

export default Quote;
