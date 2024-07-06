import React from 'react';
import './Section4.css'; 
import { Link } from 'react-router-dom';
import videoSrc from '../assets/video1.mp4'; // Import the video file

const Section4 = React.forwardRef((props, ref) => {
    return (
        <div id="section4" className="section" ref={ref}>
            <div className="overlay-v">
                <video className="middle-video" controls>
                    <source src={videoSrc} type="video/mp4" /> {/* Use imported video source */}
                    Your browser does not support the video tag.
                </video>
                <Link to="/comment">
                    <button className="video-button">Go chase your dreams</button>
                </Link>
            </div>
        </div>
    );
});

export default Section4;
