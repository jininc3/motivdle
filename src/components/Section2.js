import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Section2.css'; 

const Section2 = React.forwardRef(({ handleScroll }, ref) => {
  useEffect(() => {
    const quoteyElement = document.querySelector('.quotey');
    setTimeout(() => {
      quoteyElement.classList.add('fade-in');
    }, 800); // Adjust the delay as needed
  }, []);

  return (
    <div id="section2" className="section" ref={ref}>
        <p className="quotey fade-in-element">"Dreams don't work unless you do. - John C. Maxwell"</p>
        <button className="quote-button2" id="transitionButton" onClick={handleScroll}>Motivational Image</button>
      </div>
  );
});

export default Section2;
