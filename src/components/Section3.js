import React, { useEffect, useState, useRef } from 'react';
import './Section3.css';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';

const images = [image1, image2, image3, image4, image5, image6];

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
        <img ref={imageRef} src={image} alt="Daily" className="middle-image fade-in-element"/>
        <button ref={buttonRef} className="image-button" onClick={handleScroll}>Motivational Video</button>
      </div>
    </div>
  );
});

export default Section3;
