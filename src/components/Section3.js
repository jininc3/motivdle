import React from 'react';
import './Section3.css'; 
import { Link } from 'react-router-dom';
import middleImage from '../assets/image3.jpg'; // Import your image

const Section3 = React.forwardRef(({ handleScroll }, ref) => {
    return (
        <div id="section3" className="section" ref={ref}>
            <div className="overlay-i">
                <img src={middleImage} alt="Middle" className="middle-image"/>
                <button className="image-button" onClick={handleScroll}>Motivational Video</button>
            </div>
        </div>
    );
});

export default Section3;
