import React from 'react';
import './Image.css'; 
import { Link } from 'react-router-dom';
import middleImage from '../assets/image1.jpg'; // Import your image

function Image() {
    return (
        <div>
            <div className="background-image"></div>
            <div className="overlay-i">
                <img src={middleImage} alt="Middle" className="middle-image"/>
                <Link to="/video">
                    <button className="image-button">Go to Video Page</button>
                </Link>
            </div>
        </div>
    );
}

export default Image;
