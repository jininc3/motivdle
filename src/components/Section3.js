import React, { useEffect, useState, useRef } from 'react';
import './Section3.css';

import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';
import image7 from '../assets/image7.jpg';
import image8 from '../assets/image8.jpg';
import image9 from '../assets/image9.jpg';
import image10 from '../assets/image10.jpg';
import image11 from '../assets/image11.jpg';
import image12 from '../assets/image12.jpg';
import image13 from '../assets/image13.jpg';
import image14 from '../assets/image14.jpg';
import image15 from '../assets/image15.jpg';
import image16 from '../assets/image16.jpg';



const images = [image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14, image15, image16];

const Section3 = React.forwardRef(({ handleScroll }, ref) => {
  const [image, setImage] = useState("");
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