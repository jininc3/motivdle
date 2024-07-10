import React from 'react';
import './Section4.css'; 
import { Link } from 'react-router-dom';
import video1 from '../assets/video2.mp4';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';
// Import other videos as needed

const videoFiles = [
    video1,
    video2,
    video3,
    // Add more video imports as needed
];

const getTodaysVideo = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return videoFiles[dayOfYear % videoFiles.length]; // Cycle through videos
};

const Section4 = React.forwardRef((props, ref) => {
    const videoSrc = getTodaysVideo();
    console.log(`Loading video: ${videoSrc}`); // Debugging line

    return (
        <div id="section4" className="section" ref={ref}>
            <div className="overlay-v">
                <video className="middle-video" controls>
                    <source src={videoSrc} type="video/mp4" />
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
