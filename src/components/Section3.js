import React, { useEffect, useState, useRef } from 'react';
import './Section3.css';


const Section3 = React.forwardRef(({ handleScroll }, ref) => {
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const imageIndex = today.getDate() % images.length;
    setImage(images[imageIndex]);

    if (imageRef.current) {
      setTimeout(() => {
        imageRef.current.classList.add('fade-in');
      }, 800); // Adjust the delay as needed
    }

    if (buttonRef.current) {
      setTimeout(() => {
        buttonRef.current.classList.add('fade-in');
      }, 1600); // Adjust the delay as needed
    }
  }, []);

  return (
    <div id="section3" className="section" ref={ref}>
      <div className="overlay-i">
        
        <button ref={buttonRef} className="image-button" onClick={handleScroll}>ROUND 2</button>
      </div>
    </div>
  );
});

export default Section3;