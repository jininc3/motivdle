import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const today = new Date();
    const imageIndex = today.getDate() % images.length;
    setImage(images[imageIndex]);
  }, []);

  return (
    <div id="section3" className="section" ref={ref}>
      <div className="overlay-i">
        <img src={image} alt="Daily" className="middle-image"/>
        <button className="image-button" onClick={handleScroll}>Motivational Video</button>
      </div>
    </div>
  );
});

export default Section3;
