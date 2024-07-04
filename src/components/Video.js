import React from 'react';
import './Video.css'; // Import the CSS file for the video page
import { Link } from 'react-router-dom';
import videoSrc from '../assets/video1.mp4'; // Import the video file

function Video() {
    return (
        <div>
            <div className="background-video"></div>
            
            <div className="overlay-v">
            <Link to="/"><h1 className="title-video">Motivdle</h1></Link>
            <Link to="/"><p className="subtitle-video">Inspire. Empower. Achieve.</p></Link>
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
}

export default Video;
