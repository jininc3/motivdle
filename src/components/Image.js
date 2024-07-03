import React from 'react';
import './Image.css'; 
import { Link } from 'react-router-dom';
import middleImage from '../assets/image3.jpg'; // Import your image

function Image() {
    return (
        <div>
            <div className="background-image"></div>
           
            
            <div className="overlay-i">
            <Link to="/"><h1 className="title-image">Motivdle</h1></Link>
            <Link to="/"><p className="subtitle-image">Inspire. Empower. Achieve.</p></Link> 
                <img src={middleImage} alt="Middle" className="middle-image"/>
                <Link to="/video">
                    <button className="image-button">Motivational video</button>
                </Link>
            </div>
        </div>
    );
}

export default Image;
